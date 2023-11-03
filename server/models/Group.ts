import mongoose from "mongoose";


const GroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  groupDescription: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  logo: {
    type: String,
  },
  collections: {
    type: Array,
    default: [],
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Group", GroupSchema);
