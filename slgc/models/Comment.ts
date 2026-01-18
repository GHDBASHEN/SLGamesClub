import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
    {
        content: { type: String, required: true },

        // Who wrote the comment
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },

        // Which post does this belong to
        postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    },
    { timestamps: true }
);

export const Comment = models.Comment || model("Comment", CommentSchema);