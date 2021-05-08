import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { generateToken, isAdmin, isAuth } from "../models/utils.js";
import data from "../seed/index.js";

const userRouter = express.Router();

// USER SEED
userRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const createdUsers = await User.insertMany(data.users);
    res.send(createdUsers);
  })
);

// SIGN IN
userRouter.post(
  "signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compare(req.body.password, user.password)) {
        const { _id, name, email, isAdmin, isSeller } = user;
        res.send({
          _id,
          name,
          email,
          isAdmin,
          isSeller,
          token: generateToken(user),
        });
        return;
      } else {
        res.status(401).send({ message: "Usuário ou senha incorreto" });
      }
    } else {
      res.status(401).send({ message: "Usuário ou senha incorreto" });
    }
  })
);

// GET USER BY ID
userRouter.get(
  "/:id",
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) res.send(user);
    else res.status(404).send({ message: "Usuário não encontrado" });
  })
);

// GET TOP SELLERS
userRouter.get(
  "/top-sellers",
  expressAsyncHandler(async (req, res) => {
    const topSellers = await User.find({ isSeeler: true })
      .sort({
        "seller.rating": -1,
      })
      .limit(5);
    res.send(topSellers);
  })
);

// REGISTER
userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt(req.body.password, 8),
    });
    const createUser = await user.save();
    const { _id, name, email, isAdmin, isSeller, token } = createUser;
    res.send({
      _id,
      name,
      email,
      isAdmin,
      isSeller,
      token,
    });
  })
);

// UPDATE USER PROFILE
userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = User.findById(req.user_id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (user.isSeller) {
        user.seller.name = req.body.sellerName || user.seller.name;
        user.seller.logo = req.body.sellerLogo || user.seller.logo;
        user.seller.description =
          req.body.description || user.seller.description;
      }
      if (req.body.password) {
        user.password = bcrypt(req.body.password, 8);
      }
      const updateUser = await user.save();
      const { _id, name, email, isAdmin, isSeller, token } = updateUser;
      res.send({ _id, name, email, isAdmin, isSeller, token });
    }
  })
);

// GET USERS
userRouter.get(
  "/",
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

// DELETE USER
userRouter.delete(
  "/:id",
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.body._id);
    if (user) {
      if (user.isAdmin) {
        res
          .status(400)
          .send({ message: "Não é possível excluir um usuário Administrador" });
        return;
      }
      const deleteUser = await user.remove(user);
      res.send({ message: "Usuário removido com sucesso!", user: deleteUser });
    } else {
      res.status(404).send({ message: "Usuário não encontrado" });
    }
  })
);

// UPDATE USER INFO
userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isSeller = req.body.isSeller || user.isSeller;
      user.isAdmin = req.body.isAdmin || user.isAdmin;
      const updateUser = await user.save();
      res.send({
        message: "Usuário atualizado com sucesso!",
        user: updateUser,
      });
    } else {
      res.status(404).send({ message: "Usuário não encontrado" });
    }
  })
);

export default userRouter;
