import express from "express";

const router = express.Router();

const User = require("../../models/User");
const Follower = require("../../models/Follower");

import { Response, NextFunction } from "express";
import Request from "../../interfaces/Request";





//Get followers of user

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const followers = await Follower.find({ receiverId: req.params.id });
        res.status(200).json({ followers });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
})

//Get following of user

router.get("/following/:id", async (req: Request, res: Response) => {
    try {
        const following = await Follower.find({ senderId: req.params.id });
        res.status(200).json({ following });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
})


//Follow/Unfollow user

router.post("/", async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const receiverId = req.body.receiverId;
        const following = await Follower.findOne({ senderId: userId, receiverId });

        if (following) {
            await Follower.findOneAndDelete({ senderId: userId, receiverId });
            res.status(200).json({ message: "Unfollowed user" });
        }

        const newFollower = new Follower({
            senderId: userId,
            receiverId
        });

        await newFollower.save();

        res.status(200).json({ message: "Followed user" });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
})


export default router;