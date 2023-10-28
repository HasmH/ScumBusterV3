import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    steamid: {
        type: String,
        required: true,
    },
    downvotes: {
        type: Number,
        required: false,
        default: 0,
    }
})

const User = mongoose.model('User', userSchema)
export { User }