import mongoose from "mongoose";
import validator from "validator";

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:validator.isEmail,
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"Password must be atleast 8 characters"],
    },
    avatar:{
        public_id:{
            type:String,
        },
        url:{
            type:String,
        }
    }
});
export const User=mongoose.model("User",userSchema);