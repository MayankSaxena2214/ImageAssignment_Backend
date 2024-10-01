import { ErrorHandler } from "../middleware/error.js";
import { User } from "../models/userSchema.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cloudinary from "cloudinary"
import { catchAsyncError } from "../middleware/catchAsyncError.js";

export const register=catchAsyncError(async(req,res,next)=>{
    let {name,email,password}=req.body;
    
    if(!password){
        return next(new ErrorHandler("password is required",400));
    }
    if(!email){
        return next(new ErrorHandler("Email is required",400));
    }
    if(!name){
        return next(new ErrorHandler("name is required",400));
    }
    let user=await User.findOne({email:email});
    if(user){
        return next(new ErrorHandler("User already exists",400));
    }
    if(!req.files || Object.keys(req.files).length===0){
        return next(new ErrorHandler("Image not supplied",400));
    }
    const {avatar}=req.files;
    const allowedFormats=["image/png","image/jpg","image/webp","image/jpeg"];
    if(!allowedFormats.includes(avatar.mimetype)){
        return next(new ErrorHandler("Kindly upload image in png,jpg or webp format",400));
    }
    const cloudinaryResponse=await cloudinary.uploader.upload(
        avatar.tempFilePath,
    )
    if(!cloudinaryResponse || cloudinaryResponse.error){
        return next(new ErrorHandler(`Cloudinary error occured ${cloudinaryResponse.error}`||"Unhandled cloudianary error"));
    }
    password=await bcrypt.hash(password,10);
    user=await User.create({
        name,email,password,avatar:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url
    }
    })
    
    
    return res.status(200).json({
        success:true,
        message:"User registered successfully",
    })
})
export const login=catchAsyncError(async(req,res,next)=>{
    let {email,password}=req.body;
    let user=await User.findOne({email:email});
    if(!user){
        return next(new  ErrorHandler("User with this email does not exist",404));
    }
    //match password
    const isMatched=await bcrypt.compare(password,user.password);
    if(!isMatched){
        return next(new ErrorHandler("Password is incorrect",400));
    }
    const token=await jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES});
    return res.status(200).json({
        message:"User logged in successfully",
        success:true,
        token:token,
        user:user,
    })
})

export const logout=catchAsyncError(async(req,res,next)=>{
    return res.status(200).json({
        message:"User logout successfully"
    })
})
export const fetchUser=catchAsyncError(async(req,res,next)=>{
    const {token}=req.headers;
    const decodedToken=await jwt.verify(token,process.env.JWT_SECRET);
    const user=await User.findById(decodedToken.id);
    return res.status(200).json({
        message:"User fetched successfully",
        user,
        success:true,
    })
})
export const getAllUsers=catchAsyncError(async(req,res,next)=>{
    const users=await User.find();
    return res.status(200).json({
        success:true,
        users
    })
})