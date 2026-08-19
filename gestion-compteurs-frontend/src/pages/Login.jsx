import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Login = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(loginId, password);
    if (success) {
      navigate('/');
    } else {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 bg-gradient-to-br from-dark-900 to-dark-800">
      <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden">
        {/* Décoration d'arrière plan */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="flex justify-center mb-8">
          <div className="p-3 bg-primary-500/10 rounded-2xl border border-primary-500/20">
            <Zap className="text-primary-500 w-10 h-10" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-2">Bienvenue</h2>
        <p className="text-slate-400 text-center mb-8">Connectez-vous pour gérer les compteurs</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Login</label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="input-field"
              placeholder="ex: admin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-4">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
