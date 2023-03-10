import mongoose from "mongoose"

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1/summer')
        console.log("connect successfully")
    } catch (error) {
        console.log("connect failly")
    }
}

export default { connect }