import mongoose from 'mongoose'
const schema = mongoose.Schema

const mycourse = new schema({
    username: String,
    courseID: {
        type: String,
        ref: 'device'
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
}, { collection: "mycourse" })

export default mongoose.model("mycourse", mycourse)