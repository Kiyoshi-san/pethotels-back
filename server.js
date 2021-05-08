import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import indexRouter from "./routes/index.js";
import userRouter from "./routes/users.js";

// ALLOWING process.env
dotenv.config();

// CONNECTING TO MONGOOSE
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/chippy", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// #######################################
// SERVER
// #######################################

// SERVER CONFIG
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// CREATING THE SERVER
const port = process.env.PORT || 5000;

//SET STATIC DIR
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});

// #######################################
// ROUTES
// #######################################
app.use("/", indexRouter);
app.use("/users", userRouter);

// #######################################
// ERROR HANDLER
// #######################################
/* app.use(function () {
  res.status(err.status || 500).json(err);
}); */

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
