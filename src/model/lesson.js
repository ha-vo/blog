import mongoose from "mongoose"

const schema = mongoose.Schema

const lesson = new schema({
    title: String,
    videoID: String,
    courseID: String
})

export default mongoose.model("lesson", lesson)
