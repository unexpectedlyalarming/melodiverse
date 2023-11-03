import express from "express";
const router = express.Router();
const SamplePack = require("../../models/SamplePack");
import { Response, NextFunction } from "express";
import validateGenre from "../../utilities/validateGenre";
import Request from "../../interfaces/Request";




//Get all samplepacks

router.get("/", async (req: Request, res: Response) => {
    try {
        const samplepacks = await SamplePack.find().sort({ date: -1 });
        res.status(200).json({ samplepacks });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

//Get samplepack by id

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const samplepack = await SamplePack.findById(req.params.id);
        res.status(200).json({ samplepack });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

//Get samplepacks by user id

router.get("/user/:id", async (req: Request, res: Response) => {
    try {
        const samplepacks = await SamplePack.find({ userId: req.params.id }).sort({ date: -1 });
        res.status(200).json({ samplepacks });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

//Get samplepacks by group

router.get("/group/:groupId", async (req: Request, res: Response) => {
    try {
        const samplepacks = await SamplePack.find({ groupId: req.params.groupId }).sort({ date: -1 });
        res.status(200).json({ samplepacks });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});


//Create samplepack

router.post("/", validateGenre, async (req: Request, res: Response) => {
    const samplepack = new SamplePack({
        title: req.body.title,
        description: req.body.description,
        genre: req.body.genre,
        tags: req.body.tags,
        userId: req.body.userId,
        groupId: req.body.groupId,
        samples: req.body.samples,
        date: req.body.date,
    });

    try {
        const newSamplePack = await samplepack.save();
        res.status(201).json({ newSamplePack });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

//Delete samplepack

//Update samplepack



