// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Home from './Components/Home/Home';
import PrivateRoute from './Components/Common/PrivateRoute';
import { clearToken } from './features/user/userSlice';
import { jwtDecode } from 'jwt-decode';
import SignIn from './Components/User/SignIn';
import SignUp from './Components/User/SignUp';

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    const now = Date.now().valueOf() / 1000;
    return decoded.exp > now;
  } catch (error) {
    return false;
  }
};

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const interval = setInterval(() => {
      if (token && !isTokenValid(token)) {
        dispatch(clearToken());
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, [token, dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/home" element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
