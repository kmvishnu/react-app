import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const isTokenValid = (token) => {
    try {
        const decoded = jwtDecode(token);
        const now = Date.now().valueOf() / 1000;
        return decoded.exp > now;
    } catch (error) {
        return false;
    }
};

const PrivateRoute = () => {
    const token = useSelector((state) => state.user.token);
    return token && isTokenValid(token) ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
