import mongoose from "mongoose";

//Define user schema. username, email, password, avatar, bio, followers, following, samples, groups, samplepacks, likes, comments, notifications, date

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  avatar: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    max: 100,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  samples: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sample",
    },
  ],
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  samplepacks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SamplePack",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  alerts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alert",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
