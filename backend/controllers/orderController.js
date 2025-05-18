import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import qs from "qs";
import crypto from "crypto";
import { log } from "console";
import { type } from "os";

const frontend_url = "http://localhost:5173"; // URL frontend của bạn

// Định nghĩa các hằng số cần thiết cho VNPay
const ProductCode = {
    Other: 'other'
};

const VnpLocale = {
    VN: 'vn'
};

// Hàm format ngày tháng cho VNPay (không dùng dayjs)
const dateFormat = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// Hàm lấy ngày mai (không dùng dayjs)
const getTomorrow = () => {
    const today = new Date();
    const tomorrow = new Date(today); // Tạo bản sao để không ảnh hưởng đến today
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
};

// Hàm logger trống cho VNPay (có thể tùy chỉnh)
const ignoreLogger = (...args) => {
    // Nếu bạn muốn ghi log, hãy thay đổi ở đây.  Ví dụ:
    // console.log(...args);
};

// Thông tin cấu hình VNPay (nên đưa vào biến môi trường hoặc file cấu hình)
const vnp_TmnCode = "ERVNE8KV";
const vnp_SecureSecret = "YBWICHB0TI57N1JHGP5C5EKZJYXJLDAM";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // URL thanh toán VNPay
const vnp_ReturnUrl = "http://localhost:4000/api/order/check-payment-vnpay";

/**
 * Hàm tạo URL thanh toán VNPay (tương ứng với hàm createPaymentUrl trong Spring Boot)
 * @param {string} orderId - Mã đơn hàng
 * @param {number} amount - Số tiền thanh toán
 * @param {string} orderInfo - Thông tin đơn hàng
 * @param {string} ipAddress - Địa chỉ IP của người dùng
 * @returns {string} - URL thanh toán VNPay đã được mã hóa và ký
 */
const createPaymentUrl = (orderId, amount, orderInfo, ipAddress) => {
    console.log("Creating VNPAY URL for order:", orderId, "with amount:", amount);
    const vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = vnp_TmnCode;
    vnp_Params["vnp_Amount"] = String(amount * 100); // Nhân 100 vì VNPay tính bằng 100 đồng
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = String(orderId); // Quan trọng: Đây là mã để xác định đơn hàng khi VNPAY gọi lại
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_OrderType"] = ProductCode.Other;
    vnp_Params["vnp_ReturnUrl"] = vnp_ReturnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddress;
    vnp_Params["vnp_CreateDate"] = dateFormat(new Date()); // Sử dụng hàm tự viết
    const tomorrow = getTomorrow(); // Sử dụng hàm tự viết
    vnp_Params["vnp_ExpireDate"] = dateFormat(tomorrow);

    console.log("VNPAY params:", vnp_Params);

    // Sắp xếp các tham số theo thứ tự tăng dần
    const fieldNames = Object.keys(vnp_Params);
    fieldNames.sort();

    // Tạo chuỗi truy vấn và chuỗi băm
    let query = "";
    let hashData = "";
    for (let i = 0; i < fieldNames.length; i++) {
        const fieldName = fieldNames[i];
        const fieldValue = vnp_Params[fieldName];
        if (fieldValue !== null && fieldValue !== "") {
            // Tạo chuỗi băm
            hashData += fieldName + "=" + encodeURIComponent(fieldValue);
            // Tạo chuỗi truy vấn
            query += encodeURIComponent(fieldName) + "=" + encodeURIComponent(fieldValue);
            if (i < fieldNames.length - 1) {
                query += "&";
                hashData += "&";
            }
        }
    }

    // Tạo chữ ký điện tử
    const vnp_SecureHash = crypto
        .createHmac("SHA512", vnp_SecureSecret)
        .update(hashData)
        .digest("hex");

    const vnpayUrl = vnp_Url + "?" + query + "&vnp_SecureHash=" + vnp_SecureHash;
    console.log("Generated VNPAY URL:", vnpayUrl);
    return vnpayUrl;
};

