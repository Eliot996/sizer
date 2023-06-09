import { Router } from "express";
const router = Router();

import fs from "fs";

import shoes from "../utils/shoes.js";
import upload from "../utils/upload.js";

router.post("/", async (req, res) => {
    const shoe = req.body;
    const shoeID = await shoes.create(shoe);
    
    res.send({message: "created or found shoe", shoeID});
});

router.get("/", async (req, res) => {
    const shoeList = await shoes.getAll();

    res.send(shoeList);
});

router.post("/:brand/:name/:size/images", upload.array("files", 12), async (req, res) => {
    const shoe = {brand: req.params.brand, name: req.params.name, size: req.params.size };

    if (!req.files) {
        console.info("No files received");
    } else {
        const result = await shoes.uploadImages(shoe, req.session.userID, req.files);
  
        if (result) return res.sendStatus(200);
    }
    return res.sendStatus(400);
});

router.get("/:brand/:name/:size/images", async (req, res) => {
    const shoe = {brand: req.params.brand, name: req.params.name, size: req.params.size };

    const images = await shoes.getShoeImages(shoe);

    res.send(images);
});

router.get("/:brand/:name/:size/images/:filename", async (req, res) => {
    if (!req.params.filename || req.params.filename == "null") {
        res.sendStatus(404);
        return;
    }

    const shoe = {brand: req.params.brand, name: req.params.name, size: req.params.size };

    await shoes.getShoeImage(shoe, req.params.filename);

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

export default router;