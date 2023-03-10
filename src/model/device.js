import mongoose from "mongoose"

const schema = mongoose.Schema

const device = new schema({
    name: { type: String },
    price: { type: Number },
    description: { type: String },
    img: { type: String },
    date: { type: Date, default: Date.now },
})

export default mongoose.model("device", device)