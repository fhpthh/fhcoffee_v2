import React from 'react'
import Navbar from './components/navbar/navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import './App.css'
import Verify from './pages/Verify/Verify'
import UserOrder from './pages/UserOrder/UserOrder'

// Component đơn giản cho trang thanh toán thành công
const PaymentSuccess = () => {
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
  return (
    <div className="payment-result failed">
      <h1>Thanh toán thất bại!</h1>
      <p>Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.</p>
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
