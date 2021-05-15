import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../seed/index.js";
import Category from "../models/categoryModel.js";

const categoryRouter = express.Router();

// CATEGORY SEED
categoryRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const createdCategories = await Category.insertMany(data.categories);
    res.send(createdCategories);
  })
);

// GET CATEGORIES
categoryRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.send(categories);
  })
);

export default categoryRouter;
