import express from "express"
import authMiddleware from "../middleware/auth.js"
import { placeOrder, verifyOrder, getUserOrders, getAllOrders, checkPaymentVnpay } from "../controllers/orderController.js"
import orderModel from "../models/orderModel.js"

const orderRouter = express.Router();
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder)
orderRouter.get("/userorder", authMiddleware, getUserOrders);

orderRouter.get("/list", getAllOrders);
orderRouter.get("/check-payment-vnpay", checkPaymentVnpay);

// Cập nhật trạng thái đơn hàng
orderRouter.post('/status', async (req, res) => {
    const { orderId, status } = req.body;
    try {
        const updated = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (updated) {
            return res.json({ success: true, message: 'Cập nhật trạng thái thành công!' });
        } else {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});



export default orderRouter;