// Đặt đơn hàng
const placeOrder = async (req, res) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        const { fullName, phone, address, orderItems, total, paymentMethod = "vnpay" } = req.body;

        if (!fullName || !phone || !address || !orderItems || !total) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Parse orderItems nếu được gửi dưới dạng string (từ form POST)
        let parsedOrderItems = orderItems;
        if (typeof orderItems === 'string') {
            try {
                parsedOrderItems = JSON.parse(orderItems);
            } catch (err) {
                return res.status(400).json({ success: false, message: "Invalid orderItems format" });
            }
        }

        const shippingFee = 20000;
        const totalAmount = parseFloat(total) + shippingFee;

        const newOrder = new orderModel({
            userId: req.user._id,
            items: parsedOrderItems,
            amount: totalAmount,
            address: {
                fullName: req.body.fullName,
                phone: req.body.phone,
                address: req.body.address
            },
            status: "pending", // Trạng thái mặc định là chờ thanh toán
            createdAt: new Date(),
        });

        await newOrder.save();
        console.log("Order saved:", newOrder);

        // thanh toan cod
        if (paymentMethod === "cod") {
            return res.status(200).json({ success: true, message: "Đặt hàng thành công (COD)" });
        }

        if (paymentMethod === "vnpay") {
            const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
            const vnpayUrl = createPaymentUrl(newOrder._id, totalAmount, String(newOrder._id), ipAddress);

            // Trả về URL để frontend xử lý redirect
            return res.status(200).json({
                success: true,
                vnpayUrl,
                message: "Đặt hàng thành công, chuyển hướng đến trang thanh toán VNPAY"
            });
        }
    } catch (error) {
        console.error(" Error placing order:", error);
        res.status(500).json({
            success: false,
            message: "Error placing order",
            error: error.message
        });
    }
};

