import mongoose from "mongoose";

// by userSchema we can create user Model - in Mongo DB it is collerction
// 2 parameters - 1 parameter is user schema with its fields; 2 parameter for mongoose.Schema is options
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    isSeller: {
      type: Boolean,
      default: false,
      required: true,
    },
    seller: {
      name: String,
      logo: String,
      description: String,
      rating: { type: Number, default: 0, required: true },
      numReviews: { type: Number, default: 0, required: true },
    },
  },
  {
    timestamps: true, // when mongoose create the above fields into database, it adds to fields for each, created add and updated add
  }
);

// creating the model for the Schema
const User = mongoose.model("User", userSchema);
export default User;
