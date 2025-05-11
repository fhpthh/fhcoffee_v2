import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import axios from "axios";
import "./PlaceOrder.css";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
    const { getTotalCartAmout, token, food_list, cartItem, url, clearCart } = useContext(StoreContext);
    const navigate = useNavigate();

    const [data, setData] = useState({
        fullName: "",
        phone: "",
        address: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("vnpay");

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((prevData) => ({ ...prevData, [name]: value }));
        console.log("Updated data:", { ...data, [name]: value });
    };

    const placeOrder = async (event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItem[item._id] && cartItem[item._id] > 0) {
                let itemInfo = { ...item, quantity: cartItem[item._id] };
                orderItems.push(itemInfo);
            }
        });

        console.log("Order Items:", orderItems);
        console.log("Shipping Info:", data);

        try {
            const response = await axios.post(`${url}/api/order/place`, {
                fullName: data.fullName,
                phone: data.phone,
                address: data.address,
                orderItems: orderItems,
                total: getTotalCartAmout(),
                paymentMethod
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Order placed successfully:", response.data);
            if (paymentMethod === "vnpay" && response.data.success && response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            } else if (paymentMethod === "cod" && response.data.success) {
                alert("Đặt hàng thành công! Vui lòng thanh toán khi nhận hàng.");
                clearCart();
                navigate("/myorders");
            }
        } catch (error) {
            console.error("Error placing order:", error.response?.data || error.message);
        }
    };

    const totalAmount = getTotalCartAmout();
    
    useEffect(() => {
        if (!token) {
            navigate('/cart')
        }
        else if(getTotalCartAmout()===0) {
            navigate('/cart')
        }
    }, [url, token]);

    return (
        <form onSubmit={placeOrder} className="place-order" id="place-order">
            <div className="place-order-left">
                <p className="title">Thông tin giao hàng</p>
                <div className="multi-field">
                    <input required
                        name="fullName"
                        onChange={onChangeHandler}
                        value={data.fullname}
                        type="text"
                        placeholder="Họ tên"
                    />
                    <input required
                        name="phone"
                        onChange={onChangeHandler}
                        value={data.phone}
                        type="text"
                        placeholder="Số điện thoại"
                    />
                    <input required
                        name="address"
                        onChange={onChangeHandler}
                        value={data.address}
                        type="text"
                        placeholder="Địa chỉ"
                    />
                    <hr />
                </div>
            </div>

            <div className="place-order-right">
                <div className="cart-total">
                    <div>
                        <h2>Đơn hàng</h2>
                        <div className="cart-total-details">
                            <p>Tạm tính</p>
                            <p>{totalAmount.toLocaleString() + "đ"}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Phí vận chuyển</p>
                            <p>{(totalAmount === 0 ? 0 : 20000).toLocaleString() + "đ"}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Tổng</p>
                            <b>{(totalAmount === 0 ? 0 : totalAmount + 20000).toLocaleString() + "đ"}</b>
                        </div>
                    </div>
                    <div style={{ margin: '20px 0' }}>
                        <label>
                            <input type="radio" value="vnpay" checked={paymentMethod === "vnpay"} onChange={() => setPaymentMethod("vnpay")} />
                            Thanh toán VNPay
                        </label>
                        <label style={{ marginLeft: 20 }}>
                            <input type="radio" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                            Thanh toán tiền mặt khi nhận hàng
                        </label>
                    </div>
                    <button type="submit">Thanh toán</button>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;