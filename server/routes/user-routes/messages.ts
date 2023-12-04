import express from 'express';
import { Response, NextFunction } from "express";
import Request from "../../interfaces/Request";
const router = express.Router();
const User = require("../../models/User");
const Message = require("../../models/Message");

//Get all unique users that have sent or received messages to/from current user

router.get("/users", async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const messages = await Message.find({ $or: [{ senderId: userId }, { receiverId: userId }] });
        const users = messages.map((message: any) => {
            if (message.senderId === userId) return message.receiverId;
            if (message.receiverId === userId) return message.senderId;
        });
        const uniqueUsers = [...new Set(users)];
        const usersWithInfo = await User.find({ _id: { $in: uniqueUsers } });
        res.status(200).json(usersWithInfo);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
})


//Get all messages between current user and another user

router.get("/user/:userId", async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const messages = await Message.find({ $or: [{ senderId: userId, receiverId: req.params.userId }, { senderId: req.params.userId, receiverId: userId }] }).sort({ date: -1 });
        res.status(200).json(messages);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});


//Create message

router.post("/:receiverId", async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const message = new Message({
            senderId: userId,
            receiverId: req.params.receiverId,
            message: req.body.message,
        });
        await message.save();
        res.status(200).json(message);
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