import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./UserOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useLocation } from "react-router-dom";

const UserOrder = () => {
    const { url, token } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalOrders: 0,
        limit: 10
    });

    const fetchOrders = async (page = 1) => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await axios.get(`${url}/api/order/userorder?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Đảm bảo orders được sắp xếp theo thời gian mới nhất
            const sortedOrders = res.data.orders.sort((a, b) => {
                const dateA = new Date(a.date || a.createdAt);
                const dateB = new Date(b.date || b.createdAt);
                return dateB - dateA;
            });

            setOrders(sortedOrders);

            // Cập nhật thông tin phân trang
            if (res.data.pagination) {
                setPagination(res.data.pagination);
            }
        } catch (err) {
            console.error("Lỗi lấy đơn hàng:", err);
        } finally {
            setLoading(false);
        }
    };

    // Hàm thay đổi trang
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchOrders(newPage);
            // Cuộn lên đầu trang khi chuyển trang
            window.scrollTo(0, 0);
        }
    };

    // Hàm kiểm tra đơn hàng mới
    const checkNewOrders = async () => {
        try {
            const res = await axios.get(`${url}/api/order/userorder?page=1&limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.orders && res.data.orders.length > 0) {
                const latestOrder = res.data.orders[0];
                const latestOrderDate = new Date(latestOrder.date || latestOrder.createdAt);

                // Nếu có đơn hàng mới hơn đơn hàng đầu tiên hiện tại
                if (orders.length > 0) {
                    const currentLatestDate = new Date(orders[0].date || orders[0].createdAt);
                    if (latestOrderDate > currentLatestDate) {
                        // Tự động chuyển về trang 1 và cập nhật
                        fetchOrders(1);
                    }
                }
            }
        } catch (err) {
            console.error("Lỗi kiểm tra đơn hàng mới:", err);
        }
    };

    useEffect(() => {
        // Fetch orders khi component mount hoặc location thay đổi
        fetchOrders(1);

        // Thiết lập interval để kiểm tra đơn hàng mới mỗi 10 giây
        const intervalId = setInterval(checkNewOrders, 10000);

        // Cleanup interval khi component unmount
        return () => clearInterval(intervalId);
    }, [url, token, location.pathname]);

    // Tạo các nút phân trang
    const renderPagination = () => {
        const { currentPage, totalPages } = pagination;

        if (totalPages <= 1) return null;

        return (
            <div className="simple-pagination">
                {/* Nút Previous */}
                <button
                    className="nav-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>

                {/* Các nút số trang */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                        pageNum = i + 1;
                    } else if (currentPage <= 3) {
                        pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                    } else {
                        pageNum = currentPage - 2 + i;
                    }

                    return (
                        <button
                            key={pageNum}
                            className={pageNum === currentPage ? 'active' : ''}
                            onClick={() => handlePageChange(pageNum)}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                {/* Nút Next */}
                <button
                    className="nav-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        );
    };

    if (loading && pagination.currentPage === 1) return <div className="userorder-loading">Đang tải đơn hàng...</div>;

    return (
        <div className="userorder-container">
            <h2>Lịch sử đơn hàng</h2>
            <div className="userorder-table-wrapper">
                <table className="userorder-table">
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Ngày đặt</th>
                            <th>Thanh toán</th>
                            <th>Trạng thái</th>
                            <th>Sản phẩm</th>
                            <th>Tổng tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="loading-row">Đang tải...</td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-row">Không có đơn hàng nào</td>
                            </tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order._id}>
                                    <td className="order-id">{order._id}</td>
                                    <td className="order-date">
                                        {new Date(order.date || order.createdAt).toLocaleString('vi-VN', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className={order.payment ? "paid" : "unpaid"}>
                                        {order.payment ? "Đã thanh toán" : "Chưa thanh toán"}
                                    </td>
                                    <td className={`order-status ${order.status?.toLowerCase()}`}>
                                        {order.status === "pending" && "Chờ xử lý"}
                                        {order.status === "processing" && "Đang xử lý"}
                                        {order.status === "shipped" && "Đã giao hàng"}
                                        {order.status === "delivered" && "Đã giao"}
                                        {order.status === "canceled" && "Đã hủy"}
                                        {order.payment === "paid" && "Chờ xử lý"}
                                    </td>
                                    <td>
                                        <ul className="userorder-products">
                                            {order.items.map((item, idx) => (
                                                <li key={idx}>{item.name} x {item.quantity}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="userorder-amount">
                                        {order.amount.toLocaleString()}đ
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Hiển thị phân trang */}
                {renderPagination()}
            </div>
        </div>
    );
};

export default UserOrder;