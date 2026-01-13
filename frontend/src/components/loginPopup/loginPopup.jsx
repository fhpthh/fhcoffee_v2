import React, { useEffect, useState } from 'react'
import './LoginPopup.css'
import assets from '../../assets/assets'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const LoginPopup = ({ setShowLogin }) => {
    const { url } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Sign Up")
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    })
    const [agree, setAgree] = useState(false)
    const [error, setError] = useState("")

    const onChangeHandler = (event) => {
        const { name, value } = event.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!agree) {
            setError("You must agree to the terms of use & privacy policy.")
            return
        }
        setError("")

        try {
            if (currState === "Login") {
                // Xử lý đăng nhập
                const response = await axios.post(`${url}/api/user/login`, {
                    email: formData.email,
                    password: formData.password
                });

                if (response.data.success) {
                    // Lưu token vào localStorage
                    localStorage.setItem('token', response.data.token);
                    // Lưu thông tin user
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    // Đóng popup đăng nhập
                    setShowLogin(false);
                    // Reload trang để cập nhật trạng thái đăng nhập
                    window.location.reload();
                }
            } else {
                // Xử lý đăng ký
                const response = await axios.post(`${url}/api/user/register`, {
                    name: formData.username,
                    email: formData.email,
                    password: formData.password
                });

                if (response.data.success) {
                    // Chuyển sang form đăng nhập sau khi đăng ký thành công
                    setCurrState("Login");
                    setError("Đăng ký thành công! Vui lòng đăng nhập.");
                }
            }
        } catch (error) {
            setError(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={handleSubmit} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <input
                            name="username"
                            value={formData.username}
                            onChange={onChangeHandler}
                            type="text"
                            placeholder="Your name"
                            required
                        />
                    )}
                    <input
                        name="email"
                        value={formData.email}
                        onChange={onChangeHandler}
                        type="email"
                        placeholder="Your email"
                        required
                    />
                    <input
                        name="password"
                        value={formData.password}
                        onChange={onChangeHandler}
                        type="password"
                        placeholder="Password"
                        required
                        autoComplete="current-password"
                    />
                </div>
                <div className="login-popup-checkbox-row">
                    <input
                        type="checkbox"
                        id="agree"
                        checked={agree}
                        onChange={e => setAgree(e.target.checked)}
                    />
                    <label htmlFor="agree" className="login-popup-checkbox-label">
                        By continuing, I agree to the terms of use & privacy policy.
                    </label>
                </div>
                {error && <div className="login-popup-error">{error}</div>}
                <button type="submit">{currState === "Sign Up" ? "Create Account" : "Login"}</button>

                {currState === "Login" ? (
                    <p>Don't have an account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                ) : (
                    <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                )}
            </form>
        </div>
    )
}

export default LoginPopup
