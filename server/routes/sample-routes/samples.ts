import express from "express";
const router = express.Router();
const Sample = require("../../models/Sample");
const SamplePack = require("../../models/SamplePack");
import {Response, NextFunction } from "express";
import multer, { StorageEngine } from "multer";
import Key from "../../types/Key";
const Download = require("../../models/Download");
const View = require("../../models/View");
import Request from "../../interfaces/Request";
import addView from "../../utilities/viewUtils";
import path from "path";
import jwt from 'jsonwebtoken';
import ReturnedUser from "../../interfaces/ReturnedUser";
import mongoose from "mongoose";

//Set up multer

const jwtSecret = process.env.JWT_SECRET || "secret";

const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, path.join(__dirname, "../../public/audio"));
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//Custom request interface



function checkFile(req: Request, res: Response, next: NextFunction) {
  const file: File | any = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  //Check size, make sure below 30mb
  if (file.size > 30000000) {
    return res.status(400).json({ message: "File too large" });
  }
  //Check if file is audio
  if (!file.mimetype.includes("audio")) {
    return res.status(400).json({ message: "File is not audio" });
  }




  next();
}

router.post("/", upload.single("sample"), checkFile, async (req: Request, res: Response) => {
  try {
    const user = jwt.verify(req.cookies?.accessToken, jwtSecret ) as ReturnedUser | null;
    const userId = user?._id;
    console.log(userId)
    const title: string = req.body.title;
    const description: string = req.body.description;
    const format: string = "mp3";
    const bpm: number = Number(req.body.bpm);
    //Check if key is of type key
    const key: Key = req.body.key;
    if (!key) {
      return res.status(400).json({ message: "Key is not valid" });
    }

    const genre = req.body.genre;
    const tags: string[] = req.body.tags;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }


    const uploadedFileUrl: string = `${process.env.SERVER_URL}/audio/${req.file?.originalname}`


    const sample = new Sample({
      userId,
      title,
      description,
      format,
      bpm,
      key,
      genre,
      tags,
      sample: uploadedFileUrl,
    });
    await sample.save();

  

    res.status(200).json({ sample });
    



  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Update sample

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const existingSample = await Sample.findById(req.params.id);
    if (!existingSample) {
      return res.status(400).json({ message: "Sample does not exist" });
    }
    if (existingSample.userId.toString() !== userId?.toString()) {
      return res.status(400).json({ message: "User does not own sample" });
    }

    if (req.body.title) existingSample.title = req.body.title;
    if (req.body.description) existingSample.description = req.body.description;
    if (req.body.bpm) existingSample.bpm = req.body.bpm;
    if (req.body.key) existingSample.key = req.body.key;
    if (req.body.genre) existingSample.genre = req.body.genre;
    if (req.body.tags) existingSample.tags = req.body.tags;
    await existingSample.save();
    res.status(200).json({ existingSample });

  } catch (err: any) {
    res.status(500).json({ message: err.message });

  }
});

// Delete sample

router.delete("/:id", async (req: Request, res: Response) => {
try {
  const userId = new mongoose.Types.ObjectId(req.user?._id);

  const existingSample = await Sample.findById(req.params.id);

  if (!existingSample) {
    return res.status(400).json({ message: "Sample does not exist" });
  }
  if (existingSample.userId.toString() !== userId.toString()) {
    return res.status(400).json({ message: "User does not own sample" });
  }

  await Sample.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Sample deleted" });


} catch( err: any ) {
  res.status(500).json({ message: err.message });
}
});

// Get all samples, sort by date, limit by number

