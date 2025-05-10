import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRoute from './routes/foodRoute.js';
import 'dotenv/config.js'
import userRouter from './routes/userRoute.js';

// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors({
    origin: '*'
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// db connect
connectDB();

//api endpoints
app.use("/api/user", userRouter);
app.use("/api/food", foodRoute);
app.use("/images", express.static('uploads'));

// test route
app.get("/", (req, res) => {
    res.send("API is running");
});

// Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error: err.message
//     });
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
