import React, {useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ShoppingPage from './pages/ShoppingPage/ShoppingPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import BasketPage from './pages/BasketPage/BasketPage';
import SubtotalProvider from './contexts/SubtotalProvider';
import AddProduct from './api/addProduct';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage';

function App() {

  useEffect(() => {
    // Dynamically load Facebook SDK
    const loadFbSdk = () => {
      if (document.getElementById('facebook-jssdk')) return;

      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      window.fbAsyncInit = function () {
        window.FB.init({
          appId: '1073626057480928', 
          cookie: true,
          xfbml: false,
          version: 'v23.0',
        });
        console.log('Facebook SDK initialized');
      };
    };

    loadFbSdk();
  }, []);

  //Protected Route checks if a token exists, then sends it on its way (TO CHANGE FOR SECURITY)
  //SubtotalProvider is for scope of subtotal

  //addProduct is an added route meant to show the skeleton of how an api would be added
  //you first have to login through /login to use it
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/addProduct" element={
        <ProtectedRoute>
          <AddProduct />
        </ProtectedRoute>
      } />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/resetPassword/:token" element={<ResetPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/shopping" element={
        <ProtectedRoute>
          <ShoppingPage />
        </ProtectedRoute>
      } />
      
      <Route path="/basket" element={
        <ProtectedRoute>
          <SubtotalProvider>
            <BasketPage />
          </SubtotalProvider>
        </ProtectedRoute>
      } />
    </Routes>

  );
}

export default App;
