import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { useLocation, useNavigate } from 'react-router-dom';

import { StoreContext } from '../../context/StoreContext';
const Navbar = ({ setShowLogin }) => {
  // Khởi tạo state menu mặc định là "home"
  const [menu, setMenu] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalCartAmout, token, setToken } = useContext(StoreContext);

  // Kiểm tra token khi component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, [setToken]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    window.location.reload();
  };

  // Scroll mượt về đầu trang
  const scrollToTop = (e) => {
    e.preventDefault();
    setMenu("home");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll mượt đến phần menu
  const scrollToMenu = (e) => {
    e.preventDefault();
    setMenu("menu");
    const el = document.getElementById('explore-menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Home: luôn về trang chủ và scroll lên đầu
  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMenu('home');
  };

  // Menu: luôn về trang chủ rồi scroll tới menu
  const handleMenuClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('explore-menu');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    } else {
      const el = document.getElementById('explore-menu');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setMenu('menu');
  };

  // Mobile-app: về trang chủ rồi scroll tới AppDownload
  const handleMobileAppClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('app-download');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      const el = document.getElementById('app-download');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMenu('mobile-app');
  };

  // Contact us: về trang chủ rồi scroll tới footer
  const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('footer');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      const el = document.getElementById('footer');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMenu('contact-us');
  };

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <img
          src={assets.logo}
          alt=""
          className="logo"
          style={{ cursor: 'pointer' }}
          onClick={handleLogoClick}
        />
        <ul className="navbar-menu">
          <li className={menu === "home" ? "active" : ""}>
            <a href="#" onClick={handleHomeClick}>Home</a>
          </li>
          <li className={menu === "menu" ? "active" : ""}>
            <a href="#explore-menu" onClick={handleMenuClick}>Menu</a>
          </li>
          <li className={menu === "mobile-app" ? "active" : ""}>
            <a href="#app-download" onClick={handleMobileAppClick}>Mobile-app</a>
          </li>
          <li className={menu === "contact-us" ? "active" : ""}>
            <a href="#footer" onClick={handleContactClick}>Contact us</a>
          </li>
        </ul>
        <div className="navbar-right">

          <div className="navbar-search-icon">
            <i
              className="fas fa-shopping-cart"
              style={{ color: 'white', cursor: 'pointer' }}
              onClick={() => navigate('/cart')}
            />
            <div className={getTotalCartAmout() === 0 ? "" : "dot"}></div>
          </div>
          {!token ? <button onClick={() => setShowLogin(true)}>Sign in</button>
            : <div className='navbar-profile'>
              <img src={assets.avatar} alt="" />
              <ul className="nav-profile-dropdown">
                <li onClick={() => navigate('/myorders')}>
                  <img src={assets.bag} alt="" />
                  <p>My Orders</p>
                </li>
                <hr />
                <li onClick={handleLogout}>
                  <img src={assets.logout} alt="" />
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Navbar;
