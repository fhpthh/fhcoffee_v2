import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./UserOrder.css";
import { StoreContext } from "../../context/StoreContext";

const UserOrder = () => {
    const { url, token } = useContext(StoreContext);
    console.log(url);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return; // Đợi token có rồi mới gọi API

        axios.get(`${url}/api/order/userorders`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                console.log(res.data);
                setOrders(res.data.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy đơn hàng:", err);
                setLoading(false);
            });
    }, [url, token]);

    if (loading) return <div className="userorder-loading">Đang tải đơn hàng...</div>;
    // if (!orders.length) return <div className="userorder-empty">Bạn chưa có đơn hàng nào.</div>;

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
                        {orders.map(order => (
                            <tr key={order._id}>
                                {/* Mã đơn hàng */}
                                <td>{order._id}</td>

                                {/* Ngày đặt */}
                                <td>{new Date(order.date).toLocaleString()}</td>

                                {/* Trạng thái thanh toán */}
                                <td className={order.payment ? "paid" : "unpaid"}>
                                    {order.payment ? "Đã thanh toán" : "Chưa thanh toán"}
                                </td>

                                {/* Trạng thái đơn hàng */}
                                <td className={`order-status ${order.status.toLowerCase()}`}>
                                    {order.status === "Processing" && "Đang xử lý"}
                                    {order.status === "Shipped" && "Đã giao hàng"}
                                    {order.status === "Delivered" && "Đã giao"}
                                    {order.status === "Canceled" && "Đã hủy"}
                                </td>

                                {/* Danh sách sản phẩm */}
                                <td>
                                    <ul className="userorder-products">
                                        {order.items.map((item, idx) => (
                                            <li key={idx}>{item.name} x {item.quantity}</li>
                                        ))}
                                    </ul>
                                </td>

                                {/* Tổng tiền */}
                                <td className="userorder-amount">
                                    {order.amount.toLocaleString()}đ
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

};

export default UserOrder; 