import express from 'express';
import { Response, NextFunction } from "express";
import Request from "../../interfaces/Request";
import mongoose from 'mongoose';
const router = express.Router();
const User = require("../../models/User");
const Message = require("../../models/Message");

//Get all users who have conversed with current user

router.get("/users", async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const messages = await Message.find({ $or: [{ senderId: userId }, { receiverId: userId }] });
        //Get all unique users with username, avatar, and id from each document
        const uniqueUsers = messages.reduce((acc: any, message: any) => {
            if (message.senderId !== userId && !acc.includes(message.senderId)) {
                acc.push(message.senderId);
            }
            else if (message.receiverId !== userId && !acc.includes(message.receiverId)) {
                acc.push(message.receiverId);
            }
            return acc;
        }
            , []);
        const users = await User.find({ _id: { $in: uniqueUsers } }).select("username avatar _id");
        const result = users.length > 0 ? users : [];
        res.status(200).json(result);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
})


//Get all messages between current user and another user

router.get("/user/:userId", async (req: Request, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user?._id);
        const receiverId = new mongoose.Types.ObjectId(req.params.userId);
        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: userId, receiverId: receiverId },
                        { senderId: receiverId, receiverId: userId },
                    ],
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "senderId",
                    foreignField: "_id",
                    as: "sender",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "receiverId",
                    foreignField: "_id",
                    as: "receiver",
                },
            },
            { $unwind: "$sender" },
            { $unwind: "$receiver" },
            {
                $project: {
                    senderId: 1,
                    receiverId: 1,
                    content: 1,
                    date: 1,
                    "username": "$sender.username",
                    "avatar": "$sender.avatar",
                },
                },
            { $sort: { date: 1 } },
        ]);
        
        res.status(200).json(messages);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});


//Create message

router.post("/", async (req: Request, res: Response) => {
    try {
        const senderId = req.user?._id;
        const receiverId = req.body.receiver;
        const content = req.body.message;
        const newMessage = new Message({
            senderId,
            receiverId,
            content,
        });
        await newMessage.save();
        res.status(200).json(newMessage);
    }
    catch (err: any) {
        res.status(500).json({ message: err });
    }
}
);


//Delete message

router.delete("/:messageId", async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const message = await Message.findById(req.params.messageId);
        if (!message) return res.status(400).json({ message: "Message does not exist" });
        if (message.senderId !== userId) return res.status(400).json({ message: "User does not own message" });
        await message.remove();
        res.status(200).json({ message: "Message deleted" });
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});


module.exports = router;