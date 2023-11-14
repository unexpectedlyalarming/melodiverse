import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import ReturnedUser from "../interfaces/ReturnedUser";
const jwtKey: string = process.env.JWT_SECRET || "secret";
import Request from "../interfaces/Request";


function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;


  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  jwt.verify(token, jwtKey, (err: jwt.VerifyErrors | null, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }


    // Assuming that your JWT payload structure includes 'user' with 'id' property
    if (!decoded._id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }



    req.user = decoded;



    //If token is about to expire, reissue it

    const now = Date.now().valueOf() / 1000;

    if (decoded.exp - now < 30) {
      const newToken = jwt.sign(decoded, jwtKey, {
        algorithm: "HS256",
        expiresIn: 60 * 30,
      });
      res.cookie("accessToken", newToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
      });
    }

    // Token is valid, continue processing the request
    next();
  });
}

module.exports = verifyToken;
