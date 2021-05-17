import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    coment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: { type: Array, required: true },
    brand: { type: String, required: true },
    categoryData: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    categoryName: { type: String, required: true },
    description: { type: String, required: true },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema],
    sellQty: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 1, brand: 1, seller: 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
