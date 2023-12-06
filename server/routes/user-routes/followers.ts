import express from "express";

const router = express.Router();

const User = require("../../models/User");
const Follower = require("../../models/Follower");

import { Response, NextFunction } from "express";
import Request from "../../interfaces/Request";
import mongoose from "mongoose";





//Get followers of user

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const followers = await Follower.aggregate([
            {
                $match: { receiverId: id }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "senderId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: "$user._id",
                    username: "$user.username",
                    avatar: "$user.avatar"
                }
            }
        ]);
        const result = followers.length > 0 ? followers : [];
        console.log(followers)
        res.status(200).json( result);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
})

//Get following of user

router.get("/following/:id", async (req: Request, res: Response) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const followers = await Follower.aggregate([
            {
                $match: { senderId: id }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "receiverId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: "$user._id",
                    username: "$user.username",
                    avatar: "$user.avatar"
                }
            }
        ]);
        const result = followers.length > 0 ? followers : [];
        console.log(followers)
        res.status(200).json( result);
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
