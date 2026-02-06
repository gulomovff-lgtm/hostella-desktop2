import React, { useState } from 'react';
import Button from '../ui/Button';
import { inputClass, labelClass } from '../../config/constants';

/**
 * Login Screen component
 * @param {Object} props - LoginScreen properties
 * @param {function} props.onLogin - Login handler function
 */
const LoginScreen = ({ onLogin }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!login || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    setLoading(true);
    try {
      await onLogin(login, password);
    } catch (err) {
      setError('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">Hostella</h1>
          <p className="text-slate-600">Система управления хостелом</p>
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClass}>Логин</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className={inputClass}
              placeholder="Введите логин"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className={labelClass}>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="Введите пароль"
              disabled={loading}
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>© 2024 Hostella. Все права защищены.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
