import mongoose from "mongoose"

const schema = mongoose.Schema

const user = new schema({
    username: String,
    id: String,
    password: String,
    courseID: String
})

export default mongoose.model("user", user)