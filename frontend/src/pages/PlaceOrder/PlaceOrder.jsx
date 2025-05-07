import React from 'react'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext.jsx'
import './PlaceOrder.css'
const PlaceOrder = () => {

  const {getTotalCartAmout} = useContext(StoreContext);

  return (
    <form className='place-order' id='place-order'>
      <div className="place-order-left">
        <p className="title">Thông tin giao hàng</p>
        <div className="multi-field">
          <input type="text" placeholder='Họ tên' />
          <input type="text" placeholder='Số điện thoại' />
          <input type="text" placeholder='Địa chỉ' />
        </div>
        
      </div>


      <div className="place-order-right">
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
              <p>{(getTotalCartAmout()===0?0:20000).toLocaleString()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Tổng</p>
              <b>{(getTotalCartAmout()===0?0:getTotalCartAmout()).toLocaleString() + 'đ'}</b>
            </div>
          </div>
          <button>Thanh toán</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
