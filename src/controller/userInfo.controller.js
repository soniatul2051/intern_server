import { Userinfo } from "../models/userInfo.models.js"
import {uploadOnCloudinary} from "../utils/uploadCloudinary.js"
import { ApiError, ApiResponse } from "../utils/index.js"

const registerUser = async (req, res, next) => {
    try {
        const { name, email, phone, address, city, state, pincode, country } = req.body
        if ([name, email, phone, address, city, state, pincode, country].some(field=>field?.trim()==="")) {
            throw new ApiError(400,"All fields are required")
        }
        const existingForm = await Userinfo.findOne({email})
        if (!existingForm) {
            throw new ApiError(404,"User details not  found")
        }
        const files = req.files
        if (files.length<=0) {
            throw new ApiError(400,"Files are required")
        }
          
        const uploadedFiles = await Promise.all(
            files.map(async file => await uploadOnCloudinary(file.path))
        );
        // console.log(uploadedFiles);
        
        // Ensure all URLs are retrieved
        if (uploadedFiles.some(secure_url => !secure_url)) {
            throw new ApiError(500, "Failed to upload files");
        }
        let uploadedFilesUrl=uploadedFiles.map(file=>file.url)
        const updatedUser = await Userinfo.findByIdAndUpdate(existingForm._id,{
            file:uploadedFilesUrl
        })
        // const newUser = await Userinfo.create({name,email,phone,address,city,state, pincode, country,file:uploadedFilesUrl})
        // if (!newUser) {
        //     throw new ApiError(500,"Something went wrong while registering details")
        // }
        console.log(`New User registered : ${name}`);
        
        return res.status(201).send(new ApiResponse(201,updatedUser,"Details updated successfully"))
    } catch (error) {
        next(error)
    }
}
const registerPartialInfo =async (req, res, next) => {
    try {
        const { name, email, phone, address, city, state, pincode, country } = req.body
        console.log(name, email, phone, address, city, state, pincode);
        
        if ([name, email, phone, address, city, state, pincode, country].some(field=>field?.trim()==="")) {
            throw new ApiError(400,"All fields are required")
        }
        const newUser = await Userinfo.create({name,email,phone,address,city,state, pincode, country,file:[]})
        if (!newUser) {
            throw new ApiError(500,"Something went wrong while registering details")
        }
        console.log(`New User registered : ${name}`);
        
        return res.status(201).send(new ApiResponse(201,newUser,"Details registered successfully"))
    } catch (error) {
        next(error)
    }
}
const getUserDetails = async (req,res,next)=>{
    try {
        const userDetails = await Userinfo.find({})
        return res.status(200).send(new ApiResponse(200,userDetails,"All details fetched successfully"))
    } catch (error) {
        next(error)
    }
}
const getUserBasedOnDate = async (req,res,next)=>{
    try {
        const { startDate, endDate } = req.query;
        console.log(startDate,endDate);
        if (!startDate || !endDate){
            throw new ApiError(400,"start date and end date is not valid")
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        const data = await Userinfo.find({createdAt:
            { $gte: start, $lte: end }
        })
        return res.status(200).send(new ApiResponse(200,data,"All details fetched successfully"))
    } catch (error) {
        next(error)
    }
}

export { registerUser,getUserDetails,getUserBasedOnDate,registerPartialInfo }