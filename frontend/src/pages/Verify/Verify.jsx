import React, { useEffect, useState } from 'react'
import "./Verify.css"
import { useSearchParams } from 'react-router-dom'
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const [status, setStatus] = useState("loading"); // loading, success, fail

  useEffect(() => {
    if (!orderId) {
      setStatus("fail");
      return;
    }
    axios.post(`${url}/api/order/verify`, {
      orderId,
      success
    })
      .then(res => {
        if (res.data.success) setStatus("success");
        else setStatus("fail");
      })
      .catch(() => setStatus("fail"));
  }, [orderId, success, url]);

  if (status === "loading") {
    return (
      <div className='verify'>
        <div className="spinner"></div>
        <p>Đang xác nhận thanh toán...</p>
      </div>
    );
  }
  if (status === "success") {
    return (
      <div className='verify'>
        <h2>Thanh toán thành công!</h2>
      </div>
    );
  }
  return (
    <div className='verify'>
      <h2>Thanh toán thất bại!</h2>
    </div>
  );
}

export default Verify
