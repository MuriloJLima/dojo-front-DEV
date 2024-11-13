import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { Home } from "./Home"
import { useState, useEffect } from "react"



import './global.css'
import { Login } from "./components/Login"

// Componente de rota protegida
function ProtectedRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/" replace />;
}


export function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verifica se o usuário já está logado no localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);


  const handleLogin = (token) => {
    localStorage.setItem('token', JSON.stringify(token));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Home onLogout={handleLogout}/>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<h1>Not Found</h1>} />
        {/* <Route path="/home" element={<Home onLogout={handleLogout}/>} /> */}
      </Routes>
    </BrowserRouter>
  )
}


