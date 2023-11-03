const Genre = require("../models/genre");
import { Request, Response, NextFunction } from "express";

async function validateGenre(req: Request, res: Response, next: NextFunction) {
    const genre = await Genre.findById(req.body.genre);
    if (!genre) return res.status(400).send("Invalid genre.");

    next();

}

export default validateGenre;