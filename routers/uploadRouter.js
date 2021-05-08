import multer from "multer";
import express from "express"; // as its a router needs express
import { isAuth } from "../models/utils.js";

const uploadRouter = express.Router();

// when user upload file to the path, lets put the image into the storage folder, there are other types of uploading file like in the cloud with S3
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // cb - callback
    cb(null, "uploads/"); // null - for no error; uploads - folder to save the files
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`); // null - for no error; 2 - name of file
  },
});

// defining upload middleware, we can use it in the Router
const upload = multer({ storage });

// localhost:5000/api/uploads
uploadRouter.post("/", isAuth, upload.single("image"), (req, res) => {
  // we are saying that multer is expecting a single file and the name of the file in the request is image
  res.send(`/${req.file.path}`);
});

export default uploadRouter;
