import { Server } from "socket.io";
import shoes from "./shoes.js";
import users from "./users.js";

export default function setupSockets(server, sessionMiddleware) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["*"]
        }
    });

    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
    io.use(wrap(sessionMiddleware));

    io.on("connection", (socket) => {
        if (socket.request.session.userID) {
            console.log("Welcome", socket.request.session.userID);
        }

        socket.on("delete image", (data) => {
            if (data.brand) {
                shoes.deleteImage({brand: data.brand, name: data.name, size: data.size}, data.image);
                io.emit("deleted image", {image: data.image});
            } else {
                users.deleteImage(data.userID, data.image);
                socket.emit("deleted image", {image: data.image});
            }

        });

    });
}