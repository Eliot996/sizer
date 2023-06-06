/* eslint-disable no-undef */
import multer from "multer";
import path from "path";
import fs from "fs";

// making sure the tmp folders are made
fs.mkdir(process.cwd() + "/tmp/uploads", {recursive: true}, () => {});
fs.mkdir(process.cwd() + "/tmp/downloads", {recursive: true}, () => {});

const storage = multer.diskStorage({
    destination: function(_req, _file, callback) {
        callback(null, "./tmp/uploads/");
    },
    filename: function (_req, file, callback) {
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        callback(null, uniquePrefix + path.extname(file.originalname));
    }
});

const fileFilter = (_req, file, callback) => {
    const fileTypes = /png|jpg|jpeg/;
    const fileExtention = path.extname(file.originalname).toLowerCase();

    const extname = fileTypes.test(fileExtention);
    const mimetype = fileTypes.test(file.mimetype);
    
    if (extname && mimetype) {
        callback(null, true);
    } else {
        callback("Please only upload images", false);
    }
};

const upload = multer({storage, fileFilter, limits: {fileSize: 4 * 1024 * 1024}});

export default upload ;