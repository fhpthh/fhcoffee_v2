import React, { useState, useEffect } from 'react';
import './Order.css';
import { toast } from "react-toastify";
import axios from "axios";

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 10
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/order/list?limit=100`);
      if (response.data.success) {
        // Đảm bảo đơn hàng được sắp xếp theo thời gian mới nhất
        const sortedOrders = response.data.data ? [...response.data.data].sort((a, b) => {
          return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
        }) : [];

        setAllOrders(sortedOrders);

        // Tính toán thông tin phân trang
        const totalItems = sortedOrders.length;
        const totalPages = Math.ceil(totalItems / 10);

        setPagination({
          currentPage: 1,
          totalPages,
          totalOrders: totalItems,
          limit: 10
        });

        // Hiển thị trang đầu tiên
        displayPage(1, sortedOrders);
      } else {
        toast.error("Không thể tải danh sách đơn hàng.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Đã xảy ra lỗi khi tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị theo trang từ danh sách đã lấy
  const displayPage = (page, ordersList = allOrders) => {
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    setOrders(ordersList.slice(startIndex, endIndex));
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleStatusChange = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });

      if (response.data.success) {
        toast.success("Cập nhật trạng thái đơn hàng thành công!");

        // Cập nhật trạng thái trong mảng allOrders
        const updatedAllOrders = allOrders.map(order => {
          if (order._id === orderId) {
            return { ...order, status: event.target.value };
          }
          return order;
        });

        setAllOrders(updatedAllOrders);

        // Cập nhật lại trang hiện tại
        displayPage(pagination.currentPage, updatedAllOrders);
      } else {
        toast.error("Không thể cập nhật trạng thái đơn hàng.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.");
    }
  };

  // Xử lý thay đổi trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      displayPage(newPage);
      // Cuộn lên đầu trang khi chuyển trang
      window.scrollTo(0, 0);
    }
  };

  // Component phân trang
  const renderPagination = () => {
    const { currentPage, totalPages } = pagination;

    if (totalPages <= 1) return null;

    return (
      <div className="admin-pagination">
        {/* Nút Previous */}
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

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
            <button
              key={pageNum}
              className={`pagination-button ${pageNum === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Nút Next */}
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    );
  };

  // Function to shorten order IDs
  const shortenOrderId = (id) => {
    if (!id) return '';
    if (id.length <= 10) return id;
    return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
  };

  // Function to shorten text with ellipsis
  const shortenText = (text, maxLength = 20) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle view order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    fetchAllOrders();
  }, [url]);

  // Render order details modal
  const renderOrderDetailsModal = () => {
    if (!selectedOrder || !showModal) return null;

    return (
      <div className="order-detail-modal-overlay" onClick={closeModal}>
        <div className="order-detail-modal" onClick={e => e.stopPropagation()}>
          <div className="order-detail-header">
            <h3>Chi tiết đơn hàng</h3>
            <button className="close-button" onClick={closeModal}>×</button>
          </div>

          <div className="order-detail-content">
            <div className="order-info-section">
              <h4>Thông tin đơn hàng</h4>
              <p><strong>Mã đơn:</strong> {selectedOrder._id}</p>
              <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.createdAt || selectedOrder.date)}</p>
              <p><strong>Tình trạng thanh toán:</strong>
                <span className={selectedOrder.payment ? "payment-status paid" : "payment-status unpaid"}>
                  {selectedOrder.payment ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </p>
              <p><strong>Tổng tiền:</strong> <span className="order-total">{selectedOrder.amount.toLocaleString()}đ</span></p>
            </div>

            <div className="customer-info-section">
              <h4>Thông tin khách hàng</h4>
              <p><strong>Tên người nhận:</strong> {selectedOrder.address.fullName}</p>
              <p><strong>Số điện thoại:</strong> {selectedOrder.address.phone}</p>
              <p><strong>Địa chỉ:</strong> {selectedOrder.address.address}</p>
            </div>

            <div className="products-info-section">
              <h4>Sản phẩm đặt hàng</h4>
              <table className="order-products-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price?.toLocaleString()}đ</td>
                      <td>{(item.price * item.quantity)?.toLocaleString()}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="status-section">
              <h4>Cập nhật trạng thái</h4>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(e, selectedOrder._id)}
                className={selectedOrder.status === "Canceled" ? "canceled" : selectedOrder.status === "Delivered" ? "delivered" : "processing"}
              >
                <option value="Processing">Đang xử lý</option>
                <option value="Shipped">Đã giao hàng</option>
                <option value="Delivered">Đã giao</option>
                <option value="Canceled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="userorder-container">
      <h2>Quản lý đơn hàng</h2>
      <div className="userorder-table-wrapper">
        <table className="userorder-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Tình trạng</th>
              <th>Xem chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="loading-cell">Đang tải dữ liệu...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-cell">Không có đơn hàng nào</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order._id}>
                  <td className="order-id" title={order._id}>{shortenOrderId(order._id)}</td>
                  <td className="order-date">{formatDate(order.createdAt || order.date)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(e, order._id)}
                      className={order.status === "Canceled" ? "canceled" : order.status === "Delivered" ? "delivered" : "processing"}
                    >
                      <option value="Processing">Đang xử lý</option>
                      <option value="Shipped">Đã giao hàng</option>
                      <option value="Delivered">Đã giao</option>
                      <option value="Canceled">Đã hủy</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="view-details-button"
                      onClick={() => handleViewDetails(order)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Hiển thị phân trang */}
        {renderPagination()}

        {/* Render modal chi tiết đơn hàng */}
        {renderOrderDetailsModal()}
      </div>
    </div>
  );
};

export default Order;