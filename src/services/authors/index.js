import express from "express";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import authorizationMiddle from "../../middlewares/authorization.js";
import AuthorModel from "./authorSchema.js";
import PostModel from "../blogPosts/postSchema.js";
import { jwtAuth } from "../../tools/index.js";
import  verifyTokenMiddle  from "../../middlewares/verifyTokenMiddle.js";

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
//user/author login
authorsRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await AuthorModel.checkCredentials(email, password);
    if (user) {
      const token = await jwtAuth(user);
      if (!token) {
        next(createHttpError(403));
      } else {
        res.status(200).send({ token });
      }
    } else {
      next(createHttpError(404, "User credentials error"));
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.post("/register", async (req, res, next) => {
  try {
    const email = req.body.email
    console.log(email)

    const foundEmail = await AuthorModel.find({ email });
    console.log(foundEmail)
    if (foundEmail.length > 0) {
      next(createHttpError(400, "Email is already in use"));
    } else {
      const newAuthor = new AuthorModel(req.body);

      const { _id } = await newAuthor.save();
      // .save() === writeToFile
      res.status(201).send({ _id });
    }
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

// The user can get their own details
authorsRouter.get("/me", verifyTokenMiddle, async (req, res, next) => {
  try {
    if (req.user) {
      res.send(req.user);
    } else {
      next(createHttpError(404, `Author with the ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//get by id
authorsRouter.get("/:authorId", authorizationMiddle, async (req, res, next) => {
  try {
    const id = req.params.authorId;

    const author = await AuthorModel.findById(id);
    if (author) {
      res.send(author);
    } else {
      next(createHttpError(404, `Author with the ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.get(
  "/me/stories",
  authorizationMiddle,
  async (req, res, next) => {
    try {
      const id = req.user._id;

      const posts = await PostModel.find({ author: id });
      if (posts) {
        res.send(posts);
      } else {
        next(
          createHttpError(
            404,
            `Blog posts made with the author ID: ${id} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//delete current User
authorsRouter.delete("/me", authorizationMiddle, async (req, res, next) => {
  try {
    const id = req.user._id;
    const deletedAuthor = await AuthorModel.deleteOne({ id: id });

    if (deletedAuthor) {
      res.status(204).send(`Author with id ${id} has been deleted`);
    } else {
      res.send(`Author with id ${id} not found`);
    }
  } catch (error) {
    next(error);
  }
});

//delete specific user
authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const id = req.params.authorId;
    const deletedAuthor = await AuthorModel.deleteOne({ id: id });

    if (deletedAuthor) {
      res.status(204).send(`Author with id ${id} has been deleted`);
    } else {
      res.send(`Author with id ${id} not found`);
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const id = req.params.authorId;
    const updatedAuthor = await AuthorModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedAuthor) {
      res.send(updatedAuthor);
    } else {
      next(createHttpError(404, `Author with the id: ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// user may update themselves
authorsRouter.put("/me", authorizationMiddle, async (req, res, next) => {
  try {
    const updatedAuthor = await AuthorModel.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    );

    if (updatedAuthor) {
      res.send(updatedAuthor);
    } else {
      next(createHttpError(404, `Author with the id: ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
