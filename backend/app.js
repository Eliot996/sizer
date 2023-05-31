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

import userRouter from "./routes/userRouter.js";
app.use(userRouter);

import dataRouter from './routes/dataRouter.js';
app.use(dataRouter);

const PORT = 8080;
const server = app.listen(PORT, () => console.log("Server is running on", server.address().port));