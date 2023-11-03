import express from "express";

const router = express.Router();

const User = require("../../models/User");

import { Response, NextFunction } from "express";
import Request from "../../interfaces/Request";

router.get("/:id", async (req: Request, res: Response) => {
    try {
        //I think this is the longest query I've ever written for a profile
        const profile = await User.aggregate([
            {
                $match: { _id: req.params.id } 
            },
            {
                $lookup: {
                    from: "users",
                    localField: "following.senderId",
                    foreignField: "_id",
                    as: "following.senderInfo"
                } 
            },
            {
                $lookup: {
                    from: "users",
                    localField: "followers.receiverId",
                    foreignField: "_id",
                    as: "followers.receiverInfo"
                } 
            },
            {
                $unwind: "$following.senderInfo" 
            },
            {
                $unwind: "$followers.receiverInfo" 
            },
            {
                $lookup: {
                    from: "samples",
                    localField: "_id",
                    foreignField: "userId",
                    as: "samples"
                } 
            },
            {
                $lookup: {
                    from: "samplePacks",
                    localField: "packs",
                    foreignField: "_id",
                    as: "samplePacks"
                } 
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "userId",
                    as: "comments"
                } 
            },
            {
                $lookup: {
                    from: "groups",
                    localField: "groups",
                    foreignField: "userId",
                    as: "groups"
                } 
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "likes",
                    foreignField: "userId",
                    as: "likes"
                } 
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    avatar: 1,
                    bio: 1,
                    "followers.receiverInfo.username": 1,
                    "followers.receiverInfo.avatar": 1,
                    "following.senderInfo.username": 1,
                    "following.senderInfo.avatar": 1,
                    samples: 1,
                    samplePacks: 1,
                    comments: 1,
                    groups: 1,
                    likes: 1,
                    date: 1
                } 
            }
        ]);
        
        res.status(200).json({ profile });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
    }
);


export default router;