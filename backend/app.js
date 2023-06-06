// eslint-disable-next-line no-unused-vars
import dotenv from "dotenv/config";
import express from "express";

const app = express();

app.use(express.json());

import session from "express-session";
const sessionMiddleware = session({
    // eslint-disable-next-line no-undef
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
});
app.use(sessionMiddleware);

import helmet from "helmet";
app.use(helmet());

import cors from "cors";
app.use(cors({
    credentials: true,
    origin: true
}));

import http from "http";
const server = http.createServer(app);

import setupSockets from "./utils/sockets.js";
setupSockets(server, sessionMiddleware);

function sessionAuthorizer(req, res, next) {
    if (req.session.userID) {
        next();
    } else {
        res.status(401).send({ message: "Try logging in first!"});
    }
}

import userRouter from "./routes/userRouter.js";
app.use(userRouter);

import shoeRouter from "./routes/shoeRouter.js";
app.use("/shoes", sessionAuthorizer, shoeRouter);

const PORT = 8080;
server.listen(PORT, () => console.log("Server is running on", server.address().port));