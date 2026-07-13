import { useState } from 'react'
import './LoginSignup.css'

function LoginSignup({onClose}) {
  const [isSignup, setIsSignup] = useState(false)

  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [signupUsername, setSignupUsername] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleLogin = async () => {
    try { // for network, server errors etc
        const response = await fetch('http://localhost:3001/login', {
        method: 'POST', // fetch is by default get
        headers:{'Content-Type': 'application/json'}, // "tells" express that this is JSON
        body: JSON.stringify({username: loginUsername, password: loginPassword}) // converts objects into strings
      })

      const data = await response.json() // parse the response's body
      if (response.ok) {
        console.log(data.token) // TEMPORARY, DO NOT KNOW WHAT TO DO WITH TOKEN YET
        onClose()
      } else {
        alert("Something went wrong, Please try again later")
      }
    } catch (error) {
      alert("Server/Internet/etc Error. Please try again later")
    }
   
  
    
  }

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: signupUsername, password: signupPassword, confirmPassword: confirmPassword})
      })
      const data = await response.json()
      if (response.ok) {
        console.log(data.token)
        onClose()
      } else {
        alert("Something went wrong, Please try again later")
      }
    } catch (error) {
      alert("Server / Internet / etc Error. Please try again later")
    }
  }

  return (
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
  )
}

export default LoginSignup