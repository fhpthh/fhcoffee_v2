import React, { useState } from 'react'
import './loginPopup.css'
import assets from '../../assets/assets'

const LoginPopup = ({ setShowLogin }) => {
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

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!agree) {
            setError("You must agree to the terms of use & privacy policy.")
            return
        }
        setError("")
        console.log(formData)
        // TODO: Add authentication logic here
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
