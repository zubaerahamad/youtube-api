import mongoose from "mongoose";
import {DB_NAME} from "../constant.ts";

const connectDb = async (): Promise<void> => {
    try {
        const mongoUri: string | undefined  = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        const mongodbUrl: string = `${mongoUri}/${DB_NAME}`;
        const connectionInstance = await mongoose.connect(mongodbUrl);
        console.log(`MongoDB connected || DB HOST: ${connectionInstance.connection.host}`,);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("MongoDB connection error:", error.message);
        } else {
            console.error("MongoDB connection error:", error);
        }
        process.exit(1);
    }
};
export default connectDb;