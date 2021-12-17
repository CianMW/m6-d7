import jwt from "jsonwebtoken"

export const jwtAuth = async (user) => {

const token = await generateJWTToken({_id: user._id})
return token
}

const generateJWTToken = payload => new Promise((resolve, reject) => {
jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "30m"}, (err, token) => {
    if(err) reject(err)
    else resolve(token)
    });
})

  generateJWTToken({})
  .then(token => console.log(token))
  .catch(err => console.log(err))