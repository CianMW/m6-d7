
import express from "express"
import createHttpError from "http-errors"
import q2m from "query-to-mongo"
import AuthorModel from "./authorSchema.js"

const authorsRouter = express.Router()


//gets all the authors
authorsRouter.get("/", async (req, res, next) => {
    try{
        const mongoQuery = q2m(req.query)
        const { total, authors } = await AuthorModel.findAuthors(mongoQuery)
        res.send({ links: mongoQuery.links("/authors", total), pageTotal: Math.ceil(total / mongoQuery.options.limit), total, authors })
    }
    catch(error) {
        next(error)
    }
})


//posts a new author/user
authorsRouter.post("/", async (req, res, next) => {
    try{
        const newAuthor = new AuthorModel(req.body) 

        const { _id } = await newAuthor.save() 
        // .save() === writeToFile
        res.status(201).send({ _id })
    }
    catch(error){
        next(error)
    }
})

//get by id
authorsRouter.get("/", async (req, res, next) => {})

//delete specific user
authorsRouter.delete("/", async (req, res, next) => {})


authorsRouter.put("/", async (req, res, next) => {})







export default authorsRouter