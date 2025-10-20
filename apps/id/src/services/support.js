const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000'

export const createTicket = async (subject, category, description, attachments, priority = 'MEDIUM') => {
    try {
        // Déterminer si on utilise FormData ou JSON
        const hasAttachments = attachments && attachments.length > 0;
        let body;
        let headers = {};

        if (hasAttachments) {
            // Utiliser FormData pour les pièces jointes
            body = new FormData();
            body.append('subject', subject);
            body.append('category', category);
            body.append('body', description);
            body.append('priority', priority);

            attachments.forEach((file, index) => {
                body.append(`attachments`, file);
            });
        } else {
            // Utiliser JSON si pas de pièces jointes
            body = JSON.stringify({
                subject,
                category,
                body: description,
                attachments,
                priority
            });
            headers = {
                'Content-Type': 'application/json',
            };
        }

        const resp = await fetch(`${API_URL}/api/support/tickets`, {
            method: 'POST',
            credentials: 'include',
            headers,
            body
        });

        if (!resp.ok) {
            const errorData = await resp.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to create support ticket");
        }

        const data = await resp.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error creating ticket:', error);
        throw error;
    }
};