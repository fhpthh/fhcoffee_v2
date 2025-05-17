import React, { useEffect, useContext, useState } from 'react'
import Navbar from './components/navbar/navbar'
import { Routes, Route, useSearchParams, useNavigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import './App.css'
import Verify from './pages/Verify/Verify'
import UserOrder from './pages/UserOrder/UserOrder'
import { StoreContext } from './context/StoreContext'
import axios from 'axios'

// Component đơn giản cho trang thanh toán thành công
const PaymentSuccess = () => {
  const { clearCart, url, token } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processSuccess = async () => {
      try {
        // 1. Xóa giỏ hàng
        await clearCart();

        // 2. Nếu không có orderId, vẫn hiển thị thành công nhưng báo lỗi
        if (!orderId) {
          console.error("No orderId in URL params");
          setLoading(false);
          return;
        }

        // 3. Đảm bảo đơn hàng được cập nhật đúng
        if (token) {
          try {
            // Gọi API để đảm bảo đơn hàng đã được cập nhật đúng
            await axios.post(`${url}/api/order/verify`,
              { orderId, success: "true" },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (err) {
            console.error("Error verifying order:", err);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error in processing payment success:", error);
        setLoading(false);
      }
    };

    processSuccess();
  }, [clearCart, orderId, navigate, token, url]);

  if (loading) {
    return <div className="payment-result loading">Đang xử lý đơn hàng...</div>;
  }

  return (
    <div className="payment-result success">
      <h1>Thanh toán thành công!</h1>
      <p>Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.</p>
      <a href="/myorders">Xem đơn hàng của bạn</a>
    </div>
  );
};

// Component đơn giản cho trang thanh toán thất bại
const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('code') || searchParams.get('error') || 'unknown';

  return (
    <div className="payment-result failed">
      <h1>Thanh toán thất bại!</h1>
      <p>Có lỗi xảy ra trong quá trình thanh toán: {errorCode}</p>
      <a href="/cart">Quay lại giỏ hàng</a>
    </div>
  );
};

const App = () => {
  const [showLogin, setShowLogin] = React.useState(false);
  return (
    <div className="app-container">
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : null}
      <Navbar setShowLogin={setShowLogin} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />}> </Route>
          <Route path='/myorders' element={<UserOrder />} />
          <Route path='/success' element={<PaymentSuccess />} />
          <Route path='/failed' element={<PaymentFailed />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
