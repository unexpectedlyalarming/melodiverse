import { Response, NextFunction } from "express";
import Request from "../interfaces/Request";
const Moderator = require("../models/Moderator");
import jwt from "jsonwebtoken";
import ReturnedUser from "../interfaces/ReturnedUser";

const jwtSecret = process.env.JWT_SECRET || "secret";

async function checkModStatus (req: Request, res: Response, next: NextFunction) {
    try {
        const user = jwt.verify(req.cookies?.accessToken, jwtSecret ) as ReturnedUser | null;
        const userId = user?._id;
        console.log(userId)
        const moderator = await Moderator.findOne({ userId });
        console.log(moderator)
        req.moderator = false;
        if (moderator) req.moderator = true;
        if (!moderator) req.moderator = false;
        next();

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export default checkModStatus;