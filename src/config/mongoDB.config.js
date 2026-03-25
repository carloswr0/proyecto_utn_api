import mongoose from "mongoose";
import ENVIRONTMENT from "./environment.config.js";

async function connectMongoDB() {
    try {
        await mongoose.connect(ENVIRONTMENT.MONGO_DB_CONNECTION_STRING);
        console.log("Successful connection");
    } catch(err) {
        console.log("Error connecting to MongoDB: ", err);
    }
}

export default connectMongoDB;