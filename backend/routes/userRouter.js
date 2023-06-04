import users from "../utils/users.js";
import { Router } from "express";
const router = Router();

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
        return
    }

    const data = await users.getProfileData(req.session.userID)

    res.send(data);
});

router.patch("/profile", async (req, res) => {
    if (!req.session.userID) res.status(401).send({ message: "please login"});

    const results = {};

    if (req.body.email) {
        results.email = await users.updateEmail(req.session.userID, req.body.email);
    }

    if (req.body.updatedPassword && req.body.passwordOld) {
        results.password = await users.updatePassword(req.session.userID, req.body.passwordOld, req.body.updatedPassword)
    }

    res.send(results)
});

export default router;