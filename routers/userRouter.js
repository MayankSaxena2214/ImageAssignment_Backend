import express from "express"
import { fetchUser, getAllUsers, register } from "../controllers/userController.js";
import { login } from "../controllers/userController.js";
import { logout } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";


export const userRouter=express.Router();

userRouter.post("/register",register);
userRouter.post("/login",login);
userRouter.post("/logout",isAuthenticated,logout);
userRouter.get("/fetchUser",isAuthenticated,fetchUser);
userRouter.get("/allusers",getAllUsers);