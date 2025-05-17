import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className='navbar'>
      <img className="logo" src={assets.logo} alt="" />
      {admin && (
        <div className='navbar-profile'>
          <img src={assets.user} alt="" />
          <ul className="nav-profile-dropdown">
            <li onClick={handleLogout}>
              <img src={assets.logout} alt="" />
              <p>Logout</p>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Navbar
