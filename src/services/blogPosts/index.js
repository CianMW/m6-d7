/* Backend needs these routes
GET /blogPosts => returns the list of blogPosts 
GET /blogPosts /123 => returns a single blogPost
POST /blogPosts => create a new blogPost
PUT /blogPosts /123 => edit the blogPost with the given id
DELETE /blogPosts /123 => delete the blogPost with the given id

*/


import express from "express"
import createHttpError from "http-errors"

import PostModel from "./postSchema.js"

const postsRouter = express.Router()

postsRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new PostModel(req.body) 
    // here happens validation of req.body, if it is not ok Mongoose will throw a "ValidationError" (btw user is still not saved in db yet)
    const { _id } = await newPost.save() 
    // .save() === writeToFile
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

postsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await PostModel.find()
    res.send(posts)
  } catch (error) {
    next(error)
  }
})

postsRouter.get("/:Id", async (req, res, next) => {
  try {
    const id = req.params.Id

    const post = await PostModel.findById(id)
    if (post) {
      res.send(post)
    } else {
      next(createHttpError(404, `User with id ${id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})


export default postsRouter
