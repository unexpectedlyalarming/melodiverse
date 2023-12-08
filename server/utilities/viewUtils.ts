import express from 'express';
import { Response, NextFunction } from "express";
import Request from "../interfaces/Request";
import mongoose from 'mongoose';

const View = require("../models/View");


async function addView(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = new mongoose.Types.ObjectId(req.user?._id);
        const itemId = new mongoose.Types.ObjectId(req.params.id);
        if (!itemId) return next();
        const existingView = await View.findOne({ userId, itemId });
        if (existingView) return next();


        const view = new View({
            userId,
            itemId,
        });
        view.save();
        next();

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }


}

export default addView;
