import { useEffect, useState } from 'react';
import type { ReactNode } from "react";

import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/verify-token', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
        }
      } catch {
        setIsVerified(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setIsVerified(false);
    }
  }, [token]);

  if (isVerified === null) {
    return <div>Verifying User...</div>;
  }

  return isVerified ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
