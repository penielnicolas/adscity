const { Server } = require('socket.io');

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: ["http://192.168.31.252:8081", "exp://192.168.31.252:8081", "*"],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("🟢 Nouveau client connecté :", socket.id);

        socket.on("join_room", (room) => {
            socket.join(room);
            console.log(`📍 ${socket.id} a rejoint la room ${room}`);
        });

        socket.on("send_message", (data) => {
            if (!data.room || !data.message) return;
            io.to(data.room).emit("receive_message", data);
        });

        socket.on("disconnect", () => {
            console.log("🔴 Client déconnecté :", socket.id);
        });
    });

    return io;
};

module.exports = initSocket;