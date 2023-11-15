import express from 'express';
import { Response, NextFunction } from "express";
import Request from "../../interfaces/Request";
const router = express.Router();
import checkModStatus from '../../utilities/modUtils';
const Alert = require("../../models/alert");




//Get all alerts

router.get("/", async (req: Request, res: Response) => {
    try {
        const alerts = await Alert.find();
        res.status(200).json(alerts);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
}
);

//Get alert by id (not necessary yet)


//Check if moderator

//Create alert

router.post("/", checkModStatus, async (req: Request, res: Response) => {
    try {
        if (!req.moderator) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
        const alert = new Alert({
            content: req.body.content,
            userId: req.user?._id,
        });
        alert.save();
        res.status(200).json(alert);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
}
);

//Delete alert

router.delete("/:alertId", checkModStatus, async (req: Request, res: Response) => {
    try {
        if (!req.moderator) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
        const alert = await Alert.findById(req.params.alertId);
        if (!alert) {
            return res.status(404).json({ message: "Alert not found" });
        }
        await Alert.deleteOne({ _id: req.params.alertId });
        res.status(200).json({ message: "Alert deleted" });
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
}
);

//Update alert

module.exports = router;