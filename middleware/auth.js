import { User } from "../models/userSchema.js";
import { ErrorHandler } from "./error.js";
import jwt from "jsonwebtoken"

export const isAuthenticated=async(req,res,next)=>{
    const {token}=req.headers;
    if(!token){
        return next(new ErrorHandler("User not authenticated",400));
    }
    const decodedToken=await jwt.verify(token,process.env.JWT_SECRET);
    req.user=await User.findById(decodedToken.id);
    next();
}