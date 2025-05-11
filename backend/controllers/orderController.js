import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import qs from "qs";
import crypto from "crypto";
import { log } from "console";

const frontend_url = "http://localhost:5173"; // URL frontend của bạn
const vnp_TmnCode = process.env.VNP_TMNCODE; // Lấy từ biến môi trường
const vnp_HashSecret = process.env.VNP_HASHSECRET; // Lấy từ biến môi trường
const vnp_Url = process.env.VNP_URL; // Lấy từ biến môi trường

const placeOrder = async (req, res) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        if (
            !req.body.fullName ||
            !req.body.phone ||
            !req.body.address ||
            !req.body.orderItems ||
            !req.body.total
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        // Tạo đơn hàng mới (dùng orderModel)
        const paymentMethod = req.body.paymentMethod || "vnpay";
        const newOrder = new orderModel({
            userId: req.user._id, // Lấy từ middleware auth
            items: req.body.orderItems,
            amount: req.body.total,
            address: {
                fullName: req.body.fullName,
                phone: req.body.phone,
                address: req.body.address
            },
            // status, date, payment dùng mặc định
        });

        await newOrder.save();
        console.log("Order saved:", newOrder);

        // Nếu là COD thì trả về luôn, không tạo URL VNPay
        if (paymentMethod === "cod") {
            return res.status(200).json({ success: true, message: "Đặt hàng thành công (COD)" });
        }

        // Tạo URL thanh toán VNPay
        const vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode: vnp_TmnCode,
            vnp_Locale: "vn",
            vnp_CurrCode: "VND",
            vnp_TxnRef: newOrder._id.toString(), // Mã đơn hàng
            vnp_OrderInfo: `Thanh toán đơn hàng ${newOrder._id}`,
            vnp_OrderType: "billpayment",
            vnp_Amount: req.body.total * 100, // Số tiền (nhân 100 để chuyển sang đơn vị VNĐ)
            vnp_ReturnUrl: `${frontend_url}/verify`, // URL callback sau khi thanh toán
            vnp_IpAddr: '127.0.0.1', // Luôn dùng IPv4 khi test local
            vnp_CreateDate: new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14), // Định dạng yyyyMMddHHmmss
        };

        // Sắp xếp tham số và tạo chữ ký (signature)
        const sortedParamsObj = Object.keys(vnp_Params).sort().reduce((acc, key) => {
            acc[key] = vnp_Params[key];
            return acc;
        }, {});
        const signData = qs.stringify(sortedParamsObj, { encode: false });
        console.log('VNPay signData:', signData); // Log chuỗi ký để debug
        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const secureHash = hmac.update(signData).digest("hex");
        console.log('VNPay secureHash:', secureHash); // Log chữ ký để debug
        vnp_Params.vnp_SecureHash = secureHash;

        // Tạo URL thanh toán
        const paymentUrl = `${vnp_Url}?${qs.stringify(vnp_Params, { encode: false })}`;
        console.log("VNPay Payment URL:", paymentUrl);

        res.status(200).json({
            success: true,
            paymentUrl: paymentUrl,
        });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({
            success: false,
            message: "Error placing order",
        });
    }
};

export const vnpayReturn = (req, res) => {
    const frontend_url = "http://localhost:5173"; // Đảm bảo biến này có trong scope
    const vnp_Params = req.query;

    // Lấy chữ ký từ VNPay
    const secureHash = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    // SẮP XẾP THAM SỐ THEO THỨ TỰ A-Z TRƯỚC KHI KÝ LẠI
    const sortedParamsObj = Object.keys(vnp_Params).sort().reduce((acc, key) => {
        acc[key] = vnp_Params[key];
        return acc;
    }, {});
    const signData = qs.stringify(sortedParamsObj, { encode: false });
    const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
    const checkHash = hmac.update(signData).digest("hex");

    if (secureHash === checkHash) {
        // Chữ ký hợp lệ
        if (vnp_Params.vnp_ResponseCode === "00") {
            // Thanh toán thành công
            console.log("Payment success:", vnp_Params);
            res.redirect(`${frontend_url}/success`);
        } else {
            // Thanh toán thất bại
            console.log("Payment failed:", vnp_Params);
            res.redirect(`${frontend_url}/failed`);
        }
    } else {
        // Chữ ký không hợp lệ
        console.log("Invalid signature:", vnp_Params);
        res.status(400).send("Invalid signature");
    }
};


const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body; // Đổi tên cho rõ ràng
    try {
        if (success === "true") {
            const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true });
            if (updatedOrder) {
                return res.json({ success: true, message: "Paid" });
            } else {
                return res.status(404).json({ success: false, message: "Order not found" });
            }
        } else {
            // Không cần update gì nếu chưa thanh toán, chỉ trả về thông báo
            return res.json({ success: false, message: "Not paid" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error" });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

export { placeOrder, verifyOrder, getUserOrders };