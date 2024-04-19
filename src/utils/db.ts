import mongoose from "mongoose"
import { config } from "./config"

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("Connectde to database successfully!")
        })
        mongoose.connection.on("error", (err) => {
            console.log("Failed while connnecting to DB", err);
            
        })
        await mongoose.connect(config.mongo_url as string)
    } catch (error) {
        console.error("Failed to connect to database", error);
        process.exit(1);
    }
}

export default connectDB