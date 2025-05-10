import express from "express"
import { loginUser, registerUser } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register", (req, res, next) => {
    console.log("Received register request:", req.body);
    next();
}, registerUser)

userRouter.post("/login", (req, res, next) => {
    console.log("Received login request:", req.body);
    next();
}, loginUser)

export default userRouter