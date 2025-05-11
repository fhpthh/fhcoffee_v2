import express from "express"
import authMiddleware from "../middleware/auth.js"
import { placeOrder, verifyOrder, getUserOrders } from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder)
orderRouter.get("/userorder", authMiddleware, getUserOrders);
export default orderRouter;