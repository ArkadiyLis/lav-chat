// server.js

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const socketIo = require("socket.io");

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
    let user = {};
    let users = {};
    let messages = [];

    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true)
        handle(req, res, parsedUrl);
    });

    const io = socketIo(server);

    io.on("connection", (socket) => {
        console.log('connection socket');

        socket.on("auth", ({name}) => {
            user = {id: socket.id, name};
            users[socket.id] = {id: socket.id, name};
            socket.emit("auth.success", user);
            socket.emit("messages", messages);
            io.emit("users", users);
        });

        socket.on("message", (message) => {
            const msg = {
                user: users[socket.id],
                message,
            };
            messages.push(msg);
            io.emit("messages", messages);
        });

        socket.once("disconnect", () => {
            user = null;
            delete users[socket.id];

            io.emit("users", users);
        });
    });

    server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
})
