import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://huehongphan0807:08072004@cluster0.g4iaufo.mongodb.net/FHCOFFEE').then(() => 
        console.log("MongoDB connected"));
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(); 
    }
};