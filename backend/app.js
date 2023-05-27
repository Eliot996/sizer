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

app.use("/upload", express.urlencoded({extended: true}));

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, './tmp/uploads/');
    },
    filename: function (req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        callback(null, uniqueSuffix + file.originalname.substring(file.originalname.lastIndexOf(".")))
    }
  });

const upload = multer({storage: storage});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      console.log("No file received");
      return res.send({
        success: false
      });
  
    } else {
      console.log('file received', req.file.filename);
      return res.send({
        success: true
      })
    }
  });

import userRouter from "./routes/userRouter.js";
app.use(userRouter);

import dataRouter from './routes/dataRouter.js';
app.use(dataRouter);

const PORT = 8080;
const server = app.listen(PORT, () => console.log("Server is running on", server.address().port));