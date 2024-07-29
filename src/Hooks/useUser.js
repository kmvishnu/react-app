import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import config from '../config';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, clearToken } from '../features/user/userSlice';

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userName = useSelector((state) => state.user.name);
  const userPassword = useSelector((state) => state.user.password);
  const dispatch = useDispatch();


  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now().valueOf() / 1000;
      return decoded.exp > now;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user && isTokenValid(token)) {
      dispatch(setToken({ token, user: JSON.parse(user) }));
    } else {
      dispatch(clearToken());
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [dispatch]);

  const loginUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${config.apiBaseUrl}/v2/login`, userData);
      const { token, name } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(name));
      dispatch(setToken({ token, name }));
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login request failed:', error);
      return { status: 'error' };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(clearToken());
  };

  const sendOtp = async (email) => {
    setLoading(true);
    setError(null);
    const payload = { email };
    try {
      const response = await axios.post(`${config.apiBaseUrl}/v2/sendOtp`, payload);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError('Failed to send OTP. Please try again.');
      console.error('Send OTP request failed:', error);
      return { status: 'error' };
    }
  };

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    setError(null);
    const payload = {
      "name": userName,
      "email": email,
      "password": userPassword,
      "otp": otp
    }
    try {
      const response = await axios.post(`${config.apiBaseUrl}/v2/verifyOtp`, payload);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError('Failed to verify OTP. Please try again.');
      console.error('Verify OTP request failed:', error);
      return { status: 'error' };
    }

  };


  return {
    loading,
    error,
    sendOtp,
    verifyOtp,
    loginUser,
    logoutUser
  };
};
