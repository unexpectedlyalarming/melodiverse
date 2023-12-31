import express from "express";
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Moderator = require("../models/Moderator");
import { Response, NextFunction } from "express";
import ReturnedUser from "../interfaces/ReturnedUser";
import Request from "../interfaces/Request";

const jwtKey = process.env.JWT_SECRET || "secret";

interface TokenResult {
  token?: string;
  user?: ReturnedUser;
}


async function giveToken(newUser: ReturnedUser): Promise<TokenResult> {
  try {

    //return only username, avatar, and bio
    //Check for moderator
    const mod = await Moderator.findOne({ userId: newUser._id });
    
    if (mod) {
      newUser.moderator = true;
    } else {
      newUser.moderator = false;
    }
    
    const user: ReturnedUser = {
      username: newUser.username,
      avatar: newUser.avatar,
      bio: newUser.bio,
      _id: newUser._id,
      moderator: newUser.moderator,
    };
    const token = jwt.sign(user, jwtKey) as string;
    return { token, user: user };
  } catch (err: any) {
    return {};
}
}

router.post(
  "/register",
  validateFormInput,
  async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const existingUser = await User.findOne({ username: username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hash = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        password: hash,
      });
      await newUser.save();

      res.status(200).json({ message: "Registry successful" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.post(
  "/log-in",
  validateFormInput,
  async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      const existingUser = await User.findOne({ username: username });

      if (!existingUser) {
        return res.status(400).json({ message: "Username does not exist" });
      }
      const validPassword = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }
      const { token, user } = await giveToken(existingUser);
      if (!token || !user) {
        return res.status(500).json({ message: "Token generation failed" });
      }
      //set cookie
      res.cookie("accessToken", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60, //1 hour

      });
      req.user = user;
      res.status(200).json( user );
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/logout", async (req: Request, res: Response) => {
  try {
    res.cookie("accessToken", "", { maxAge: 5, httpOnly: true });
    res.status(200).json({ message: "Logged out" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/validate-session", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET) as ReturnedUser;
    if (!verified) {
      return res.status(401).json({ message: "Token verification failed" });
    }
    const newUser = await User.findById(verified._id);
    if (!newUser) {
      return res.status(401).json({ message: "User does not exist" });
    }
    const mod = await Moderator.findOne({ userId: newUser._id });
    
    if (mod) {
      newUser.moderator = true;
    } else {
      newUser.moderator = false;
    }
    

    const user: ReturnedUser = {
      username: newUser.username,
      avatar: newUser.avatar,
      bio: newUser.bio,
      _id: newUser._id,
      moderator: newUser.moderator,
    };
    req.user = user
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

//Ensure form input is valid

function validateFormInput(req: Request, res: Response, next: NextFunction) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  if (username.length < 3 || username.length > 20) {
    return res
      .status(400)
      .json({ message: "Username must be between 3 and 20 characters" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }
  next();
}

module.exports = router;
