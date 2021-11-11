import express from "express";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import AuthorModel from "./authorSchema.js";

const authorsRouter = express.Router();

//gets all the authors
authorsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const { total, authors } = await AuthorModel.findAuthors(mongoQuery);
    res.send({
      links: mongoQuery.links("/authors", total),
      pageTotal: Math.ceil(total / mongoQuery.options.limit),
      total,
      authors,
    });
  } catch (error) {
    next(error);
  }
});

//posts a new author/user
authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body);

    const { _id } = await newAuthor.save();
    // .save() === writeToFile
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

//get by id
authorsRouter.get("/:authorId", async (req, res, next) => {
    try {
        const id = req.params.authorId
    
        const author = await AuthorModel.findById(id)
        if (author) {
          res.send(author)
        } else {
          next(createHttpError(404, `Author with the ${id} not found!`))
        }
      } catch (error) {
        next(error)
      }
    })

//delete specific user
authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const id = req.params.authorId
    const deletedAuthor = await AuthorModel.deleteOne({id: id})

    if(deletedAuthor){
        res.status(204).send(`Author with id ${id} has been deleted`)
    }else {
        res.send(`Author with id ${id} not found`)
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:authorId", async (req, res, next) => {
    try {
        const id = req.params.authorId
        const updatedAuthor = await AuthorModel.findByIdAndUpdate(id, req.body, { new: true })
  
        if (updatedAuthor) {
          res.send(updatedAuthor)
        } else {
          next(createHttpError(404, `Author with the id: ${id} not found!`))
        }
      } catch (error) {
        next(error)
      }
    })

export default authorsRouter;
