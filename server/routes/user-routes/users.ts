import express from "express";
const router = express.Router();
const User = require("../../models/User");
import { Response, NextFunction } from "express";
import Request from "../../interfaces/Request";
import multer, { StorageEngine } from "multer";

const storage: StorageEngine = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
      cb(null, "../../public/avatars");
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  


//Get all users (not sure why you'd need this)

router.get("/", async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
})

//Get user by id

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({ user });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});


//Get user by username

router.get("/username/:username", async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        res.status(200).json({ user });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

//Get users by group

router.get("/group/:group", async (req: Request, res: Response) => {
    try {
        const users = await User.find({ group: req.params.group });
        res.status(200).json({ users });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

//Update user (Can update everything except username, email, and password)

router.patch("/:id", upload.single("avatar"), async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const existingUser = await User.findById(req.params.id);

        if (!existingUser) {
            return res.status(400).json({ message: "User does not exist" });
        }

        if (existingUser._id !== userId) {
            return res.status(400).json({ message: "User does not own account" });
        }

        // Check what fields are being updated

        if (req.body.bio) {
            existingUser.bio = req.body.bio;
        }
        if (req.file) {
            existingUser.avatar = `${process.env.SERVER_URL}/public/samples/${req.file?.originalname}`
            
        }

        await existingUser.save();
        res.status(200).json({ existingUser });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});



//Delete user

module.exports = router;