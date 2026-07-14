import { useState } from 'react'
import { apiRequest } from './utils.jsx'
import './Modal.css'
import './LoginSignup.css'

function LoginSignup({onClose, onLoginSuccess}) {
  const [isSignup, setIsSignup] = useState(false)

  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [signupUsername, setSignupUsername] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')


  const handleLogin = async () => {
    try {
      const data = await apiRequest('/login', {
        username: loginUsername,
        password: loginPassword, 
      })
      onLoginSuccess(data.token)
      onClose()
    } catch (error) {
      alert(error.message)
    }
  }

  const handleSignup = async () => {
    if (signupPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      const data = await apiRequest('/signup', {
      username: signupUsername,
      password: signupPassword
    })
    onLoginSuccess(data.token)
    onClose()
    } catch (error) {
      alert(error.message)}
  }

  return (
    <div className = "modal-backdrop">
      <div className="form-container">
        <button className = "close-button"onClick = {onClose}>X</button>
        <div className="login-signup-toggle">
          <div className={`slider ${isSignup ? 'moveslider' : ''}`}></div>
          <button className="login" onClick={() => setIsSignup(false)}>Login</button>
          <button className="signup" onClick={() => setIsSignup(true)}>Sign Up</button>
        </div>
        <div className={`form-section ${isSignup ? 'form-section-move' : ''}`}>
          <div className="login-box">
            <input
              type="text"
              className="element"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <input
              type="password"
              className="element"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button className="login-signup-button" onClick={handleLogin}>Login</button>
          </div>

          <div className="signup-box">
            <input
              type="text"
              className="element"
              placeholder="Enter your username"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
            />
            <input
              type="password"
              className="element"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <input
              type="password"
              className="element"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="login-signup-button" onClick={handleSignup}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default LoginSignup