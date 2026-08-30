import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

// provides authenticaion using use context
// removes need for providing authentication, passes token to child
export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem('token'))

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
    setTokenState(newToken)
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}