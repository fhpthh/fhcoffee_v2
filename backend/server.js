import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRoute from './routes/foodRoute.js';
import 'dotenv/config.js'
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';

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
    console.log('=== Incoming Request ===');
    console.log('Time:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('=====================');
    next();
});

// db connect
connectDB();

//api endpoints
app.use("/api/user", userRouter);
app.use("/api/food", foodRoute);
app.use("/api/cart", cartRouter);
app.use("/images", express.static('uploads'));

// test route
app.get("/", (req, res) => {
    res.send("API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message
    });
});

// 404 handler
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.url);
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('Available routes:');
    console.log('- POST /api/cart/add');
    console.log('- DELETE /api/cart/remove');
    console.log('- POST /api/cart/get');
});
