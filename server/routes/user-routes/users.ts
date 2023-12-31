import express from "express";
const router = express.Router();
const User = require("../../models/User");
import { Response, NextFunction } from "express";
import Request from "../../interfaces/Request";
import multer, { StorageEngine } from "multer";
import mongoose from "mongoose";

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
        res.status(200).json( users );
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
})

//Get user by id

router.get("/:id", async (req: Request, res: Response) => {
    try {
        // const user = await User.findById(req.params.id)
        // .populate("followers")
        // .populate("following")
        // .populate("samples")
        // .populate("groups")
        // .select("-password");
        const id = new mongoose.Types.ObjectId(req.params.id);
        //new pipeline
        // const user = await User.aggregate([
        //     { $match: { _id: id } },
        //     {
        //       $lookup: {
        //         from: "followers",
        //         localField: "_id",
        //         foreignField: "receiverId",
        //         as: "followers",
        //       },
        //     },
        //     {
        //       $lookup: {
        //         from: "followers",
        //         localField: "_id",
        //         foreignField: "senderId",
        //         as: "following",
        //       },
        //     },
        //     {
        //       $lookup: {
        //         from: "samples",
        //         localField: "_id",
        //         foreignField: "userId",
        //         as: "samples",
        //       },
        //       //Populate samples with views, downloads, and likes



        //     },
        //     {
        //       $lookup: {
        //         from: "groups",
        //         localField: "_id",
        //         foreignField: "members",
        //         as: "groups",
        //       },
        //     },
        //     { $project: {
        //         username: 1,
        //         bio: 1,
        //         avatar: 1,
        //         followers: ({ $size: "$followers" }),
        //         following: ({ $size: "$following" }),
        //         samples: 1,
        //         groups: 1,
        //         date: 1,
        //         _id: 1,

        //      },
        //     },
        //   ]);


        //This is awful to look at. I'm sorry to anyone that has to read this
const user = await User.aggregate([
  { $match: { _id: id } },
  {
    $lookup: {
      from: "followers",
      localField: "_id",
      foreignField: "receiverId",
      as: "followers",
    },
  },
  {
    $lookup: {
      from: "followers",
      localField: "_id",
      foreignField: "senderId",
      as: "following",
    },
  },
  {
    $lookup: {
      from: "samples",
      let: { userId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: "samplepacks",
            localField: "packs",
            foreignField: "_id",
            as: "packs",
          },
        },
        {
          $lookup: {
            from: "downloads",
            localField: "_id",
            foreignField: "itemId",
            as: "downloads",
          },
        },
        {
          $lookup: {
            from: "views",
            localField: "_id",
            foreignField: "itemId",
            as: "views",
          },
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "itemId",
            as: "likes",
          },
        },
        {
          $project: {
            username: "$user.username",
            userId: 1,
            title: 1,
            description: 1,
            sample: 1,
            format: 1,
            bpm: 1,
            key: 1,
            genre: 1,
            duration: 1,
            downloads: { $size: "$downloads" },
            likes: { $size: "$likes" },
            tags: 1,
            views: { $size: "$views" },
            _id: 1,
            date: 1,
          },
        },
      ],
      as: "samples",
    },
  },
  {
    $lookup: {
      from: "groups",
      localField: "_id",
      foreignField: "members",
      as: "groups",
    },
  },
  {
    $project: {
      username: 1,
      bio: 1,
      avatar: 1,
      followers: { $size: "$followers" },
      following: { $size: "$following" },
      samples: 1,
      groups: 1,
      date: 1,
      _id: 1,
      totalDownloads: {
        $sum: "$samples.downloads",
      },

      totalViews: {
        $sum: "$samples.views",
      },
      totalLikes: {
        $sum: "$samples.likes",
      },
    },
  },
]);
        res.status(200).json( user[0] );
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

//Update user (just for bio and avatar)

router.patch("/:id", upload.single("avatar"), async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const existingUser = await User.findById(req.params.id);

        if (!existingUser) {
            return res.status(400).json({ message: "User does not exist" });
        }

        if (existingUser._id.toString() !== userId?.toString()) {
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