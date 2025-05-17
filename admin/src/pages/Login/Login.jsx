import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';
import { assets } from '../../assets/assets';
import axios from 'axios';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const url = "http://localhost:4000";

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                const result = await login(formData.email, formData.password);
                if (result.success) {
                    navigate('/');
                } else {
                    setError(result.message);
                }
            } else {
                // Đăng ký
                const response = await axios.post(`${url}/api/admin/register`, {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });

                if (response.data.success) {
                    // Chuyển sang form đăng nhập sau khi đăng ký thành công
                    setIsLogin(true);
                    setError("Đăng ký thành công! Vui lòng đăng nhập.");
                    setFormData({ name: '', email: '', password: '' });
                }
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <div className="admin-login">
            <div className="admin-login-container">
                <div className="admin-login-header">
                    <img src={assets.logo} alt="Logo" className="admin-login-logo" />
                    <h2>{isLogin ? 'Admin Login' : 'Admin Register'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="admin-login-form">
                    {error && <div className="admin-login-error">{error}</div>}

                    {!isLogin && (
                        <div className="admin-login-input-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your name"
                            />
                        </div>
                    )}

                    <div className="admin-login-input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="admin-login-input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="admin-login-button">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <div className="admin-login-switch">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setFormData({ name: '', email: '', password: '' });
                        }}>
                            {isLogin ? 'Register here' : 'Login here'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login; 