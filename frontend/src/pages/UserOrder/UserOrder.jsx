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
            const res = await axios.get(`${url}/api/order/userorder?page=${page}&limit=10&sort=-date`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders((res.data.orders || []).sort((a, b) => new Date(b.date) - new Date(a.date)));

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
        }
    };

    useEffect(() => {
        // Fetch orders khi component mount hoặc location thay đổi
        fetchOrders(1);
    }, [url, token, location.pathname]);

    // Tạo các nút phân trang kiểu đơn giản
    const renderSimplePagination = () => {
        const { currentPage, totalPages } = pagination;

        if (totalPages <= 1) return null;

        return (
            <div className="simple-pagination">
                {/* Nút Previous */}
                <a
                    href="#"
                    className="nav-button"
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    style={{ visibility: currentPage === 1 ? 'hidden' : 'visible' }}
                >
                    &lt;
                </a>

                {/* Các nút số trang */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Tính toán số trang hiển thị
                    let pageNum;

                    if (totalPages <= 5) {
                        // Nếu tổng số trang ≤ 5, hiển thị tất cả
                        pageNum = i + 1;
                    } else if (currentPage <= 3) {
                        // Nếu đang ở gần đầu, hiển thị 1-5
                        pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                        // Nếu đang ở gần cuối, hiển thị 5 trang cuối
                        pageNum = totalPages - 4 + i;
                    } else {
                        // Hiển thị 2 trang trước và 2 trang sau trang hiện tại
                        pageNum = currentPage - 2 + i;
                    }

                    return (
                        <a
                            key={pageNum}
                            href="#"
                            className={pageNum === currentPage ? 'active' : ''}
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNum);
                            }}
                        >
                            {pageNum}
                        </a>
                    );
                })}

                {/* Nút Next */}
                <a
                    href="#"
                    className="nav-button"
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    style={{ visibility: currentPage === totalPages ? 'hidden' : 'visible' }}
                >
                    &gt;
                </a>
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
                                    <td>{order._id}</td>
                                    <td>{new Date(order.date).toLocaleString()}</td>
                                    <td className={order.payment ? "paid" : "unpaid"}>
                                        {order.payment ? "Đã thanh toán" : "Chưa thanh toán"}
                                    </td>
                                    <td className={`order-status ${order.status?.toLowerCase()}`}>
                                        {order.status === "Processing" && "Đang xử lý"}
                                        {order.status === "Shipped" && "Đã giao hàng"}
                                        {order.status === "Delivered" && "Đã giao"}
                                        {order.status === "Canceled" && "Đã hủy"}
                                        {order.status === "paid" && "Đã thanh toán"}
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

                {/* Hiển thị phân trang kiểu đơn giản */}
                {renderSimplePagination()}
            </div>
        </div>
    );
};

export default UserOrder;