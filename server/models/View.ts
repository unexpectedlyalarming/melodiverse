import mongoose from "mongoose";
//Specifically for sample

const ViewSchema = new mongoose.Schema({
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

module.exports = mongoose.model("View", ViewSchema);
