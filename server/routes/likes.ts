import express from 'express';

const router = express.Router();

const Like = require("../../models/Like");

//Get likes by item ID

router.get("/:itemId", async (req: any, res: any) => {
    try {
        const likes = await Like.find({ itemId: req.params.itemId });
        res.status(200).json(likes);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Get like by ID

router.get("/:likeId", async (req: any, res: any) => {
    try {
        const like = await Like.findById(req.params.likeId);
        res.status(200).json(like);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Get likes by user ID

router.get("/user/:userId", async (req: any, res: any) => {
    try {
        const likes = await Like.find({ userId: req.params.userId });
        res.status(200).json(likes);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Create like, or delete if already exists

router.post("/:itemId", async (req: any, res: any) => {
    try {
        const userId = req.user?._id;
        const existingLike = await Like.findOne({ userId, itemId: req.params.itemId });
        if (existingLike) {
            await existingLike.remove();
            return res.status(200).json({ message: "Like removed" });
        }
        const like = new Like({
            userId: userId,
            itemId: req.params.itemId,
        });
        const savedLike = await like.save();
        res.status(200).json(savedLike);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});
