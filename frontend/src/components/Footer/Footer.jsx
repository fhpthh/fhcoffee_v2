import React from 'react'
import { Link } from 'react-router-dom'
import assets from '../../assets/assets'
import './Footer.css'

const Footer = () => {
  return (
    <footer className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <div className="footer-social-icons">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-twitter"></i>
            </a>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>FH COFFEE</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/delivery">Delivery</Link></li>
            <li><Link to="/privacy">Privacy policy</Link></li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>SĐT: 0123456789</li>
            <li>Email: fhcoffee@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <div className="footer-bottom">
        <p>© 2025 FH COFFEE. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
