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
    //the post as outlined in the schema is created here
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

postsRouter.get("/:postId", async (req, res, next) => {
  try {
    const id = req.params.postId

    const post = await PostModel.findById(id)
    if (post) {
      res.send(post)
    } else {
      next(createHttpError(404, `post: ${id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

//updates a post

postsRouter.put("/:postId", async (req, res, next) => {
    try {
      const id = req.params.postId
      const updatedPost = await PostModel.findByIdAndUpdate(id, req.body, { new: true })

      if (updatedPost) {
        res.send(updatedPost)
      } else {
        next(createHttpError(404, `post: ${id} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })

  //Deletes a post
postsRouter.delete("/:postId", async (req, res, next) => {
    try {
      const id = req.params.postId
      const deletedPost = await PostModel.deleteOne({id: id})

      if (deletedPost) {
        res.send(`Post with id: ${id} has been deleted `)
      } else {
        next(createHttpError(404, `post: ${id} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })

export default postsRouter
