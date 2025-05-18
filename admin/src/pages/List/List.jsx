import React, { useState } from 'react'
import './List.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  const fetchList = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/food/list?page=${page}&limit=${pagination.limit}`);

      if (response.data.success) {
        setList(response.data.data || []);

        // Cập nhật thông tin phân trang nếu có
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        } else {
          // Nếu API chưa hỗ trợ phân trang, tính toán tại client
          const totalItems = response.data.data.length;
          const totalPages = Math.ceil(totalItems / pagination.limit);
          setPagination({
            ...pagination,
            currentPage: page,
            totalPages,
            totalItems
          });
        }
      } else {
        toast.error("Không thể tải danh sách sản phẩm");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải danh sách sản phẩm");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const removeFood = async (foodId) => {
    try {
      const response = await axios.delete(`${url}/api/food/remove`, { data: { id: foodId } });

      if (response.data.success) {
        toast.success("Đã xóa sản phẩm thành công");
        // Sau khi xóa, tải lại danh sách trang hiện tại
        fetchList(pagination.currentPage);
      } else {
        toast.error("Không thể xóa sản phẩm");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa sản phẩm");
      console.error(error);
    }
  }

  // Xử lý thay đổi trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchList(newPage);
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

  useEffect(() => {
    fetchList(1);
  }, [url]);

  return (
    <div className='list add flex-col'>
      <p>Danh sách sản phẩm</p>
      <div className="list-table">
        <div className='table-format-title'>
          <b>Ảnh</b>
          <b>Tên</b>
          <b>Phân loại</b>
          <b>Giá</b>
          <b>Hành động</b>
        </div>

        {loading ? (
          <div className="loading-message">Đang tải dữ liệu...</div>
        ) : list.length === 0 ? (
          <div className="empty-message">Không có sản phẩm nào</div>
        ) : (
          list.map((item, index) => (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price.toLocaleString() + 'đ'}</p>
              <p onClick={() => removeFood((item._id))} className="remove-button">X</p>
            </div>
          ))
        )}
      </div>

      {/* Hiển thị phân trang */}
      {renderPagination()}
    </div>
  )
}

export default List
