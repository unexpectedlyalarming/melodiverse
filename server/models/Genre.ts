import mongoose from "mongoose";

const GenreSchema = new mongoose.Schema({
  genre: {
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

module.exports = mongoose.model("Genre", GenreSchema);
