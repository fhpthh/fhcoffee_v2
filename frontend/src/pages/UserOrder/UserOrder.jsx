import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./UserOrder.css";
import { StoreContext } from "../../context/StoreContext";

const UserOrder = () => {
    const { url, token } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return; // Đợi token có rồi mới gọi API

        axios.get(`${url}/api/order/userorder`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setOrders(res.data.orders || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy đơn hàng:", err);
                setLoading(false);
            });
    }, [url, token]);

    if (loading) return <div className="userorder-loading">Đang tải đơn hàng...</div>;

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
                        {[...orders].reverse().map(order => (
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserOrder;