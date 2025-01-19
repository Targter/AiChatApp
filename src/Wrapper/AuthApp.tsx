import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../store/useStore';
const withAuthCheck = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
     const setUserData = useUserStore((state) => state.setUserData);

    const navigate = useNavigate();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await axios.get("http://localhost:3000/userAuth", { withCredentials: true });
          console.log("authresposne",response)
          if (!response.data.authenticated) {
            navigate('/Login');
          } else {
            setIsAuthenticated(true);
            const userData = response.data.user;
            setUserData({
              userId: userData._id,
              username: userData.username,
              email: userData.email,
              subscriptionType: userData.subscriptionType,
            });
          }
        } catch (error) {
          setIsAuthenticated(false);
          navigate('/Login');
        }
      };

      checkAuth();
    }, [navigate]);

    if (isAuthenticated === null) {
      return <div>Loading...</div>;  // Or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthCheck;
