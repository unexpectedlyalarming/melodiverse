import { Request as ExpressRequest } from "express";
import ReturnedUser from "./ReturnedUser";

interface Request extends ExpressRequest {
  user?: ReturnedUser;
  moderator?: boolean;
}

export default Request;