import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://huehongphan0807:08072004@cluster0.g4iaufo.mongodb.net/FHCOFFEE');
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        console.log("Continuing without database connection...");
    }
};