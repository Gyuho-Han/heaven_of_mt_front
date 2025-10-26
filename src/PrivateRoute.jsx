import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './GoogleAuthManager';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/mode" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;