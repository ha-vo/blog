import mongoose from "mongoose"

const schema = mongoose.Schema

const user = new schema({
    username: String,
    password: String
})

export default mongoose.model("user", user)