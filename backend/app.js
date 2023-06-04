import dotenv from "dotenv/config";
import express from "express";

const app = express();

app.use(express.json());

import session from "express-session";
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
})
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

import { Server } from "socket.io";
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["*"]
    }
});

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));

import shoes from "./utils/shoes.js";

io.on("connection", (socket) => {
    if (socket.request.session.userID) {
        console.log("Welcome", socket.request.session.userID);
    }

    socket.on("delete image", (data) => {
        shoes.deleteImage({brand: data.brand, name: data.name, size: data.size}, data.image);

        io.emit("deleted image", {image: data.image})
    });

});

import fileStore from "./utils/fileStore.js";
import upload from "./utils/upload.js";

import fs from "fs";

app.post('/upload', upload.array('files', 12), (req, res) => {
    if (!req.files) {
      console.log("No files received");

      return res.send({
        success: false
      });
  
    } else {
      req.files.forEach((image) => {
        fileStore.uploadFile("newshare1685266773191", "newdirectoryhelp", image.filename);
        fs.unlink(process.cwd() + "/" + image.path, (err) => {if (err) throw err});
      });

      return res.send({ success: true });
    }
  });


app.get("/image/:fileName", async (req, res) => {
  const fileName = req.params.fileName;

  await fileStore.downloadFile("newshare1685266773191", "newdirectoryhelp", fileName);

  res.sendFile(process.cwd() + "/tmp/downloads/" + fileName);

  fs.unlink(process.cwd() + "/tmp/downloads/" + fileName, (err) => {if (err) throw err});
})

function sessionAuthorizer(req, res, next) {
  if (req.session.userID) {
    next();
  } else {
    res.status(401).send({ message: 'Try logging in first!'})
  }
}

import userRouter from "./routes/userRouter.js";
app.use(userRouter);

import dataRouter from './routes/dataRouter.js';
app.use(dataRouter);

import shoeRouter from "./routes/shoeRouter.js"
app.use("/shoes", sessionAuthorizer, shoeRouter);

const PORT = 8080;
server.listen(PORT, () => console.log("Server is running on", server.address().port));