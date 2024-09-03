
import express from "express"
import cors from "cors"
import { authRouter, userRouter } from "./routes/index.js"
import { errorHandler } from "./utils/ErrorHandler.js"
import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})
const app = express()
app.use(cors({
    origin:"*",
    credentials:true
}))
app.use(express.json({limit:"100kb"}))
app.use(express.urlencoded({ extended: true, limit: "100kb" }))
app.get("/",(req,res)=>{
    return res.send("All Are working fine")
})
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/users",userRouter)
app.use(errorHandler)
export  {app}