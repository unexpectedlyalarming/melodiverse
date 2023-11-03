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
//Set up multer

const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, "../../public/samples");
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

  //Check if file is mp3
  if (!file.mimetype.includes("mp3")) {
    return res.status(400).json({ message: "File is not mp3" });
  }



  next();
}

router.post("/upload", upload.single("sample"), checkFile, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const title: string = req.body.title;
    const description: string = req.body.description;
    const format: string = "mp3";
    const bpm: number = req.body.bpm;
    //Check if key is of type key
    const key: Key = req.body.key;
    if (!key) {
      return res.status(400).json({ message: "Key is not valid" });
    }

    const genre: string = req.body.genre;
    const tags: string[] = req.body.tags;

    const uploadedFileUrl: string = `${process.env.SERVER_URL}/public/samples/${req.file?.originalname}`


    const sample = new Sample({
      userId,
      title,
      description,
      format,
      bpm,
      key,
      genre,
      tags,
      URL: uploadedFileUrl,
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
    if (existingSample.userId !== userId) {
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
  const userId = req.user?._id;

  const existingSample = await Sample.findById(req.params.id);

  if (!existingSample) {
    return res.status(400).json({ message: "Sample does not exist" });
  }
  if (existingSample.userId !== userId) {
    return res.status(400).json({ message: "User does not own sample" });
  }

  await existingSample.remove();
  res.status(200).json({ message: "Sample deleted" });


} catch( err: any ) {
  res.status(500).json({ message: err.message });
}
});

// Get all samples, sort by date

router.get("/sort/date", async (req: Request, res: Response) => {
  try {
    const samples = await Sample.find().sort({ date: -1 });
    res.status(200).json({ samples });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

//Get all samples, sort by downloads

router.get("/sort/downloads", async (req: Request, res: Response) => {
  try {
    const samples = await Sample.find().populate("downloads").sort({ downloads: -1 });
    res.status(200).json({ samples });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
})

//Get all samples, sort by views

router.get("/sort/views", addView, async (req: Request, res: Response) => {
  try {
    const samples = await Sample.find().populate("views").sort({ views: -1 });
    res.status(200).json({ samples });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
})

// Get all samples, sort by likes

router.get("/sort/likes", async (req: Request, res: Response) => {
  try {
    const samples = await Sample.find().populate("likes").sort({ likes: -1 });
    res.status(200).json({ samples });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
})

// Get sample by id

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const sample = await Sample.aggregate([
      { $match: { _id: req.params.id } },
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
          from: "samplepacks",
          localField: "packs",
          foreignField: "_id",
          as: "packs",
        },
      },
      {
        $lookup: {
          from: "downloads",
          localField: "downloads",
          foreignField: "_id",
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

        $project: {
          "username": "$user.username",
          "downloads": "$downloads",
          "views": "$views",
          "packs": "$packs",
          "userId": 1,
          "title": 1,
          "description": 1,
          "URL": 1,
          "format": 1,
          "bpm": 1,
          "key": 1,
          "genre": 1,
          "duration": 1,
          "tags": 1,
          "_id": 1,

        },
      },
    ]);

    //Update view count

    const existingView = await View.findOne({ userId: req.user?._id, sampleId: req.params.id });
    if (!existingView) {
      const view = new View({
        userId: req.user?._id,
        sampleId: req.params.id,
      });
      await view.save();
    }


    res.status(200).json({ sample });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

);

// Get samples by user id

router.get("/user/:id", async (req: Request, res: Response) => {
  try {
    const samples = await Sample.find({ userId: req.params.id }).sort({ date: -1 });
    res.status(200).json({ samples });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

);

// Get samples by pack id

router.get("/pack/:id", async (req: Request, res: Response) => {
  try {
    const samples = await Sample.find({ packs: req.params.id }).sort({ date: -1 });
    res.status(200).json({ samples });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
);

// Get samples by tag

router.get("/tag/:tag", async (req: Request, res: Response) => {
  try {
    const samples = await Sample.find({ tags: req.params.tag }).sort({ date: -1 });
    res.status(200).json({ samples });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
);

// Get samples by genre

router.get("/genre/:genre", async (req: Request, res: Response) => {
  try {
    const samples = await Sample.find({ genre: req.params.genre }).sort({ date: -1 });
    res.status(200).json({ samples });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
);

// Get samples by key

router.get("/key/:key", async (req: Request, res: Response) => {
  try {
    const samples = await Sample.find({ key: req.params.key }).sort({ date: -1 });
    res.status(200).json({ samples });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
);

// Get samples by bpm

router.get("/bpm/:bpm", async (req: Request, res: Response) => {
  try {
    const samples = await Sample.find({ bpm: req.params.bpm }).sort({ date: -1 });
    res.status(200).json({ samples });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
);

//Get samples by range of bpm

router.get("/bpm/:min/:max", async (req: Request, res: Response) => {
  try {
    const samples = await Sample.find({ bpm: { $gte: req.params.min, $lte: req.params.max } }).sort({ date: -1 });
    res.status(200).json({ samples });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


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
      sampleId: req.params.id,
    });
    await download.save();


    res.status(200).download(sample.URL);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

);

export default router;