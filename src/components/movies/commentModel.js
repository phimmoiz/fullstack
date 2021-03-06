import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    anonymousName: {
        type: String,
        default: "Khách "
    },
    anonymousAvatar: {
        type: String,
        default: "/assets/images/anonymous.jpg",
    }
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;