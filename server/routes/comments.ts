import express from 'express';
import { Response, NextFunction } from "express";
import Request from "../interfaces/Request";
import mongoose from 'mongoose';
const router = express.Router();

const Comment = require("../models/comment");



//Get comments by post ID

router.get("/sample/:postId", async (req: Request, res: Response) => {
    try {
        const comments = await Comment.aggregate([
            { $match: { itemId: new mongoose.Types.ObjectId(req.params.postId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 1,
                    itemId: 1,
                    comment: 1,
                    userId: 1,
                    username: "$user.username",
                    avatar: "$user.avatar",
                },
            },
        ]);
        const result = comments.length > 0 ? comments : [];
        res.status(200).json(result);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Get comment by ID

router.get("/:commentId", async (req: Request, res: Response) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        res.status(200).json(comment);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Get comments by user ID

router.get("/user/:userId", async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find({ userId: req.params.userId });
        res.status(200).json(comments);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});


//Create comment

router.post("/", async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const comment = new Comment({
            userId: userId,
            itemId: req.body.itemId,
            comment: req.body.comment,
        });
        const savedComment = await comment.save();
        res.status(200).json(savedComment);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Delete comment

router.delete("/:commentId", async (req: Request, res: Response) => {
    try {

        
        const userId = new mongoose.Types.ObjectId(req.user?._id);
        const existingComment = await Comment.findById(req.params.commentId);
        console.log(existingComment.userId);
        console.log(userId);
        if (!existingComment) return res.status(400).send("Comment does not exist.");
        if (existingComment.userId.toString() !== userId.toString()) return res.status(400).send("User is not authorized to delete this comment.");

        const deletedComment = await Comment.deleteOne({ _id: req.params.commentId });
        res.status(200).json(deletedComment);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});



//Update comment

router.patch("/:commentId", async (req: Request, res: Response) => {
    try {

        const existingComment = await Comment.findById(req.params.commentId);
        if (!existingComment) return res.status(400).send("Comment does not exist.");
        if (existingComment.userId !== req.user?._id) return res.status(400).send("User is not authorized to update this comment.");

        const updatedComment = await Comment.updateOne(
            { _id: req.params.commentId },
            { $set: { comment: req.body.comment } }
        );
        res.status(200).json(updatedComment);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});



module.exports = router;

