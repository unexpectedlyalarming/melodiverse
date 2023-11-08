import express from "express";
const app = express();
import morgan from "morgan";
import cors from "cors";
import PrettyError from "pretty-error";
import mongoose from "mongoose";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


dotenv.config();



// Global variables

const port: number = Number(process.env.PORT) || 2000;
const host: any = process.env.HOST || "localhost";

const dbHost: any = process.env.DB_HOST || "localhost";
const dbPort: any = process.env.DB_PORT || 27017;
const dbName: string = process.env.DB_NAME || "melodiversedb";

const dbUser: any = process.env.DB_USER || null;
const dbPass: any = process.env.DB_PASS || null;

const sessionSecret: any = process.env.SESSION_SECRET || "secret";

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
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  next();
});

app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    withCredentials: true,
    accessControlAllowCredentials: true,
  } as cors.CorsOptions)
);

//Set up cookie parser

app.use(cookieParser());



//Secure with helmet

app.use(helmet());

//Handle errors with grace (make it not give me a headache)

const pe = new PrettyError();
pe.start();

//Set up body parser

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Set up routes

const authRoute = require("./routes/auth");

app.use("/auth", authRoute);

const verifyToken = require("./utilities/verifyToken");


const usersRoute = require("./routes/user-routes/users");

app.use("/users", verifyToken, usersRoute);

const genresRoute = require("./routes/genres");

app.use("/genres", verifyToken, genresRoute);

const samplesRoute = require("./routes/sample-routes/samples");

app.use("/samples", verifyToken, samplesRoute);



app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});


module.exports = app;