router.get("/sort/date/:page/:limit", async (req: Request, res: Response) => {
  try {
    const page = req.params.page ? Number(req.params.page) : 1;
    const limit = req.params.limit ? Number(req.params.limit) : 10;
    const end = page * limit;
    const start = end - limit;
    //Add username to sample and sort by date
    const samples = await Sample.aggregate([
      {

        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {

        $lookup: {
          from: "downloads",
          localField: "_id",
           foreignField: "itemId",
          as: "downloads",
        }
      },
      {
        $lookup: {
          from: "views",
          localField: "views",
          foreignField: "_id",
          as: "views",
        }
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "itemId",
          as: "likes",
        }
      },

      
      {
        $project: {
          "username": "$user.username",
          "userId": 1,
          "title": 1,
          "description": 1,
          "sample": 1,
          "format": 1,
          "bpm": 1,
          "key": 1,
          "genre": 1,
          "duration": 1,
          "downloads": { $size: "$downloads" },
          "likes": { $size: "$likes" },
          "tags": 1,
          "views": { $size: "$views" },
          "_id": 1,
          "date": 1,
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $skip: start,
      },
      {
        $limit: limit,
      }
    ]);
    res.status(200).json( samples );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

//Get all samples, sort by downloads

router.get("/sort/downloads/:page/:limit", async (req: Request, res: Response) => {
  try {
    const page = req.params.page ? Number(req.params.page) : 1;
    const limit = req.params.limit ? Number(req.params.limit) : 10;
    const end = page * limit;
    const start = end - limit;
    const samples = await Sample.aggregate([
      {

        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {

        $lookup: {
          from: "downloads",
          localField: "_id",
           foreignField: "itemId",
          as: "downloads",
        }
      },
      {
        $lookup: {
          from: "views",
          localField: "views",
          foreignField: "_id",
          as: "views",
        }
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "itemId",
          as: "likes",
        }
      },
      
      {
        $project: {
          "username": "$user.username",
          "userId": 1,
          "title": 1,
          "description": 1,
          "sample": 1,
          "format": 1,
          "bpm": 1,
          "key": 1,
          "genre": 1,
          "duration": 1,
          "downloads": { $size: "$downloads" },
          "likes": { $size: "$likes" },
          "tags": 1,
          "views": { $size: "$views" },
          "_id": 1,
          "date": 1,
        },
      },
      {
        $sort: { downloads: -1 },
      },
      {
        $skip: start,
      },
      {
        $limit: limit,
      }
    ]);
    res.status(200).json( samples );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
})

//Get all samples, sort by views

router.get("/sort/views/:page/:limit", async (req: Request, res: Response) => {
  try {
    const page = req.params.page ? Number(req.params.page) : 1;
    const limit = req.params.limit ? Number(req.params.limit) : 10;
    const end = page * limit;
    const start = end - limit;
    const samples = await Sample.aggregate([
      {

        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {

        $lookup: {
          from: "downloads",
          localField: "_id",
           foreignField: "itemId",
          as: "downloads",
        }
      },
      {
        $lookup: {
          from: "views",
          localField: "views",
          foreignField: "_id",
          as: "views",
        }
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "itemId",
          as: "likes",
        }
      },
      
      {
        $project: {
          "username": "$user.username",
          "userId": 1,
          "title": 1,
          "description": 1,
          "sample": 1,
          "format": 1,
          "bpm": 1,
          "key": 1,
          "genre": 1,
          "duration": 1,
          "downloads": { $size: "$downloads" },
          "likes": { $size: "$likes" },
          "tags": 1,
          "views": { $size: "$views" },
          "_id": 1,
          "date": 1,
        },
      },
      {
        $sort: { views: -1 },
      },
      {
        $skip: start,
      },
      {
        $limit: limit,
      }
    ]);
    res.status(200).json( samples );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
})

// Get all samples, sort by likes

router.get("/sort/likes/:page/:limit", async (req: Request, res: Response) => {
  try {
    const page = req.params.page ? Number(req.params.page) : 1;
    const limit = req.params.limit ? Number(req.params.limit) : 10;
    const end = page * limit;
    const start = end - limit;
    const samples = await Sample.aggregate([
      {

        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {

        $lookup: {
          from: "downloads",
          localField: "_id",
           foreignField: "itemId",
          as: "downloads",
        }
      },
      {
        $lookup: {
          from: "views",
          localField: "views",
          foreignField: "_id",
          as: "views",
        }
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "itemId",
          as: "likes",
        }
      },
      
      {
        $project: {
          "username": "$user.username",
          "userId": 1,
          "title": 1,
          "description": 1,
          "sample": 1,
          "format": 1,
          "bpm": 1,
          "key": 1,
          "genre": 1,
          "duration": 1,
          "downloads": { $size: "$downloads" },
          "likes": { $size: "$likes" },
          "tags": 1,
          "views": { $size: "$views" },
          "_id": 1,
          "date": 1,
        },
      },
      {
        $sort: { likes: -1 },
      },
      {
        $skip: start,
      },
      {
        $limit: limit,
      }
    ]);
    res.status(200).json( samples );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
})

// Get sample by id

router.get("/:id", addView, async (req: Request, res: Response) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const sample = await Sample.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
        
      },
      {
        $unwind: "$user",
      },
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
          localField: "views",
          foreignField: "_id",
          as: "views",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "itemId",
          as: "likes",
        }
      },
      
      {
        $project: {
          "username": "$user.username",
          "userId": 1,
          "title": 1,
          "description": 1,
          "sample": 1,
          "format": 1,
          "bpm": 1,
          "key": 1,
          "genre": 1,
          "duration": 1,
          "downloads": { $size: "$downloads" },
          "likes": { $size: "$likes" },
          "tags": 1,
          "views": { $size: "$views" },
          "_id": 1,
          "date": 1,
          

        },
      },
    
    ]).then((result: any) => result[0]);


    res.status(200).json( sample );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

);

// Get samples by user id

router.get("/user/:id", async (req: Request, res: Response) => {
  try {
    const samples = await Sample.find({ userId: req.params.id }).sort({ date: -1 });
    res.status(200).json( samples );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

);

// Get samples by pack id

router.get("/pack/:id", async (req: Request, res: Response) => {
  try {
    const samples = await Sample.find({ packs: req.params.id }).sort({ date: -1 });
    res.status(200).json( samples );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
);

// Get samples by tag

router.get("/tag/:tag", async (req: Request, res: Response) => {
  try {
    const samples = await Sample.find({ tags: req.params.tag }).sort({ date: -1 });
    res.status(200).json( samples );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
);

// Get samples by genre

router.get("/genre/:genre/:sort/:page/:limit", async (req: Request, res: Response) => {
  try {
    const genre = decodeURI(req.params.genre)
    // const samples = await Sample.find({ genre }).sort({ date: -1 });
    const sort = req.params.sort ? req.params.sort : "date";
    const page = req.params.page ? Number(req.params.page) : 1;
    const limit = req.params.limit ? Number(req.params.limit) : 10;
    const end = page * limit;
    const start = end - limit;
    const samples = await Sample.aggregate([
      {

        $match: { genre },
      },
        {
  
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
  
          $lookup: {
            from: "downloads",
            localField: "_id",
            foreignField: "itemId",
            as: "downloads",
          }
        },
        {
          $lookup: {
            from: "views",
            localField: "views",
            foreignField: "_id",
            as: "views",
          }
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "itemId",
            as: "likes",
          }
        },
        
        {
          $project: {
            "username": "$user.username",
            "userId": 1,
            "title": 1,
            "description": 1,
            "sample": 1,
            "format": 1,
            "bpm": 1,
            "key": 1,
            "genre": 1,
            "duration": 1,
            "downloads": { $size: "$downloads" },
            "likes": { $size: "$likes" },
            "tags": 1,
            "views": { $size: "$views" },
            "_id": 1,
            "date": 1,
          },
        },
        {
          $sort: { [sort]: -1 },
        },
        {
          $skip: start,
        },
        {
          $limit: limit,
        }
    ]);
    res.status(200).json( samples );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
);

// Get samples by key

router.get("/key/:key/:sort/:page/:limit", async (req: Request, res: Response) => {
  try {
    const sort = req.params.sort ? req.params.sort : "date";
    const key = decodeURI(req.params.key);
    const page = req.params.page ? Number(req.params.page) : 1;
    const limit = req.params.limit ? Number(req.params.limit) : 10;
    const end = page * limit;
    const start = end - limit;

    const samples = await Sample.aggregate([
      {

        $match: { key },
      },
        {
  
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
  
          $lookup: {
            from: "downloads",
            localField: "_id",
            foreignField: "itemId",
            as: "downloads",
          }
        },
        {
          $lookup: {
            from: "views",
            localField: "views",
            foreignField: "_id",
            as: "views",
          }
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "itemId",
            as: "likes",
          }
        },
        
        {
          $project: {
            "username": "$user.username",
            "userId": 1,
            "title": 1,
            "description": 1,
            "sample": 1,
            "format": 1,
            "bpm": 1,
            "key": 1,
            "genre": 1,
            "duration": 1,
            "downloads": { $size: "$downloads" },
            "likes": { $size: "$likes" },
            "tags": 1,
            "views": { $size: "$views" },
            "_id": 1,
            "date": 1,
          },
        },
        {

          $sort: { [sort]: -1 },
        },
        {
          $skip: start,
        },
        {
          $limit: limit,
        }

    ]);
        res.status(200).json(samples );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
);

// Get samples by bpm range

router.get("/bpm/:bpm/:sort/:page/:limit", async (req: Request, res: Response) => {
  try {
    const bpm = req.params.bpm.split("-");
    const lower = Number(bpm[0]);
    const upper = Number(bpm[1]);
    const sort = req.params.sort ? req.params.sort : "date";

    const page = req.params.page ? Number(req.params.page) : 1;
    const limit = req.params.limit ? Number(req.params.limit) : 10;
    const end = page * limit;
    const start = end - limit;
    
    const samples = await Sample.aggregate([
      {
        $match: { bpm: { $gte: lower, $lte: upper } },
      },

          {
    
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
    
            $lookup: {
              from: "downloads",
              localField: "_id",
              foreignField: "_id",
              as: "downloads",
            }
          },
          {
            $lookup: {
              from: "views",
              localField: "views",
              foreignField: "_id",
              as: "views",
            }
          },
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "itemId",
              as: "likes",
            }
          },
          
          {
            $project: {
              "username": "$user.username",
              "userId": 1,
              "title": 1,
              "description": 1,
              "sample": 1,
              "format": 1,
              "bpm": 1,
              "key": 1,
              "genre": 1,
              "duration": 1,
              "downloads": { $size: "$downloads" },
              "likes": { $size: "$likes" },
              "tags": 1,
              "views": { $size: "$views" },
              "_id": 1,
              "date": 1,
            },
          },
          {
  
            $sort: { [sort]: -1 },
          },
          {
            $skip: start,
          },
          {
            $limit: limit,
          }
  
      ]);
    res.status(200).json( samples );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
);

//Get samples by range of bpm

// router.get("/bpm/:min/:max", async (req: Request, res: Response) => {
//   try {
//     const samples = await Sample.find({ bpm: { $gte: req.params.min, $lte: req.params.max } }).sort({ date: -1 });
//     res.status(200).json( samples );
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// });


//Download file by sample id

router.get("/download/:id", async (req: Request, res: Response) => {
  try {
    const sample = await Sample.findById(req.params.id);
    if (!sample) {
      return res.status(400).json({ message: "Sample does not exist" });
    }
    //Update download count

    const download = new Download({
      userId: req.user?._id,
      itemId: req.params.id,
    });
    await download.save();

    const filePath = path.join('public', 'audio', path.basename(sample.sample));

    res.status(200).download(filePath);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

);

module.exports = router;