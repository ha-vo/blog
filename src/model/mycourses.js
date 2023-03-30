import mongoose from 'mongoose'
const schema = mongoose.Schema

const mycourse = new schema({
    username: String,
    courseID: String,
    desciption: String,
    createAt: {
        type: Date,
        default: Date.now()
    }
})

export default mongoose.model("mycourse", mycourse)