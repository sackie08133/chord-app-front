import { useState } from "react";
import { apiRequest } from "./Utils.jsx";
import "./Modal.css";
import "./LoginSignup.css";

function LoginSignup({ onClose, onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false)

  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [signupUsername, setSignupUsername] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleLogin = async () => {
    try {
      const data = await apiRequest("/login", {
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
      alert("Passwords do not match")
      return
    }

    try {
      const data = await apiRequest("/signup", {
        username: signupUsername,
        password: signupPassword,
      });
      onLoginSuccess(data.token)
      onClose()
    } catch (error) {
      alert(error.message)
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-form-container">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <div className="modal-login-signup-toggle">
          <div className={`modal-slider ${isSignup ? "moveslider" : ""}`}></div>
          <button className="modal-login" onClick={() => setIsSignup(false)}>
            Login
          </button>
          <button className="modal-signup" onClick={() => setIsSignup(true)}>
            Sign Up
          </button>
        </div>
        <div className={`modal-form-section ${isSignup ? "form-section-move" : ""}`}>
          <div className="modal-login-box">
            <input
              type="text"
              className="modal-element"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <input
              type="password"
              className="modal-element"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button className="modal-login-signup-button" onClick={handleLogin}>
              Login
            </button>
          </div>

          <div className="modal-signup-box">
            <input
              type="text"
              className="modal-element"
              placeholder="Enter your username"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
            />
            <input
              type="password"
              className="modal-element"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <input
              type="password"
              className="modal-element"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="modal-login-signup-button" onClick={handleSignup}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
