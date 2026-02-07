import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from 'services/authService';
import { useAuth } from 'context/AuthContext';
import LoadingScreen from 'components/Shared/LoadingScreen';

// Importación de Componentes
import BackgroundDecor from './components/BackgroundDecor';
import LoginCard from './components/LoginCard';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { refreshSession } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const result = await authService.login(username, password, rememberMe);
        const { access_token } = result;

        const accessTokenExpiration = '; path=/; Secure; SameSite=Strict';
        document.cookie = `access_token=${access_token}${accessTokenExpiration}`;

        await refreshSession(); 

        setLoginSuccess(true);
        toast.success(`¡Bienvenido de nuevo!`);
        
        setTimeout(() => {
          navigate('/home');
        }, 1500);

    } catch (error) {
        console.error(error);
        const msg = error.response?.data?.message || 'Error al iniciar sesión';
        toast.error(msg);
    } finally {
        setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(dni);
      toast.success('Se ha enviado un enlace de restablecimiento a tu correo.');
      setTimeout(() => setShowForgotPassword(false), 1500);
    } catch (error) {
      toast.error('Error al solicitar restablecimiento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4">
      <BackgroundDecor />
      
      <div className="relative z-10 flex min-h-screen items-center justify-center py-6">
        <LoginCard loginSuccess={loginSuccess}>
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 animate-fade-in">
              <LoadingScreen />
              <p className="text-slate-400 mt-4 text-sm font-medium animate-pulse">Autenticando...</p>
            </div>
          ) : showForgotPassword ? (
            <ForgotPasswordForm
              dni={dni}
              setDni={setDni}
              handleForgotPassword={handleForgotPassword}
              setShowForgotPassword={setShowForgotPassword}
            />
          ) : (
            <LoginForm
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              handleLogin={handleLogin}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              setShowForgotPassword={setShowForgotPassword}
            />
          )}
        </LoginCard>
      </div>
    </div>
  );
};

export default Login;