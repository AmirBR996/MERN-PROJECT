import mongoose from "mongoose"
export const connectDb = () =>{
    mongoose.connect(process.env.DB_URI,{
        dbName : process.env.DB_NAME,
        autoCreate : true
    }).then(()=>{
        console.log("Database connected.")
    })
    .catch((err) => {
        console.log("Database connection error")
        console.log(err)
    })
}