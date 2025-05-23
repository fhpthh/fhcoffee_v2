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

    if (!orderId || !status) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin orderId hoặc status'
        });
    }

    try {
        // Validate status
        const validStatuses = ['processing', 'ship', 'delivered', 'canceled'];
        if (!validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ'
            });
        }

        const updated = await orderModel.findByIdAndUpdate(
            orderId,
            { status: status.toLowerCase() },
            { new: true }
        );

        if (updated) {
            return res.json({
                success: true,
                message: 'Cập nhật trạng thái thành công!',
                data: updated
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật trạng thái đơn hàng',
            error: error.message
        });
    }
});



export default orderRouter;