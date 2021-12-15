import createHttpError from "http-errors"
import AuthorModel from "../services/authors/authorSchema.js";
import atob from "atob";

const authorizationMiddle = async (req, res, next) => {
    // check if the header exists
    if (req.headers.authorization) {

        const base64Cred = req.headers.authorization.split(" ")[1]
        //atob changes base64 into a string
        const credentials = atob(base64Cred)
        console.log("THE CREDS: ",credentials)
        const [email, password] = credentials.split(":")
        // to check the db can use a custom static method
        const user = await AuthorModel.checkCredentials(email, password)
        //checkCredentials finds the user by email and checks the password
        console.log(user)
        if(user) {
        //The user was found and password comparison is correct 
            req.user = user // attach the verfied user to request
            next()
        } else {
            
        next(createHttpError(401, "Generic Authorization Error"))
}

    } else {
        // if doesn't exist create error
        next(createHttpError(401, "No Authorization"))
    }
} 

export default authorizationMiddle