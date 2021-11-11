import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authorSchema = new Schema(
    {
    name: { type: String, required: true },
    surname: { type: String, required: true },

},{timestamps: true})


//needs to use a trad function 
authorSchema.static("findAuthors", async function (query) {
   
    const total = await this.countDocuments(query)
    const authors = await this.find(query.criteria)
      .limit(query.options.limit)
      .skip(query.options.skip)
      .sort(query.options.sort)
  
    return { total, authors }
  })














export default model("Author", authorSchema)