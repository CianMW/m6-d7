import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authorSchema = new Schema(
    {
    name: { type: String, required: true },
    surname: { type: String, required: true },

},{timestamps: true})

export default model("Author", authorSchema)