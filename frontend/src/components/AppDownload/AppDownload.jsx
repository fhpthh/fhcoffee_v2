import React from 'react'
import './AppDownload.css'
import assets from '../../assets/assets'
const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
        <p> FH Coffee App</p>
        <div className='app-download-platforms'>
            <img src={assets.ggplay} alt="" />
            <img src={assets.appstore} alt="" />
        </div>
      
    </div>
  )
}

export default AppDownload
