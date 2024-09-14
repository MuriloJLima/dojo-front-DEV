import React, { useState, useEffect } from "react";
import GlobalStyle from "./styles/global";
import styled from "styled-components";

import Home from "./components/Home.js";
import Login from "./components/Login.js"


import "react-toastify/dist/ReactToastify.css";




function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verifica se o usuário já está logado no localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Função para lidar com o login bem-sucedido
  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <>
      {/* {isLoggedIn ? (
        <Home onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )} */}

      <Home onLogout={handleLogout} />
      <GlobalStyle />
    </>
  );
}

export default App;
