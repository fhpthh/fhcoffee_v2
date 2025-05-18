import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Food from "../models/foodModel.js";

// Controller xử lý thống kê
export const getStatistics = async (req, res) => {
    try {
        // 1. Thống kê người dùng
        const totalUsers = await User.countDocuments();

        // 2. Thống kê đơn hàng
        const totalOrders = await Order.countDocuments();
        const orders = await Order.find();

        // 3. Thống kê doanh thu
        const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

        // 4. Thống kê hình thức thanh toán
        const paymentStats = {
            paid: orders.filter(order => order.payment).length,
            cod: orders.filter(order => !order.payment).length
        };

        // 5. Thống kê trạng thái đơn hàng
        const orderStatusStats = orders.reduce((stats, order) => {
            const status = order.status || "Unknown";
            stats[status] = (stats[status] || 0) + 1;
            return stats;
        }, {});

        // 6. Thống kê doanh số sản phẩm
        const productSalesMap = {};

        // Lặp qua từng đơn hàng
        for (const order of orders) {
            // Lặp qua từng sản phẩm trong đơn hàng
            for (const item of order.items) {
                const productId = item.productId || item._id;
                if (!productSalesMap[productId]) {
                    productSalesMap[productId] = {
                        quantity: 0,
                        revenue: 0,
                        name: item.name
                    };
                }
                productSalesMap[productId].quantity += item.quantity;
                productSalesMap[productId].revenue += item.price * item.quantity;
            }
        }

        // Chuyển đổi map thành mảng để dễ sử dụng
        const productSales = Object.keys(productSalesMap).map(key => ({
            productId: key,
            name: productSalesMap[key].name,
            quantity: productSalesMap[key].quantity,
            revenue: productSalesMap[key].revenue
        }));

        // 7. Thống kê doanh thu theo thời gian (tháng)
        const revenueByMonth = orders.reduce((stats, order) => {
            const date = new Date(order.date);
            const monthYearKey = `${date.getMonth() + 1}/${date.getFullYear()}`;

            if (!stats[monthYearKey]) {
                stats[monthYearKey] = {
                    month: date.getMonth() + 1,
                    year: date.getFullYear(),
                    revenue: 0,
                    orders: 0
                };
            }

            stats[monthYearKey].revenue += order.amount || 0;
            stats[monthYearKey].orders += 1;

            return stats;
        }, {});

        // Chuyển đổi thành mảng và sắp xếp theo thời gian
        const revenueByMonthArray = Object.values(revenueByMonth).sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.month - b.month;
        });

        res.json({
            success: true,
            statistics: {
                users: {
                    total: totalUsers
                },
                orders: {
                    total: totalOrders,
                    byStatus: orderStatusStats
                },
                revenue: {
                    total: totalRevenue,
                    byMonth: revenueByMonthArray
                },
                payments: paymentStats,
                productSales: productSales
            }
        });
    } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy thống kê",
            error: error.message
        });
    }
}; 