import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRoute from './routes/foodRoute.js';
import userModel from './models/userModel.js';
import 'dotenv/config.js'
// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());

// db connect
connectDB();

//api endpoints
app.use("/api/food", foodRoute);
app.use("/images", express.static('uploads'))
app.use("/api/user", userModel)
// test route
app.get("/", (req, res) => {
    res.send("API is running");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
