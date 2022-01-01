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

//A new blog post has the author id in the body as a string
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
      const mongoQuery = q2m(req.query)
      const total = await PostModel.countDocuments(mongoQuery.criteria)
      const posts = await PostModel.find(mongoQuery.Criteria).limit(mongoQuery.options.limit).skip(mongoQuery.options.skip).sort(mongoQuery.options.sort).populate({ path: "author", select: "name surname"})
      res.send({ links: mongoQuery.links("/posts", total), pageTotal: Math.ceil(total / mongoQuery.options.limit),posts})
      }
      catch (error) {console.log(error)}
      })




//     const posts = await PostModel.find()
//     res.send(posts)
//   } catch (error) {
//     next(error)
//   }
// })

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
    COMPLETE  POST /blogPosts/:id => adds a new comment for the specified blog post
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


//gets specific comment
postsRouter.get("/:postId/comments/:commentId", async (req, res, next) => {
  try {

    const postId = req.params.postId
    const commentId = req.params.commentId

    const post = await PostModel.findById(postId)
    if (post) {
      const foundComment = post.comments.find(comment => comment._id.toString() === commentId)
      res.send(foundComment)
    } else {
      next(createHttpError(404, `post: ${id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})


//ADDS A COMMENT TO A BLOG POST
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


//UPDATES A COMMENT 

postsRouter.put("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const postId = req.params.postId
    const commentId = req.params.commentId
    const post = await PostModel.findById(postId)

    if (post) {
      const index = post.comments.findIndex(i => i._id.toString() === commentId)
      console.log(index)

      if (index !== -1) {
        console.log(post.comments[index])
        post.comments[index] = { ...post.comments[index].toObject(), ...req.body }
        await post.save()
        res.send(post)
      } else {
        next(createHttpError(404, `comment with id: ${commentId} not found!`))
      }
      
    } else {
      next(createHttpError(404, `post with id:  ${commentId} not found!`))
    }

  } catch (error) {
    next(error)
  }
})


//DELETES A COMMENT

postsRouter.delete("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const postId = req.params.postId
    const commentId = req.params.commentId

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    )
    if (updatedPost) {
      res.send(updatedPost)
    } else {
      next(createHttpError(404, `post with id ${postId} not found!`))
    }
  } catch (error) {
    next(error)
  }

})





//Gets all likes 

postsRouter.get("/:postId/likes", async (req, res, next) => {
  try {

    const id = req.params.postId

    const post = await PostModel.findById(id).populate({ path: "author", select: "name surname"})
    const likes = post.likes
    const likedBy = await post.likes
    const total = await likes.length
    console.log("CHECKING",total)
    if (post) {
      res.send(`Total like: ${total}   Liked by: ${likes}`)
    } else {
      res.send(`post: ${id} not found!`)
    }
  } catch (error) {
    next(error)
  }
})


//Adds new like
postsRouter.post("/:postId/likes/:authorId", async (req, res, next) => {
  try {
    const authId = req.params.authorId
    const id = req.params.postId
    const post = await PostModel.findById(id,  { _id: 0 })
    //this grabs the post that has the likes document nested inside

    const newLike = authId
    //this "like" is composed of the author/users id

    if (post) {
      const likeString = await post.likes.map(like => like.toString())
      console.log("after toString() ", likeString )
      const checkForLike = await likeString.findIndex(like => like === authId )
      console.log("THE INDEX: ", checkForLike)
      if (checkForLike !== -1){
        console.log("REMOVING")
        const removeLike = await PostModel.findByIdAndUpdate(id,  { $pull: { likes:  newLike  } } )       
        res.send(removeLike)
      } else {
        console.log("ADDING")
        const addLike = await PostModel.findByIdAndUpdate(id, { $push: { likes: newLike}   }, {new: true} )
        res.send(addLike)
      }


    } else {
      next(createHttpError(404, `post with id: ${req.params.postId} not found!`))
    }

  } catch (error) {
    next(error)
  }
})


export default postsRouter
