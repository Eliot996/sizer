import { Router } from "express";
const router = Router();

import shoes from "../utils/shoes.js";
import upload from "../utils/upload.js";

router.post('/', async (req, res, next) => {
    const shoe = req.body;
    const shoeID = await shoes.create(shoe);
    
    res.send({message: "created or found shoe", shoeID});
});

router.post("/:brand/:name/:size/images", upload.array("files", 12), (req, res) => {
    const shoe = {brand: req.params.brand, name: req.params.name, size: req.params.size }

    if (!req.files) {
        console.log("No files received");
    } else {
        const result = shoes.uploadImages(shoe, req.session.userID, req.files)
  
        if (result) return res.sendStatus(200);
    }
    return res.sendStatus(400);
});

export default router;