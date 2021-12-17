import createHttpError from "http-errors"
import jwt from "jsonwebtoken"
import authorModel from "../services/authors/authorSchema.js"
import { verifyDecodeJWT } from "./verifyAndDecode"

export const verifyToken = async (req, res, next) => {
    try{ 
        //grabs the token from the header and removes "Bearer"
        const token = req.headers.authorization.replace("Bearer ", "")
        //verifyDecodeJWT must be awaited as it is a returned promise
        const decodedToken = await verifyDecodeJWT(token)
        console.log("DECODED : ", decodedToken)

        //if token => token is used to set the user 
        if (decodedToken) {
            const user = await AuthormModel.findById(decodedToken._id)
            req.user = user  
            next()
        } else {
            next(createHttpError(404))
        }
            if (err) {
                return res.status(403)
            } else {
                req.user = user
            }

    } catch(error) 
    {
        next(createHttpError(error))
    }

}
