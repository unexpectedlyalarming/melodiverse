import express from 'express';
import { Response, NextFunction } from "express";
import Request from "../interfaces/Request";
const router = express.Router();

const Comment = require("../models/comment");



//Get comments by post ID

router.get("/:postId", async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId });
        res.status(200).json(comments);
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
            itemId: req.body.postId,
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

        const existingComment = await Comment.findById(req.params.commentId);
        if (!existingComment) return res.status(400).send("Comment does not exist.");
        if (existingComment.userId !== req.user?._id) return res.status(400).send("User is not authorized to delete this comment.");

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

