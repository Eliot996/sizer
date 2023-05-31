import { Router } from "express";
const router = Router();

import shoes from "../utils/shoes.js";

router.post('/', async (req, res, next) => {
    const shoe = req.body;
    const shoeID = await shoes.create(shoe);
    
    res.send({message: "created or found shoe", shoeID});
});

export default router;