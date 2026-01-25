import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingScreen from 'components/Shared/LoadingScreen';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import authService from 'services/authService';
import logoImg from 'assets/img/Logo_FICSULLANA.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const result = await authService.login(username, password, rememberMe);
        const { access_token, refresh_token } = result;

        // Configuración de Cookies
        const accessTokenExpiration = '; path=/; Secure; SameSite=Strict';
        const refreshTokenExpiration = rememberMe
            ? `; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; Secure; SameSite=Strict`
            : '; path=/; Secure; SameSite=Strict';

        document.cookie = `access_token=${access_token}${accessTokenExpiration}`;
        document.cookie = `refresh_token=${refresh_token}${refreshTokenExpiration}`;

        toast.success(`¡Bienvenido de nuevo!`);
        
        // REDIRECCIÓN UNIFICADA: Todos van al dashboard principal
        setTimeout(() => navigate('/home'), 1000);

    } catch (error) {
        const msg = error.response?.data?.message || 'Error al iniciar sesión';
        toast.error(msg);
    } finally {
        setLoading(false);
    }
  };

  // --- LÓGICA FORGOT PASSWORD (Sin cambios) ---
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
    <div className="min-h-screen flex bg-white overflow-hidden">
      
      {/* SECCIÓN IZQUIERDA: BRANDING (Visible en Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-fic-red to-[#a30000] items-center justify-center overflow-hidden">
        {/* Patrón de fondo decorativo */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-fic-yellow opacity-10 blur-3xl"></div>

        <div className="relative z-10 text-center px-10">
            <img 
                src={logoImg} 
                alt="Fic Sullana Logo" 
                className="w-64 mx-auto mb-8 drop-shadow-2xl brightness-0 invert" 
            />
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
                Transformamos tus finanzas
            </h2>
            <p className="text-red-100 text-lg font-medium max-w-md mx-auto leading-relaxed">
                Plataforma segura de gestión administrativa y operativa. Tu socio estratégico en el crecimiento.
            </p>
        </div>
        
        {/* Copyright footer */}
        <div className="absolute bottom-6 text-red-200 text-xs font-medium">
            © {new Date().getFullYear()} Fic Sullana. Todos los derechos reservados.
        </div>
      </div>

      {/* SECCIÓN DERECHA: FORMULARIO */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-16 bg-slate-50 lg:bg-white relative">
        
        {/* Decoración móvil (Círculo rojo superior) */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-2 bg-fic-red"></div>

        <div className="w-full max-w-md space-y-8">
            {/* Logo visible solo en móvil */}
            <div className="lg:hidden text-center mb-8">
                <img src={logoImg} alt="Logo" className="h-16 mx-auto" />
            </div>

            {loading ? (
                <div className="flex flex-col justify-center items-center h-64 animate-fade-in">
                    <LoadingScreen />
                    <p className="text-slate-400 mt-4 text-sm font-medium animate-pulse">Autenticando...</p>
                </div>
            ) : showForgotPassword ? (
                <div className="animate-fade-in-up">
                    <ForgotPasswordForm
                        dni={dni}
                        setDni={setDni}
                        handleForgotPassword={handleForgotPassword}
                        setShowForgotPassword={setShowForgotPassword}
                    />
                </div>
            ) : (
                <div className="animate-fade-in-up">
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Bienvenido</h2>
                        <p className="text-slate-500 mt-2">Ingresa tus credenciales para acceder al sistema.</p>
                    </div>
                    
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
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Login;