// Tìm đơn hàng thông qua checkPaymentVnpay
const checkPaymentVnpay = async (req, res) => {
    try {
        // Log tất cả các thông tin nhận được từ VNPAY để debug
        console.log("VNPAY Callback Data:", req.query);

        // Trích xuất các tham số từ VNPAY
        const { vnp_ResponseCode, vnp_TxnRef, vnp_OrderInfo, vnp_SecureHash, ...vnpParams } = req.query;

        console.log("Response Code:", vnp_ResponseCode);
        console.log("Order ID from TxnRef:", vnp_TxnRef);
        console.log("Order Info:", vnp_OrderInfo);

        // Bước 1: Lấy danh sách tham số trả về từ VNPay
        let inputData = Object.keys(vnpParams).reduce((acc, key) => {
            if (key.startsWith("vnp_")) {
                acc[key] = vnpParams[key];
            }
            return acc;
        }, {});

        // Log để debug
        console.log("Input Data after filtering:", inputData);

        // Bước 2: Sắp xếp các tham số
        let sortedParams = Object.keys(inputData)
            .sort()
            .reduce((obj, key) => {
                obj[key] = inputData[key];
                return obj;
            }, {});

        console.log("Sorted Params:", sortedParams);

        // Bước 3: Tạo chuỗi truy vấn từ các tham số đã sắp xếp
        const query = qs.stringify(sortedParams, { encode: false });
        console.log("Query string:", query);

        // Lấy orderId từ vnp_TxnRef hoặc vnp_OrderInfo
        const orderId = vnp_TxnRef || (vnp_OrderInfo ? vnp_OrderInfo.split(' ').pop() : null);
        console.log("Using Order ID:", orderId);

        // Bước 4: Tạo mã băm từ chuỗi truy vấn và secretKey
        const expectedHash = crypto
            .createHmac("SHA512", vnp_SecureSecret)
            .update(query)
            .digest("hex");

        console.log("Expected hash:", expectedHash);
        console.log("Received hash:", vnp_SecureHash);

        // Kiểm tra kết quả giao dịch
        console.log("Checking response code:", vnp_ResponseCode);
        if (vnp_ResponseCode === "00") {
            // Giao dịch thành công
            console.log("Transaction successful, finding order:", orderId);

            // Tìm đơn hàng theo nhiều cách
            let findOrder = null;

            if (orderId) {
                try {
                    // Tìm theo ID trực tiếp
                    findOrder = await orderModel.findById(orderId);
                    console.log("Order found by ID:", findOrder ? findOrder._id : "not found");
                } catch (err) {
                    console.log("Error finding by ID:", err.message);
                }
            }

            // Nếu không tìm thấy bằng ID, thử tìm trong OrderInfo
            if (!findOrder && vnp_OrderInfo) {
                const possibleId = vnp_OrderInfo.split(' ').pop();
                try {
                    findOrder = await orderModel.findById(possibleId);
                    console.log("Order found by OrderInfo extract:", findOrder ? findOrder._id : "not found");
                } catch (err) {
                    console.log("Error finding by OrderInfo extract:", err.message);
                }
            }

            // Nếu vẫn không tìm thấy, lấy đơn hàng gần nhất
            if (!findOrder) {
                // Lấy đơn hàng gần nhất có status = 'pending'
                findOrder = await orderModel.findOne({ status: 'pending' }).sort({ createdAt: -1 });
                console.log("Falling back to most recent pending order:", findOrder ? findOrder._id : "not found");
            }

            if (!findOrder) {
                console.error("Order not found by any method");
                return res.redirect(`${frontend_url}/failed?error=order_not_found`);
            }

            console.log("Order found, updating status for order:", findOrder._id);

            // Cập nhật trạng thái đơn hàng thành công
            try {
                findOrder.status = 'paid';
                findOrder.payment = true;
                await findOrder.save();
                console.log("Order status updated successfully:", findOrder._id);
            } catch (updateError) {
                console.error("Error updating order status:", updateError);
                return res.redirect(`${frontend_url}/failed?error=update_failed`);
            }

            // Cố gắng tìm và xóa giỏ hàng của người dùng
            try {
                if (findOrder.userId) {
                    const user = await userModel.findById(findOrder.userId);
                    if (user) {
                        user.cartData = {};
                        await user.save();
                        console.log("User cart cleared successfully for user:", findOrder.userId);
                    } else {
                        console.log("User not found for ID:", findOrder.userId);
                    }
                } else {
                    console.log("No userId associated with order");
                }
            } catch (cartError) {
                console.error("Error clearing user cart:", cartError);
                // Vẫn tiếp tục xử lý mặc dù có lỗi khi xóa giỏ hàng
            }

            console.log("Order updated successfully, redirecting to success page");
            return res.redirect(`${frontend_url}/success?orderId=${findOrder._id}`);
        } else {
            // Giao dịch thất bại
            console.error("Transaction failed with code:", vnp_ResponseCode);
            return res.redirect(`${frontend_url}/failed?code=${vnp_ResponseCode}`);
        }
    } catch (err) {
        console.error("Error in checkPaymentVnpay:", err);
        return res.redirect(`${frontend_url}/failed?error=system_error`);
    }
};

// Kiểm tra trạng thái thanh toán của đơn hàng (có vẻ không được dùng trong luồng VNPay callback)
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { payment: true, status: 'paid' }, { new: true });
            if (updatedOrder) {
                return res.json({ success: true, message: "Paid" });
            } else {
                return res.status(404).json({ success: false, message: "Order not found" });
            }
        } else {
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

        // Lấy tham số phân trang từ query params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Đếm tổng số đơn hàng để tính số trang
        const totalOrders = await orderModel.countDocuments({ userId });
        const totalPages = Math.ceil(totalOrders / limit);

        // Lấy đơn hàng theo trang
        const orders = await orderModel.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            orders,
            pagination: {
                currentPage: page,
                totalPages,
                totalOrders,
                limit
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

// Lấy tất cả các đơn hàng (Admin)
const getAllOrders = async (req, res) => {
    try {
        // Lấy tham số phân trang từ query params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Đếm tổng số đơn hàng
        const totalOrders = await orderModel.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);

        // Truy vấn danh sách đơn hàng với phân trang
        const orders = await orderModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            data: orders,
            pagination: {
                totalOrders,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi tải danh sách đơn hàng",
            error: error.message
        });
    }
};

export { placeOrder, verifyOrder, getUserOrders, getAllOrders, checkPaymentVnpay };