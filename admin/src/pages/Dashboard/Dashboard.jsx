import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';
import { FaUsers, FaShoppingBag, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';

// Giả lập thư viện biểu đồ cột
const SimpleBarChart = ({ data, labels, title }) => {
    const maxValue = Math.max(...data, 1);

    return (
        <div className="simple-chart">
            <h3>{title}</h3>
            <div className="chart-container">
                {data.map((value, index) => (
                    <div key={index} className="chart-item">
                        <div className="chart-bar-container">
                            <div
                                className="chart-bar"
                                style={{ height: `${(value / maxValue) * 100}%` }}
                            ></div>
                        </div>
                        <div className="chart-label">{labels[index]}</div>
                        <div className="chart-value">{value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Component biểu đồ tròn cho trạng thái đơn hàng
const PieChart = ({ data, labels, title, colors }) => {
    const total = data.reduce((sum, value) => sum + value, 0);

    // Tính toán phần trăm và màu sắc mặc định nếu không được cung cấp
    const defaultColors = ['#4b2e0e', '#d59d6a', '#8B4513', '#A0522D', '#CD853F', '#DEB887'];

    // Tạo chuỗi CSS conic-gradient dựa trên dữ liệu
    let conicGradient = 'conic-gradient(';
    let currentPercent = 0;

    data.forEach((value, index) => {
        const percent = (value / total) * 100;
        const color = colors?.[index] || defaultColors[index % defaultColors.length];

        conicGradient += `${color} ${currentPercent}% ${currentPercent + percent}%, `;
        currentPercent += percent;
    });

    // Loại bỏ dấu phẩy và khoảng trắng cuối cùng và đóng chuỗi
    conicGradient = conicGradient.slice(0, -2) + ')';

    return (
        <div className="pie-chart">
            <h3>{title}</h3>
            <div className="pie-container">
                <div
                    className="pie"
                    style={{
                        background: conicGradient
                    }}
                >
                    <div className="pie-center"></div>
                </div>

                <div className="pie-legend">
                    {data.map((value, index) => (
                        <div key={index} className="legend-item">
                            <div
                                className="legend-color"
                                style={{ backgroundColor: colors?.[index] || defaultColors[index % defaultColors.length] }}
                            />
                            <div className="legend-text">
                                <span>{labels[index]}</span>
                                <span className="legend-value">{value} ({((value / total) * 100).toFixed(1)}%)</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Dashboard = ({ url }) => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { admin } = useAuth();
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${url}/api/admin/statistics`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStatistics(response.data.statistics);
            } catch (err) {
                setError(err.response?.data?.message || 'Lỗi khi tải thống kê');
                console.error('Error fetching statistics:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchStatistics();
        }
    }, [url, token]);

    if (loading) return <div className="dashboard-loading">Đang tải thống kê...</div>;
    if (error) return <div className="dashboard-error">Lỗi: {error}</div>;
    if (!statistics) return <div className="dashboard-empty">Không có dữ liệu thống kê</div>;

    // Chuẩn bị dữ liệu cho biểu đồ doanh thu theo tháng
    const revenueData = statistics.revenue.byMonth.map(item => item.revenue);
    const revenueLabels = statistics.revenue.byMonth.map(item => `${item.month}/${item.year}`);

    // Chỉ lấy đúng 4 trạng thái cần thiết
    const allowedStatus = ['processing', 'ship', 'delivered', 'canceled'];
    const statusKeys = Object.keys(statistics.orders.byStatus).filter(key =>
        allowedStatus.includes(key.toLowerCase())
    );
    const statusData = statusKeys.map(key => statistics.orders.byStatus[key]);
    const statusLabels = statusKeys.map(status => {
        switch (status.toLowerCase()) {
            case 'processing': return 'Đang xử lý';
            case 'ship': return 'Đang vận chuyển';
            case 'delivered': return 'Đã giao hàng';
            case 'canceled': return 'Đã hủy';
            default: return status;
        }
    });

    // Màu sắc cho biểu đồ tròn trạng thái
    const statusColors = [
        '#4b2e0e',  // Nâu đậm
        '#d59d6a',  // Nâu nhạt
        '#8B4513',  // SaddleBrown
        '#A0522D',  // Sienna
        '#CD853F',  // Peru
        '#DEB887'   // Burlywood
    ];

    // Top 5 sản phẩm bán chạy
    const topProducts = [...statistics.productSales]
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    const topProductsData = topProducts.map(item => item.quantity);
    const topProductsLabels = topProducts.map(item => item.name);

    return (
        <div className="dashboard">
            <h1>Tổng quan hệ thống</h1>

            <div className="dashboard-summary">
                <div className="summary-card">
                    <div className="icon-container">
                        <FaUsers className="summary-icon" />
                    </div>
                    <div className="summary-details">
                        <h3>Người dùng</h3>
                        <p className="summary-value">{statistics.users.total}</p>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="icon-container">
                        <FaShoppingBag className="summary-icon" />
                    </div>
                    <div className="summary-details">
                        <h3>Đơn hàng</h3>
                        <p className="summary-value">{statistics.orders.total}</p>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="icon-container">
                        <FaMoneyBillWave className="summary-icon" />
                    </div>
                    <div className="summary-details">
                        <h3>Doanh thu</h3>
                        <p className="summary-value">{statistics.revenue.total.toLocaleString()}đ</p>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="icon-container">
                        <FaCreditCard className="summary-icon" />
                    </div>
                    <div className="summary-details">
                        <h3>Thanh toán online</h3>
                        <p className="summary-value">{statistics.payments.paid} đơn</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-charts">
                <div className="chart-row">
                    <div className="chart-column">
                        <SimpleBarChart
                            data={revenueData}
                            labels={revenueLabels}
                            title="Doanh thu theo tháng"
                        />
                    </div>
                    <div className="chart-column">
                        <PieChart
                            data={statusData}
                            labels={statusLabels}
                            title="Trạng thái đơn hàng"
                            colors={statusColors}
                        />
                    </div>
                </div>

                <div className="chart-row">
                    <div className="chart-column payment-stats">
                        <h3>Thống kê hình thức thanh toán</h3>
                        <div className="payment-chart">
                            <div className="payment-segment online" style={{
                                width: `${(statistics.payments.paid / statistics.orders.total) * 100}%`
                            }}>
                                <span>Online: {statistics.payments.paid} đơn</span>
                            </div>
                            <div className="payment-segment cod" style={{
                                width: `${(statistics.payments.cod / statistics.orders.total) * 100}%`
                            }}>
                                <span>COD: {statistics.payments.cod} đơn</span>
                            </div>
                        </div>
                    </div>
                    <div className="chart-column">
                        <SimpleBarChart
                            data={topProductsData}
                            labels={topProductsLabels}
                            title="Top 5 sản phẩm bán chạy"
                        />
                    </div>
                </div>
            </div>

            <div className="product-sales-table">
                <h3>Doanh số theo sản phẩm</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Doanh thu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statistics.productSales.map((product, index) => (
                            <tr key={index}>
                                <td>{product.name}</td>
                                <td>{product.quantity}</td>
                                <td>{product.revenue.toLocaleString()}đ</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard; 