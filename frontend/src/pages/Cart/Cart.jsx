import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext';

const Cart = () => {
  const { cartItem, food_list, removeFromCart, getTotalCartAmout } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items-container">
        <div className="cart-items">
          <div className="cart-items-title">
            <p>Sản phẩm</p>
            <p>Sản phẩm</p>
            <p>Giá tiền</p>
            <p>Số lượng</p>
            <p>Tổng tiền</p>
            <p>Xóa</p>
          </div>
          <hr />
          {food_list.map((item) => {
            if (cartItem[item._id] > 0) {
              return (
                <div key={item._id}>
                  <div className="cart-items-item">
                    <img src={item.image} alt="" />
                    <p>{item.name}</p>
                    <p>{item.price.toLocaleString() + 'đ'}</p>
                    <p>{cartItem[item._id]}</p>
                    <p>{(item.price * cartItem[item._id]).toLocaleString() + 'đ'}</p>
                    <p onClick={() => removeFromCart(item._id)} className='crossicon'>x</p>
                  </div>
                  <hr />
                </div>
              )
            }
            return null;
          })}
        </div>
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <div>
            <h2>Đơn hàng</h2>
            <div className="cart-total-details">
              <p>Tạm tính</p>
              <p>{getTotalCartAmout().toLocaleString() + 'đ'}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí vận chuyển</p>
              <p>{(getTotalCartAmout() === 0 ? 0 : 20000).toLocaleString() + 'đ'}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Tổng</p>
              <b>{(getTotalCartAmout() === 0 ? 0 : getTotalCartAmout() + 20000).toLocaleString() + 'đ'}</b>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>Thanh toán</button>
        </div>
        <div className="cart-promocode">
          <div>Mã giảm giá </div>
          <div className="cart-promocode-input">
            <input type="text" placeholder='nhập mã' />
            <button>Áp mã</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
