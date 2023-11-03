import mongoose from "mongoose";

const SamplePackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
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
  coverImage: {
    type: String,
    default: "",
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
  },
  tags: {
    type: Array,
    max: 10,
  },
  samples: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sample",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("SamplePack", SamplePackSchema);
