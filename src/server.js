import express from "express"
import cors from "cors"
import mongoose from "mongoose"


const server = express()

server.use(cors("*"))
server.use(express.json())


mongoose.connect(process.env.MONGO_CONNECTION)
//connects to the server detailed in the env

const port = process.env.port

mongoose.connection.on("connected", () => {
    //checks if the connection is established
  console.log("Mongo Connected!")

  server.listen(port, () => {
    console.table(listEndpoints(server))

    console.log(`Server running on port ${port}`)
  })
})

mongoose.connection.on("error", err => {
  console.log(err)
})