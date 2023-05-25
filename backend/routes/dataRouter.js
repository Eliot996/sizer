import { Router } from "express";
const router = Router();

router.get('/data', (req, res) => {
    if (req.session.userID) {
        res.send({ secret: 42 });
    } else {
        res.status(401).send({ message: 'Try logging in first!'})
    }
});

export default router;