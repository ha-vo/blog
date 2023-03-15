import mongoose from "mongoose"

const schema = mongoose.Schema

const device = new schema({
    username: String,
    password: String
})

export default mongoose.model("user", device)