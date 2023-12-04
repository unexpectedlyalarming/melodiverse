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

router.post("/:id", async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const receiverId = req.params.id;
        const following = await Follower.findOne({ senderId: userId, receiverId });

        if (following) {
            await Follower.findOneAndDelete({ senderId: userId, receiverId });
            return res.status(200).json(false);
        }

        const newFollower = new Follower({
            senderId: userId,
            receiverId
        });

        await newFollower.save();

        res.status(200).json(true);

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
})

//Check if user is following

router.get("/check/:id", async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const receiverId = req.params.id;
        const following = await Follower.findOne({ senderId: userId, receiverId });

        if (following) {
            return res.status(200).json(true);
        }

        res.status(200).json(false);

    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}
)


module.exports = router;
