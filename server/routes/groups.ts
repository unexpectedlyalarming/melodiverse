import express from 'express';
import { Response, NextFunction } from "express";
import Request from "../interfaces/Request";
const router = express.Router();
const Group = require("../models/group");
import multer, { StorageEngine } from 'multer';
import path from 'path';

//Set up multer

const storage: StorageEngine = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, path.join(__dirname, "../public/logos"));
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

//Get all groups

router.get("/", async (req: Request, res: Response) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Get group by ID

router.get("/:groupId", async (req: Request, res: Response) => {
    try {
        const group = await Group.findById(req.params.groupId);
        res.status(200).json(group);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Create group

router.post("/", upload.single("logo"), async (req: Request, res: Response) => {
    try {

        if (!req.file) {
            return res.status(400).json({ message: "No logo provided" });
        }

        const logo = `${process.env.SERVER_URL}/logos/${req.file?.originalname}`

        const group = new Group({
            groupName: req.body.groupName,
            groupDescription: req.body.groupDescription,
            logo,
        });
        await group.save();
        res.status(200).json(group);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

module.exports = router;


// const GroupSchema = new mongoose.Schema({
//   groupName: {
//     type: String,
//     required: true,
//     max: 255,
//     min: 6,
//   },
//   groupDescription: {
//     type: String,
//     required: true,
//     max: 255,
//     min: 6,
//   },
//   adminId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   logo: {
//     type: String,
//   },
//   collections: {
//     type: Array,
//     default: [],
//   },
//   members: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   ],

//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Group", GroupSchema);
