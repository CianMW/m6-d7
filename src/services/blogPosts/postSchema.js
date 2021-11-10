import mongoose from "mongoose";

const { Schema, model } = mongoose;

//A Schema = defines the shape and content of a Document
// A Model =

const postSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String },
    },
    author: {
      name: { type: String, required: true },
      avatar: { type: String },
    },
    content: { type: String, required: true },
    comments: [
      {
        type: new mongoose.Schema(
          { username: { type: String }, content: { type: String } },
          { timestamps: true }
        ),
      },
    ],
  },
  {
    timestamps: true, // Automatically adds timestamp for setting and update
  }
);







export default model("Post", postSchema);
// links to the posts collection of documents. If it doesn't exist it auto creates them

/* 
    A POST WILL LOOK LIKE THIS:
{
	    "_id": "MONGO GENERATED ID",
	    "category": "ARTICLE CATEGORY",
	    "title": "ARTICLE TITLE",
	    "cover":"ARTICLE COVER (IMAGE LINK)",
	    "readTime": {
	      "value": Number,
	      "unit": "minute"
	    },
	    "author": {
	      "name": "AUTHOR NAME",
	      "avatar":"AUTHOR AVATAR LINK"
	    },
	    "content": "HTML",
	    "createdAt": "DATE",
      "updatedAt": "DATE"           
}
*/
