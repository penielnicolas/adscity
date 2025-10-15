const { prisma } = require("../config/db");
const ActivityService = require("../services/activity.service");
const { sendToSupportQueue, notifyUser, notifySupport } = require("../services/push-notification.service");
const { uploadToStorage } = require("../services/storage.service");
const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

const makeReference = async () => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    // simple: TCK_<date>_<random> — en prod tu peux faire sequence
    return `TCK_${date}_${Math.floor(Math.random() * 90000) + 10000}`;
};

exports.createTicket = catchAsync(async (req, res, next) => {
    const user = req.user; // peut être guest si tu acceptes guests
    const { subject, category, body, priority } = req.validatedData;
    const files = req.files || [];

    const reference = await makeReference();

    // transaction: create ticket -> create message -> upload & create attachments
    const created = await prisma.$transaction(async (tx) => {
        const ticket = await tx.ticket.create({
            data: {
                reference,
                userId: user.id,
                subject,
                category,
                priority: priority || 'MEDIUM',
            }
        });

        const message = await tx.ticketMessage.create({
            data: {
                ticketId: ticket.id,
                senderId: user.id,
                body,
                internal: false
            }
        });

        // attachments upload
        for (const file of files) {
            const uploaded = await uploadToStorage(file);
            await tx.ticketAttachment.create({
                data: {
                    ticketId: ticket.id,
                    messageId: message.id,
                    filename: uploaded.filename,
                    url: uploaded.url,
                    mimeType: uploaded.mimeType,
                    size: uploaded.size
                }
            });
        }

        return { ticket, message };
    });

    // log activity
    if (user) await ActivityService.log(user.id, "TICKET_CREATED", `Création ticket ${reference}`, req);

    // 🚀 Notifier support
    await sendToSupportQueue(created.ticket);

    res.status(201).json({ success: true, data: { reference: created.ticket.reference, id: created.ticket.id } });
});

exports.getTicket = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: {
            messages: { orderBy: { createdAt: 'asc' }, include: { attachments: true, sender: { select: { id: true, firstName: true, lastName: true, email: true } } } },
            attachments: true
        }
    });

    if (!ticket) return next(new AppError('Ticket non trouvé', 404));

    // Ownership check
    if (!req.user?.roles?.includes('SUPPORT') && !req.user?.roles?.includes('ADMIN')) {
        if (!ticket.userId || ticket.userId !== req.user?.id) {
            return next(new AppError('Accès refusé', 403));
        }
    }

    res.json({ success: true, data: ticket });
});

exports.addMessage = catchAsync(async (req, res, next) => {
    const user = req.user;
    const ticketId = req.params.id;
    const { body, internal } = req.validatedData;
    const files = req.files || [];

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return next(new AppError('Ticket non trouvé', 404));

    // Ownership / permission
    const isSupport = user?.roles?.includes('SUPPORT') || user?.roles?.includes('ADMIN');
    if (!isSupport && ticket.userId && ticket.userId !== user.id) {
        return next(new AppError('Accès refusé', 403));
    }

    // If non-support tries to create internal message => forbid
    if (internal && !isSupport) {
        return next(new AppError('Impossible d\'envoyer un message interne', 403));
    }

    const result = await prisma.$transaction(async (tx) => {
        const message = await tx.ticketMessage.create({
            data: {
                ticketId,
                senderId: user?.id || null,
                body,
                internal: !!internal
            }
        });

        for (const file of files) {
            const uploaded = await uploadToStorage(file);
            await tx.ticketAttachment.create({
                data: {
                    ticketId,
                    messageId: message.id,
                    filename: uploaded.filename,
                    url: uploaded.url,
                    mimeType: uploaded.mimeType,
                    size: uploaded.size
                }
            });
        }

        // update ticket status / updatedAt
        await tx.ticket.update({ where: { id: ticketId }, data: { status: isSupport ? 'IN_PROGRESS' : ticket.status, updatedAt: new Date() } });

        return message;
    });

    // 🚀 Notify opposite party
    if (isSupport) {
        await notifyUser(ticket.userId, result, ticket);
    } else {
        await notifySupport(result, ticket);
    }

    res.status(201).json({ success: true, data: result });
});

exports.closeTicket = catchAsync(async (req, res, next) => {
    const ticketId = req.params.id;
    const user = req.user;

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return next(new AppError('Ticket non trouvé', 404));

    const isSupport = user?.roles?.includes('SUPPORT') || user?.roles?.includes('ADMIN');
    if (!isSupport && ticket.userId !== user.id) {
        // maybe allow user to close own ticket; else forbid
        return next(new AppError('Accès refusé', 403));
    }

    await prisma.ticket.update({ where: { id: ticketId }, data: { status: 'CLOSED' } });
    res.json({ success: true });
});