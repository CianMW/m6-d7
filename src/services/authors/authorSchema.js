import mongoose from "mongoose";
import bcrypt from "bcrypt";
// import UserModel from ""

const { Schema, model } = mongoose;

const authorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    surname: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

//needs to use a trad function because it uses "this" to reference the model
authorSchema.static("findAuthors", async function (query) {
  const total = await this.countDocuments(query);
  const authors = await this.find(query.criteria)
    .limit(query.options.limit)
    .skip(query.options.skip)
    .sort(query.options.sort);

  return { total, authors };
});

// "This" refers to the model
authorSchema.pre("save", async function () {
  const newAuthor = this;
  const plainPW = newAuthor.password;
  if (newAuthor.isModified("password")) {
    const hash = await bcrypt.hash(plainPW, 10);
    newAuthor.password = hash;
  }
  return newAuthor
});


authorSchema.statics.checkCredentials = async function (email, plainPW) {
  console.log("EMAIL:", email)
  console.log("pw:",plainPW)
  //finds user by email
  //if user => compare PWs 
  const user = await this.findOne({email: email})  

  if (user) {
      const passwordMatch = await bcrypt.compare(plainPW, user.password)
      if (passwordMatch) {
          return user
      } else {
          return null
      }
  } else {

    return undefined
  }
  
}  


authorSchema.methods.toJSON = function() {
  const CurrentDoc = this  
  const authorObject = CurrentDoc.toObject()
  delete  authorObject.password
  //Doesn't affect the database
  delete  authorObject.__v

  return authorObject
}  

export default model("Author", authorSchema);
