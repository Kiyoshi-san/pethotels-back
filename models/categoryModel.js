import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    image: { type: String, required: false },
    categoryId: { type: String, required: true },
    parentCategoryId: { type: String, required: true },
    online: { type: Boolean, required: true },
  },
  {
    timestamp: true,
  }
);

categorySchema.index({ categoryId: 1, parentCategoryId: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
