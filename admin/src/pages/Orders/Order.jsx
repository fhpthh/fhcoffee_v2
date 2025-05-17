import React, { useState, useEffect } from 'react';
import './Order.css';
import { toast } from "react-toastify";
import axios from "axios";

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error("Không thể tải danh sách đơn hàng.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Đã xảy ra lỗi khi tải danh sách đơn hàng.");
    }
  };

  const handleStatusChange = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });

      if (response.data.success) {
        toast.success("Cập nhật trạng thái đơn hàng thành công!");
        await fetchAllOrders();
      } else {
        toast.error("Không thể cập nhật trạng thái đơn hàng.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="userorder-container">
      <h2>Quản lý đơn hàng</h2>
      <div className="userorder-table-wrapper">
        <table className="userorder-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Người nhận</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.address.fullName}</td>
                <td>{order.address.phone}</td>
                <td>{order.address.address}</td>
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
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(e, order._id)}
                    className={order.status === "Canceled" ? "canceled" : "processing"}
                  >
                    <option value="Processing">Đang xử lý</option>
                    <option value="Shipped">Đã giao hàng</option>
                    <option value="Delivered">Đã giao</option>
                    <option value="Canceled">Đã hủy</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;