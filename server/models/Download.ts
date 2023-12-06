import mongoose from "mongoose";


const DownloadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sample",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Download", DownloadSchema);
