import React from 'react'
import Navbar from './components/navbar/navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import './App.css'
import Verify from './pages/Verify/Verify'
import UserOrder from './pages/UserOrder/UserOrder'

const App = () => {
  const [showLogin, setShowLogin] = React.useState(false);
  return (
    <div className="app-container">
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : null}
      <Navbar setShowLogin={setShowLogin} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify/>}> </Route>
          <Route path= '/myorders' element = {<UserOrder/>}/>
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
