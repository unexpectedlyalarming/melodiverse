import { Response, NextFunction } from "express";
import Request from "../interfaces/Request";
const Moderator = require("../models/Moderator");

async function checkModStatus (req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?._id;
        const moderator = await Moderator.findOne({ userId });
        req.moderator = false;
        if (moderator) req.moderator = true;
        if (!moderator) req.moderator = false;
        next();

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export default checkModStatus;