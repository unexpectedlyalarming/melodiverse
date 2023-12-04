import express from "express";
const app = express();
import morgan from "morgan";
import cors from "cors";
import PrettyError from "pretty-error";
import mongoose from "mongoose";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { Response, NextFunction } from "express";
import Request from "./interfaces/Request";


dotenv.config();



// Global variables

const port: number = Number(process.env.PORT) || 2000;
const host: string = process.env.HOST || "localhost";

const dbHost: string = process.env.DB_HOST || "localhost";
const dbPort: any = process.env.DB_PORT || 27017;
const dbName: string = process.env.DB_NAME || "melodiversedb";

const dbUser: string | null = process.env.DB_USER || null;
const dbPass: string | null = process.env.DB_PASS || null;

const corsOrigin: any = process.env.CORS_ORIGIN || "*";


const dbUri = dbUser
  ? `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`
  : `mongodb://${dbHost}:${dbPort}/${dbName}`;

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions);

//Set up morgan

app.use(morgan("dev"));


//set headers

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", corsOrigin);
  res.header("Access-Control-Allow-Headers", corsOrigin);
  res.header("Cross-Origin-Resource-Policy", "cross-origin");

  next();
});

app.use(
  cors({
    origin: corsOrigin,
    methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    withCredentials: true,
    accessControlAllowCredentials: true,
    crossOriginResourcePolicy: "cross-origin",

  } as cors.CorsOptions)
);

//Set up cookie parser

app.use(cookieParser());



//Secure with helmet

app.use(helmet());

// Make errors readable

const pe = new PrettyError();
pe.start();

//Set up body parser

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes

const authRoute = require("./routes/auth");

app.use("/auth", authRoute);

const verifyToken = require("./utilities/verifyToken");


const usersRoute = require("./routes/user-routes/users");

app.use("/users", verifyToken, usersRoute);

const genresRoute = require("./routes/genres");

app.use("/genres", verifyToken, genresRoute);

const samplesRoute = require("./routes/sample-routes/samples");

app.use("/samples", verifyToken, samplesRoute);

const likesRoute = require("./routes/likes");

app.use("/likes", verifyToken, likesRoute);

const followersRoute = require("./routes/user-routes/followers");

app.use("/followers", verifyToken, followersRoute);

const groupsRoute = require("./routes/groups");

app.use("/groups", verifyToken, groupsRoute);

const commentsRoute = require("./routes/comments");

app.use("/comments", verifyToken, commentsRoute);

const alertsRoute = require("./routes/user-routes/alerts");

app.use("/alerts", verifyToken, alertsRoute);

const messagesRoute = require("./routes/user-routes/messages");

app.use("/messages", verifyToken, messagesRoute);



function filesCors(req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", corsOrigin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}

//Static files

app.use('/audio', filesCors ,express.static(path.join(__dirname, 'public/audio')));

app.use('/covers', filesCors, express.static(path.join(__dirname, 'public/covers')));

app.use('/logos', filesCors, express.static(path.join(__dirname, 'public/logos')));

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});


module.exports = app;