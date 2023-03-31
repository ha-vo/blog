import mongoose from "mongoose"

const schema = mongoose.Schema

const lesson = new schema({
    title: String,
    videoID: String,
    courseID: {
        type: String,
        ref: 'device'
    }
})

export default mongoose.model("lesson", lesson)
