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

import multer from "multer";
import path from "path";

app.use("/upload", express.urlencoded({extended: true}));

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './tmp/uploads/');
    },
    filename: function (req, file, callback) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        callback(null, uniquePrefix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, callback) => {
    const fileTypes = /png|jpg|jpeg/;
    const fileExtention = path.extname(file.originalname).toLowerCase();

    const extname = fileTypes.test(fileExtention);
    const mimetype = fileTypes.test(file.mimetype);
    
    if (extname && mimetype) {
        callback(null, true);
    } else {
        callback("Please only upload images", false);
    }
}

const upload = multer({storage, fileFilter});

app.post('/upload', upload.array('files', 12), (req, res) => {
    if (!req.files) {
      console.log("No files received");
      return res.send({
        success: false
      });
  
    } else {
      console.log('received', req.files.length, "files");
      return res.send({
        success: true
      });
    }
  });

import userRouter from "./routes/userRouter.js";
app.use(userRouter);

import dataRouter from './routes/dataRouter.js';
app.use(dataRouter);

const PORT = 8080;
const server = app.listen(PORT, () => console.log("Server is running on", server.address().port));