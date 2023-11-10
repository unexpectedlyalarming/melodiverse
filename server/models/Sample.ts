import mongoose from "mongoose";
import Key from "../types/Key";

interface Sample extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  sample: string;
  format: string;
  bpm?: number;
  key?: Key;
  genre?: string;
  duration: number;
  likes: string[];
  downloads: string[];
  views: string[];
  tags: string[];
  date: Date;
  packs: string[];
}

//Sample schema should have userId, title, description (optional), URL, format, bpm (optional), key (optional), genre (optional), tags (optional), likes, comments, date, duration, license type, tags, array of likes, array of downloads, array of views

const SampleSchema = new mongoose.Schema<Sample>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    max: 50,
  },
  description: {
    type: String,
    max: 100,
  },

  sample: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
    max: 10,
  },
  bpm: {
    type: Number,
    min: 0,
    max: 999,
  },
  key: {
    type: String,
    max: 10,
  },
  genre: {
    type: String,
    max: 50,
  },
  duration: {
    type: Number,
    //Implement later, might not be necessary if the frontend can calculate
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Like",
    },
  ],
  downloads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Download",
    },
  ],
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "View",
    },
  ],
  tags: [
    {
      type: String,
      max: 50,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  packs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SamplePack",
    },
  ],
});

module.exports = mongoose.model<Sample>("Sample", SampleSchema);
