import { ApiError, ApiResponse } from "../utils/index.js"
import { User } from "../models/auth.models.js"
import jwt from "jsonwebtoken"

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        // console.log(accessToken,refreshToken,x);

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access token")
    }
}

const registerUser = async (req, res, next) => {
    try {
        const { email, password, name  } = req.body
        if ([email, password, name, ].some((field) => field.trim() === "")) {
            throw new ApiError(400, "All Fields are required")
        }
        // check if user is already registered
        const existingUser = await User.findOne({email})
        if (existingUser) {
            throw new ApiError(409, "User with  or email already exists")
        }
        const user = await User.create({ email, password, name })
        const userCreated = await User.findById(user._id).select("-password -refreshToken")
        if (!userCreated) {
            throw new ApiError(500, "Something went wrong while registering user")
        }
        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(userCreated?._id)
        return res.status(201).json(new ApiResponse(201, { user: userCreated }, "User registered successfully"))

    } catch (error) {
        console.log(error.message);

        next(error)
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { email,password } = req.body
        if (!email) {
            throw new ApiError(400, "Invalid Email Address\n Email/ is required")
        }
        if (!password) {
            throw new ApiError(400, "Invalid password.")
        }
        const user = await User.findOne({ email  })
        // console.log(user);

        if (!user) {
            throw new ApiError(404, "User does not exist.")
        }
       
        const isPasswordValid = await user.isPasswordCorrect(password)
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid password")
        }
        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)
        // console.log(accessToken,refreshToken);

        const loginUser = await User.findById(user._id).select("-password -refreshToken")
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { user: loginUser, accessToken, refreshToken }, "User logged in succesfully"))

    } catch (error) {
        next(error)
    }
}
const getCurrentUser = async (req, res, next) => {
    try {
        const user = req.user
        if (!user) {
            throw new ApiError(401, "User must be logged in")
        }
        return res.status(200).send(new ApiResponse(200, user, "User information fetched successfully"))
    } catch (error) {
        next(error)
    }
}
const deleteUser = async (req, res, next) => {
    try {
        const user = req.user
        if (!user) {
            throw new ApiError(401, "User must be logged in")
        }
        const deactivatedUser = await User.findByIdAndUpdate(user?._id, { isActive: false }).select("-password -_id -__v")
        if (!deactivatedUser) {
            throw new ApiError(500, "Something went wrong with deactivating the user account.")
        }
        return res.status(200).send(new ApiResponse(200, deactivatedUser, "User Deactivated successfully"))
    } catch (error) {
        next(error)
    }
}
export { registerUser, loginUser, getCurrentUser, deleteUser }