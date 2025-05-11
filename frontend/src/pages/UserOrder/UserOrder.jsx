import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./UserOrder.css";
import { StoreContext } from "../../context/StoreContext";

const UserOrder = () => {
    const { url, token } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${url}/api/order/userorder`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setOrders(res.data.orders || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [url, token]);

    if (loading) return <div className="userorder-loading">Đang tải đơn hàng...</div>;
    if (!orders.length) return <div className="userorder-empty">Bạn chưa có đơn hàng nào.</div>;

    return (
        <div className="userorder-container">
            <h2>Lịch sử đơn hàng</h2>
            <div className="userorder-list">
                {orders.map(order => (
                    <div className="userorder-item" key={order._id}>
                        <div className="userorder-row">
                            <span className="userorder-label">Mã đơn:</span> <span>{order._id}</span>
                        </div>
                        <div className="userorder-row">
                            <span className="userorder-label">Ngày đặt:</span> <span>{new Date(order.date).toLocaleString()}</span>
                        </div>
                        <div className="userorder-row">
                            <span className="userorder-label">Trạng thái:</span> <span className={order.payment ? "paid" : "unpaid"}>{order.payment ? "Đã thanh toán" : "Chưa thanh toán"}</span>
                        </div>
                        <div className="userorder-row">
                            <span className="userorder-label">Sản phẩm:</span>
                            <ul className="userorder-products">
                                {order.items.map((item, idx) => (
                                    <li key={idx}>{item.name} x {item.quantity}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="userorder-row">
                            <span className="userorder-label">Tổng tiền:</span> <span className="userorder-amount">{order.amount.toLocaleString()}đ</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserOrder; 