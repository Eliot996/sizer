import { Router } from "express";
const router = Router();

import upload from "../utils/upload.js";
import fs from "fs";
import users from "../utils/users.js";

router.post("/create", async (req, res) => {
    const userID = await users.create(req.body.email, req.body.password);

    if (userID) {
        req.session.userID = userID;
        res.send({ userID: userID });
    } else {
        res.status(400).send("Username is likely taken");
    }
});

router.post("/login", async (req, res) => {
    const userID = await users.authenticate(req.body.email, req.body.password);

    if (userID) {
        req.session.userID = userID;
        res.send({ userID: userID });
    } else {
        res.sendStatus(401);
    }
});

router.get("/check", async (req, res) => {
    if (req.session.userID) {
        res.send({ userID: req.session.userID });
    } else {
        res.status(401).send({ message: "please login"});
    }
});

router.get("/logout", async (req, res) => {
    req.session.destroy(() => res.send({ message: "logged out"}));
});

router.get("/profile", async (req, res) => { 
    if (!req.session.userID) {
        res.status(401).send({ message: "please login"});
        return;
    }

    const data = await users.getProfileData(req.session.userID);

    res.send(data);
});

router.patch("/profile", async (req, res) => {
    if (!req.session.userID) res.status(401).send({ message: "please login"});

    const results = {};

    if (req.body.email) {
        results.email = await users.updateEmail(req.session.userID, req.body.email);
    }

    if (req.body.updatedPassword && req.body.passwordOld) {
        results.password = await users.updatePassword(req.session.userID, req.body.passwordOld, req.body.updatedPassword);
    }

    if (results.email || results.password) {
        res.send(results);
    } else {
        res.sendStatus(200);
    }
});

router.get("/profile/images", async (req, res) => {
    if (!req.session.userID) res.status(401).send({ message: "please login"});

    const images = await users.getImages(req.session.userID);

    res.send(images);
});

router.get("/profile/images/:filename", async (req, res) => {
    if (!req.params.filename || req.params.filename == "null") {
        res.sendStatus(404);
        return;
    }

    await users.getImage(req.session.userID, req.params.filename);

    try {
        // eslint-disable-next-line no-undef
        res.sendFile(process.cwd() + "/tmp/downloads/" + req.params.filename, (err) => {
            if (err) {
                res.sendStatus(404);            
            }
            // eslint-disable-next-line no-undef
            fs.unlink(process.cwd() + "/tmp/downloads/" + req.params.filename, (err) => {if (err) throw err;});
        });
    } catch (error) {
        res.sendStatus(404);
    }
}); 

router.post("/profile/images", upload.array("files", 12), async (req, res) => {
    if (!req.files) {
        console.info("No files received");
    } else {
        const result = await users.uploadImages(req.session.userID, req.files);
  
        if (result) return res.sendStatus(200);
    }
    return res.sendStatus(400);
});

export default router;