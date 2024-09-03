import mongoose from "mongoose";

const userInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        length: 10,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: [true,"City is required"]
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        length: 6,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    file: [
        {
            type: String
        }
    ]
}, { timestamps: true })
export const Userinfo = mongoose.model('Userinfo',userInfoSchema);