import React from 'react';
import './Header.css';
import assets from '../../assets/assets';

const Header = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('food-display');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="header">
      <div className="header-content">
        <div className="header-left">
          <h1><b>FH COFFEE</b></h1>
          <h2>Hãy bắt đầu ngày mới tuyệt vời<br />cùng ly cà phê đặc biệt của chúng tôi</h2>
          <p>Chào mừng bạn đến với thiên đường cà phê, nơi mỗi hạt cà phê kể một câu chuyện và mỗi tách đều mang đến niềm vui.</p>
          <button className="header-btn" onClick={scrollToMenu}>Xem Menu</button>
        </div>
        <div className="header-right">
          <img src={assets.coffeehero} alt="coffee splash" className="header-img" />
        </div>
      </div>
    </div>
  );
};

export default Header;
