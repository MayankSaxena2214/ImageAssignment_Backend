import mongoose from "mongoose";

export const dbConnection=async()=>{
    await mongoose.connect(process.env.MONGODB_URL,{
        dbName:"Assignment"
    })
    .then(()=>{
        console.log(`MongoDb connected`);
    })
    .catch((err)=>{
        console.log(`Error occured ${err}`)
    })
}