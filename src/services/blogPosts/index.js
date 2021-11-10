/* Backend needs these routes
GET /blogPosts => returns the list of blogPosts 
GET /blogPosts /123 => returns a single blogPost
POST /blogPosts => create a new blogPost
PUT /blogPosts /123 => edit the blogPost with the given id
DELETE /blogPosts /123 => delete the blogPost with the given id

*/


import express from "express"
import createHttpError from "http-errors"
import q2m from "query-to-mongo"

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


  /*TODO: implement the following endpoints

    Complete  GET /blogPosts/:id/comments => returns all the comments for the specified blog post
GET /blogPosts/:id/comments/:commentId=> returns a single comment for the specified blog post
      POST /blogPosts/:id => adds a new comment for the specified blog post
PUT /blogPosts/:id/comment/:commentId => edit the comment belonging to the specified blog post
DELETE /blogPosts/:id/comment/:commentId=> delete the comment belonging to the specified blog post */
postsRouter.get("/:postId/comments", async (req, res, next) => {
  try {
    const id = req.params.postId

    const post = await PostModel.findById(id)
    if (post) {
      res.send(post.comments)
    } else {
      next(createHttpError(404, `post: ${id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

postsRouter.post("/:postId/comments", async (req, res, next) => {
  try {
    const id = req.params.postId
    const post = await PostModel.findById(id,  { _id: 0 })
    //this grabs the post that has the comments document nested inside

    const newComment = req.body
    //the data for the comment is in the req body

    if (post) {
      const addComment = await PostModel.findByIdAndUpdate(id, { $push: { comments: newComment}   }, {new: true} )
      res.send(addComment)


    } else {
      next(createHttpError(404, `post with id: ${req.params.postId} not found!`))
    }

  } catch (error) {
    next(error)
  }
})




export default postsRouter
