import express from 'express';
import { Response, NextFunction } from "express";
import Request from "../interfaces/Request";
const router = express.Router();
import checkModStatus from '../utilities/modUtils';
const Genre = require("../models/genre");
import multer, { StorageEngine } from 'multer';


//Set up multer

const storage: StorageEngine = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
      cb(null, "../public/covers");
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

//Get all genres

router.get("/", async (req: Request, res: Response) => {
    try {
        const genres = await Genre.find();
        res.status(200).json(genres);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Get genre by ID

router.get("/:genreId", async (req: Request, res: Response) => {
    try {
        const genre = await Genre.findById(req.params.genreId);
        res.status(200).json(genre);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});



//Create genre

router.post("/", checkModStatus, upload.single("cover"), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No cover image provided" });
        }

        const coverImage = `${process.env.SERVER_URL}/public/samples/${req.file?.originalname}`
        const genre = new Genre({
            name: req.body.name,
            description: req.body.description,
            coverImage,
        });
        const savedGenre = await genre.save();
        res.status(200).json(savedGenre);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Update genre

router.patch("/:genreId", checkModStatus, async (req: Request, res: Response) => {
    try {
        const updatedGenre = await Genre.updateOne(
            { _id: req.params.genreId },
            { $set: { name: req.body.name, description: req.body.description } }
        );
        res.status(200).json(updatedGenre);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});

//Delete genre

router.delete("/:genreId", checkModStatus, async (req: Request, res: Response) => {
    try {
        const removedGenre = await Genre.remove({ _id: req.params.genreId });
        res.status(200).json(removedGenre);
    } catch (err: any) {
        res.status(500).json({ message: err });
    }
});