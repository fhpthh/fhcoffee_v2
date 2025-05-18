import React from 'react'
import './Sidebar.css'
import { FaPlusCircle, FaClipboardCheck, FaClipboardList, FaChartLine } from "react-icons/fa";
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/dashboard' className="sidebar-option">
          <FaChartLine className='icon' />
          <p>Thống kê</p>
        </NavLink>
        <NavLink to='/add' className="sidebar-option">
          <FaPlusCircle className='icon' />
          <p>Thêm sản phẩm</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
          <FaClipboardCheck className='icon' />
          <p>Danh sách sản phẩm</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
          <FaClipboardList className='icon' />
          <p>Đặt hàng</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
