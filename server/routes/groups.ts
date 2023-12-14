import express from 'express';
import { Response, NextFunction } from "express";
import Request from "../interfaces/Request";
const router = express.Router();
const Group = require("../models/Group");
import multer, { StorageEngine } from 'multer';
import path from 'path';
import mongoose from 'mongoose';


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
        const groups = await Group.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "members",
                    foreignField: "_id",
                    as: "members",
                },
            },
        {
            $project: {
                groupName: 1,
                groupDescription: 1,
                logo: 1,
                adminId: 1,

                members: "$members._id",
            },
        }
        ]);
        res.status(200).json(groups);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Get group by ID

router.get("/:groupId", async (req: Request, res: Response) => {
    try {
        const groupId = new mongoose.Types.ObjectId(req.params.groupId);
        //Grab group, and fill with collections (sample packs), samples, and the group object
        const group = await Group.aggregate([
            { $match: { _id: groupId } },
            {
                $lookup: {
                    from: "users",
                    localField: "members",
                    foreignField: "_id",
                    as: "members",
                },
            },
            {
                $lookup: {
                    from: "collections",
                    localField: "collections",
                    foreignField: "_id",
                    as: "collections",
                },
            },
            {
                $project: {
                    groupName: 1,
                    groupDescription: 1,
                    logo: 1,
                    adminId: 1,
                    collections: "$collections",
                    members: "$members._id",
                },
            },
        ]);
        res.status(200).json(group[0]);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Create group

router.post("/", upload.single("logo"), async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No logo provided" });
        }

        const logo = `${process.env.SERVER_URL}/logos/${req.file?.originalname}`

        const group = new Group({
            groupName: req.body.groupName,
            groupDescription: req.body.groupDescription,
            logo,
            adminId: userId,
            members: [userId],
        });

        await group.save();

        


        res.status(200).json(group);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Join group

router.patch("/:groupId/join", async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const groupId = req.params.groupId;

        if (!userId) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!groupId) {
            return res.status(400).json({ message: "Group not found" });
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(400).json({ message: "Group not found" });
        }

        //Check if user is already in group

        if (group.members.includes(userId)) {
            return res.status(400).json({ message: "User is already in group" });
        }

        //Add user to groups members array

        group.members.push(userId);
        await group.save();



        res.status(200).json({ message: "User added to group" });
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Leave group

router.patch("/:groupId/leave", async (req: Request, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user?._id).toString();
        const groupId = req.params.groupId;

        if (!userId) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!groupId) {
            return res.status(400).json({ message: "Group not found" });
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(400).json({ message: "Group not found" });
        }

        //Check if user is already in group



        if (!group.members.includes(userId)) {
            return res.status(400).json({ message: "User is not in group" });
        }

        //Remove user from groups members array

        group.members = group.members.filter((member: string) => member.toString() !== userId);

        await group.save();



        res.status(200).json({ message: "User removed from group" });
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
