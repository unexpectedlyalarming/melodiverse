import express from "express";
const router = express.Router();
const Moderator = require("../../models/Moderator");
import { Response } from "express";
import Request from "../../interfaces/Request";
import checkModStatus from "../../utilities/modUtils";


router.use(checkModStatus);



//Delete moderator /revoke status (needs admin)


//Create moderator / grant status

router.post("/:userId", async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const moderator = await Moderator.findOne({ userId });
        if (moderator) return res.status(400).send("User is already a moderator.");

        const newModerator = new Moderator({
            userId
        });

        await newModerator.save();

        res.status(200).json({ message: "User is now a moderator." });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

//Get all moderators

router.get("/", async (req: Request, res: Response) => {
    try {
        const moderators = await Moderator.find();
        res.status(200).json({ moderators });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});


//Get moderator by id

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const moderator = await Moderator.findById(req.params.id);
        res.status(200).json({ moderator });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;


