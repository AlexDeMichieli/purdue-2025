import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <div>
      <h2>Login Page</h2>
      <p>Click the button below to login</p>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
