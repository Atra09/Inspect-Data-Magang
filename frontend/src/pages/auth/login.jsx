import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Unlock, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setNotification('');

    setTimeout(() => {
      const dummyToken = 'ksop-session-token-' + Date.now();
      const userData = { username: username || 'Petugas KSOP', role: 'Syahbandar' };

      if (login) {
        login(dummyToken, userData);
      } else {
        sessionStorage.setItem('token', dummyToken);
        sessionStorage.setItem('user', JSON.stringify(userData));
      }

      setIsLoading(false);
      setNotification('Login Berhasil! Mengalihkan ke Dashboard...');

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#F0F9FF] flex justify-center items-center font-sans overflow-x-hidden antialiased select-none py-4 sm:py-8 md:py-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 bg-[#0284C7] text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold z-50 animate-bounce">
          {notification}
        </div>
      )}

      <div className="w-full max-w-[420px] px-5 box-border relative sm:scale-105 md:scale-115 lg:scale-125 transition-transform duration-300 origin-center my-auto">

        <div className="flex flex-col items-center w-full">
          {/* 1. Header Section */}
          <div className="mt-4 flex flex-col items-center">
            <h1 className="text-[30px] font-extrabold text-[#0284C7] tracking-[0.2px] mb-1.5">
              Welcome Back!
            </h1>

            {/* Official Kemenhub Logo inside a Circular Badge */}
            <div className="w-[72px] h-[72px] rounded-full bg-white p-1 shadow-[0_4px_16px_rgba(2,132,199,0.16)] border border-white/90 flex items-center justify-center transition-transform hover:scale-105">
              <img
                src="/kementrianperhubungan.png"
                alt="Logo Kementerian Perhubungan"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
          </div>

          {/* 2. Stacked 3D Card Area */}
          <div className="mt-4 h-[410px] w-full relative">

            {/* A. Background Gradient Panel */}
            <div className="absolute top-[15px] -left-5 w-[72%] h-[335px] bg-[linear-gradient(180deg,#38BDF8_0%,#0284C7_50%,#0369A1_100%)] rounded-r-[24px] md:rounded-[24px] shadow-[-2px_10px_16px_rgba(2,132,199,0.22)] z-10" />

            {/* B. White Pointer Triangle */}
            <div className="absolute top-[18px] left-[65px] z-20 leading-none">
              <svg width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 0L26 18H0L13 0Z" fill="white"/>
              </svg>
            </div>

            {/* C. Foreground Main White Form Card */}
            <div className="absolute top-[35px] left-[25px] right-[10px] bg-white rounded-[24px] shadow-[0_10px_24px_rgba(0,0,0,0.08)] overflow-hidden z-30">

              <form onSubmit={handleLogin} className="pt-6 px-6 pb-[45px] flex flex-col">
                {/* Sign In Header - Light Blue Theme */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-4 bg-[linear-gradient(180deg,#0284C7_0%,#0EA5E9_100%)] rounded-full shadow-[0_2px_6px_rgba(2,132,199,0.3)]" />
                  <span className="text-[13px] font-extrabold text-[#0284C7] tracking-wider uppercase">
                    Sign in
                  </span>
                </div>

                {/* Username Input */}
                <div className="relative mb-6 flex items-center pt-2">
                  <input
                    type="text"
                    id="username"
                    placeholder=" "
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="peer w-full border-b border-[#E2E8F0] py-2 pr-12 pl-0 text-sm text-gray-800 outline-none focus:border-b-[1.5px] focus:border-[#0284C7] transition-all bg-transparent"
                  />
                  <label
                    htmlFor="username"
                    className="absolute left-0 top-3 text-sm text-[#A0AEC0] pointer-events-none transition-all duration-200 ease-out peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-[#0284C7] peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-[#0284C7] peer-autofill:-translate-y-5 peer-autofill:text-xs peer-autofill:font-semibold peer-autofill:text-[#0284C7]"
                  >
                    Username
                  </label>

                  <div className="absolute right-0 flex items-center gap-1.5">
                    {username && (
                      <button
                        type="button"
                        onClick={() => setUsername('')}
                        className="text-[#A0AEC0] hover:text-rose-500 transition-colors p-0.5 rounded-full hover:bg-gray-100 flex items-center justify-center outline-none"
                        title="Clear username"
                        tabIndex="-1"
                      >
                        <X size={15} />
                      </button>
                    )}
                    <User className="text-[#A0AEC0] pointer-events-none" size={18} />
                  </div>
                </div>

                {/* Password Input */}
                <div className="relative mb-5 flex items-center pt-2">
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    id="password"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer w-full border-b border-[#E2E8F0] py-2 pr-14 pl-0 text-sm text-gray-800 outline-none focus:border-b-[1.5px] focus:border-[#0284C7] transition-all bg-transparent"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 top-3 text-sm text-[#A0AEC0] pointer-events-none transition-all duration-200 ease-out peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-[#0284C7] peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-[#0284C7] peer-autofill:-translate-y-5 peer-autofill:text-xs peer-autofill:font-semibold peer-autofill:text-[#0284C7]"
                  >
                    Password
                  </label>

                  <div className="absolute right-0 flex items-center gap-1.5">
                    {password && (
                      <button
                        type="button"
                        onClick={() => setPassword('')}
                        className="text-[#A0AEC0] hover:text-rose-500 transition-colors p-0.5 rounded-full hover:bg-gray-100 flex items-center justify-center outline-none"
                        title="Clear password"
                        tabIndex="-1"
                      >
                        <X size={15} />
                      </button>
                    )}
                    <button
                      type="button"
                      className="bg-none border-none p-0 flex items-center justify-center cursor-pointer outline-none"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      tabIndex="-1"
                    >
                      {isPasswordVisible ? (
                        <Unlock className="text-[#A0AEC0] hover:text-[#0284C7] transition-colors" size={18} />
                      ) : (
                        <Lock className="text-[#A0AEC0] hover:text-[#0284C7] transition-colors" size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end mt-3 mb-[42px]">
                  <a
                    href="#forgot"
                    className="text-xs text-[#718096] hover:text-[#0284C7] transition-colors no-underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Forgot password?
                  </a>
                </div>
              </form>

              {/* Card Bottom Wave Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-[78px] pointer-events-none overflow-hidden">
                <svg
                  viewBox="0 0 350 78"
                  preserveAspectRatio="none"
                  className="w-full h-full block"
                >
                  <defs>
                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="50%" stopColor="#0284C7" />
                      <stop offset="100%" stopColor="#0369A1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,31.2 C122.5,3.9 227.5,66.3 350,19.5 L350,78 L0,78 Z"
                    fill="url(#waveGradient)"
                  />
                </svg>
              </div>
            </div>

            {/* D. Login Button */}
            <div className="absolute top-[320px] left-[25px] right-[10px] flex justify-center z-40">
              <button
                type="button"
                className="h-[44px] w-[140px] border-none rounded-[26px] bg-[linear-gradient(90deg,#0284C7_0%,#0EA5E9_100%)] shadow-[0_5px_14px_rgba(2,132,199,0.45)] text-white text-[15px] font-bold tracking-[0.3px] cursor-pointer flex items-center justify-center outline-none active:scale-95 transition-all disabled:opacity-85"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-[18px] h-[18px] border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Login</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
