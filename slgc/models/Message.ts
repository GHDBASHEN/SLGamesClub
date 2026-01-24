import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
    {
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const Message = models.Message || model("Message", MessageSchema);
