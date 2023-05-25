import dotenv from "dotenv/config";
import express from "express";

const app = express();

app.use(express.json());

import session from "express-session";
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

import helmet from "helmet";
app.use(helmet());

import cors from "cors";
app.use(cors({
    credentials: true,
    origin: true
}));

import userRouter from "./routes/userRouter.js";
app.use(userRouter);

import dataRouter from './routes/dataRouter.js';
app.use(dataRouter);

const PORT = 8080;
const server = app.listen(PORT, () => console.log("Server is running on", server.address().port));