import express from 'express';

const router = express.Router();

import { Response, NextFunction } from "express";
import Request from "../interfaces/Request";
import mongoose from 'mongoose';

const Like = require("../models/Like");
//Get likes by item ID

router.get("/:itemId", async (req: Request, res: Response) => {
    try {
        const likes = await Like.find({ itemId: req.params.itemId });
        res.status(200).json(likes);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Get like by ID

router.get("/:likeId", async (req: Request, res: Response) => {
    try {
        const like = await Like.findById(req.params.likeId);
        res.status(200).json(like);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Get likes by user ID

router.get("/user/:userId", async (req: Request, res: Response) => {
    try {
        const likes = await Like.find({ userId: req.params.userId });
        res.status(200).json(likes);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Create like, or delete if already exists

router.post("/:itemId", async (req: Request, res: Response) => {
    try {
        
        
        const userId = new mongoose.Types.ObjectId(req.user?._id);

        const existingLike = await Like.findOne({ userId, itemId: req.params.itemId });
        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            return res.status(200).json({ message: "Like removed" });
        }
        const like = new Like({
            userId: userId,
            itemId: req.params.itemId,
        });
        console.log(like);
        await like.save();
        res.status(200).json(like);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

//Check like for user and post

router.get("/check/:itemId", async (req: Request, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user?._id);
        const existingLike = await Like.findOne({ userId, itemId: req.params.itemId });
        if (existingLike) {
            return res.status(200).json(true);
        }
        res.status(200).json(false);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;