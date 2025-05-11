import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const { clearCart } = useContext(StoreContext);

  useEffect(() => {
    const handlePaymentResult = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const error = searchParams.get('error');
        const orderId = searchParams.get('orderId');
        const code = searchParams.get('code');
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');
        const vnp_BankCode = searchParams.get('vnp_BankCode');
        const vnp_Amount = searchParams.get('vnp_Amount');
        const vnp_OrderInfo = searchParams.get('vnp_OrderInfo');
        const vnp_PayDate = searchParams.get('vnp_PayDate');

        console.log('VNPay Response:', {
          vnp_ResponseCode,
          vnp_TransactionNo,
          vnp_BankCode,
          vnp_Amount,
          vnp_OrderInfo,
          vnp_PayDate
        });

        // Xử lý các trường hợp lỗi
        if (error) {
          switch (error) {
            case 'invalid_signature':
              toast.error('Lỗi xác thực giao dịch. Vui lòng liên hệ hỗ trợ.');
              break;
            case 'order_not_found':
              toast.error('Không tìm thấy đơn hàng.');
              break;
            case 'update_failed':
              toast.error('Lỗi cập nhật trạng thái đơn hàng.');
              break;
            case 'customer_cancelled':
              toast.error('Giao dịch đã bị hủy bởi khách hàng.');
              break;
            case 'invalid_amount':
              toast.error('Số tiền không hợp lệ.');
              break;
            case 'invalid_order':
              toast.error('Mã đơn hàng không hợp lệ.');
              break;
            case 'invalid_payment':
              toast.error('Phương thức thanh toán không hợp lệ.');
              break;
            case 'invalid_customer':
              toast.error('Thông tin khách hàng không hợp lệ.');
              break;
            case 'insufficient_balance':
              toast.error('Tài khoản không đủ số dư.');
              break;
            case 'exceed_daily_limit':
              toast.error('Vượt quá hạn mức giao dịch trong ngày.');
              break;
            case 'bank_maintenance':
              toast.error('Ngân hàng đang bảo trì. Vui lòng thử lại sau.');
              break;
            case 'wrong_password':
              toast.error('Mật khẩu không đúng.');
              break;
            case 'unknown_error':
              toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
              break;
            case 'system_error':
              toast.error('Lỗi hệ thống. Vui lòng liên hệ hỗ trợ.');
              break;
            default:
              toast.error(`Giao dịch thất bại. Mã lỗi: ${code}`);
          }
          // Chuyển hướng về trang đơn hàng sau 3 giây
          setTimeout(() => {
            navigate('/orders');
          }, 3000);
          return;
        }

        // Nếu thanh toán thành công
        if (orderId || vnp_ResponseCode === '00') {
          try {
            // Lấy thông tin đơn hàng
            const response = await axios.get(`/api/orders/${orderId || vnp_OrderInfo.split(' ').pop()}`);
            setOrderDetails({
              ...response.data.order,
              paymentDetails: {
                transactionNo: vnp_TransactionNo,
                bankCode: vnp_BankCode,
                amount: vnp_Amount ? parseInt(vnp_Amount) / 100 : response.data.order.amount,
                paymentDate: vnp_PayDate ? new Date(vnp_PayDate) : new Date(),
                status: 'success'
              }
            });
            toast.success('Thanh toán thành công!');
            clearCart(); // Reset giỏ hàng FE sau khi thanh toán thành công
          } catch (error) {
            console.error('Error fetching order details:', error);
            toast.error('Không thể lấy thông tin đơn hàng.');
          }
        } else if (vnp_ResponseCode) {
          // Xử lý các mã lỗi từ VNPay
          switch (vnp_ResponseCode) {
            case '24':
              toast.error('Giao dịch đã bị hủy bởi khách hàng.');
              break;
            case '10':
              toast.error('Số tiền không hợp lệ.');
              break;
            case '11':
              toast.error('Mã đơn hàng không hợp lệ.');
              break;
            case '12':
              toast.error('Loại tiền tệ không hợp lệ.');
              break;
            case '13':
              toast.error('Thông tin khách hàng không hợp lệ.');
              break;
            case '51':
              toast.error('Tài khoản không đủ số dư.');
              break;
            case '65':
              toast.error('Vượt quá hạn mức giao dịch trong ngày.');
              break;
            case '75':
              toast.error('Ngân hàng đang bảo trì.');
              break;
            case '79':
              toast.error('Mật khẩu không đúng.');
              break;
            default:
              toast.error(`Giao dịch thất bại. Mã lỗi: ${vnp_ResponseCode}`);
          }
          setTimeout(() => {
            navigate('/orders');
          }, 3000);
        }
      } catch (error) {
        console.error('Error processing payment result:', error);
        toast.error('Có lỗi xảy ra khi xử lý kết quả thanh toán.');
      } finally {
        setLoading(false);
      }
    };

    handlePaymentResult();
  }, [location, navigate, clearCart]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {orderDetails ? (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Thanh toán thành công!
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Mã đơn hàng:</h3>
              <p>{orderDetails._id}</p>
            </div>
            <div>
              <h3 className="font-semibold">Số tiền:</h3>
              <p>{orderDetails.amount.toLocaleString('vi-VN')} VNĐ</p>
            </div>
            <div>
              <h3 className="font-semibold">Thông tin thanh toán:</h3>
              <p>Ngân hàng: {orderDetails.paymentDetails?.bankCode}</p>
              <p>Mã giao dịch: {orderDetails.paymentDetails?.transactionNo}</p>
              <p>Thời gian: {new Date(orderDetails.paymentDetails?.paymentDate).toLocaleString('vi-VN')}</p>
            </div>
            <div>
              <h3 className="font-semibold">Địa chỉ giao hàng:</h3>
              <p>Người nhận: {orderDetails.address.fullName}</p>
              <p>Số điện thoại: {orderDetails.address.phone}</p>
              <p>Địa chỉ: {orderDetails.address.address}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => navigate('/orders')}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Xem đơn hàng
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Thanh toán không thành công
          </h2>
          <p className="mb-4">
            Vui lòng kiểm tra lại thông tin và thử lại sau.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/orders')}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Xem đơn hàng
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verify; 