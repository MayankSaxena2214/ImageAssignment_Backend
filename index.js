import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import {v2 as cloudinary} from "cloudinary"
import { dbConnection } from "./database/dbConnection.js";
import { ErrorMiddleware } from "./middleware/error.js";
import { userRouter } from "./routers/userRouter.js";
import fileUpload from "express-fileupload";

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
dotenv.config();
dbConnection();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
    api_key:process.env.CLOUDINARY_APIKEY,
    api_secret:process.env.CLOUDINARY_SECRETKEY,
})
app.use(fileUpload({
    tempFileDir:"/tmp/",
    useTempFiles:true,
}))
app.use("/api/v1/users",userRouter);


app.use(ErrorMiddleware);
app.listen(process.env.PORT,()=>{
    console.log(`App is listening on the port ${process.env.PORT}`);
})
