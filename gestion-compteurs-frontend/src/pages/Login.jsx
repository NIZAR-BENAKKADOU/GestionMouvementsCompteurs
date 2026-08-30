import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

const Login = () => {
  const [loginId, setLoginId]           = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [isLoading, setIsLoading]       = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const success = await login(loginId, password);
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Identifiants incorrects. Veuillez vérifier le login et mot de passe.');
    }
  };

  const fillAccount = (u, p) => {
    setLoginId(u);
    setPassword(p);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F6F8FA] px-4 py-8 relative overflow-hidden">
      
      {/* Tricolor Accent Line at top */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#9E2422] via-[#C59B27] to-[#2D6A4F]" />

      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-[#9E2422]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[34rem] h-[34rem] bg-[#2D6A4F]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div></div>

      <div className="w-full max-w-md mx-auto relative z-10">
        
        {/* Header Logo Emblem */}
        <div className="text-center mb-6">
          <div className="inline-block bg-white p-4 rounded-3xl shadow-niche-card border border-slate-200/90 mb-3.5 transform hover:scale-105 transition-transform duration-300">
            <img 
              src="/srm-logo.png" 
              alt="SRM Fès-Meknès" 
              className="h-24 w-auto object-contain mx-auto" 
            />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Gestion des Mouvements de Compteurs
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Société Régionale Multiservices Fès - Meknès SA
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-3xl space-y-5 shadow-niche-card">
          
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs text-center flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Identifiant / Utilisateur
              </label>
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-9"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-xs font-bold uppercase tracking-wider mt-2"
            >
              <ShieldCheck size={16} />
              <span>{isLoading ? 'Connexion en cours...' : 'Accéder au Portail'}</span>
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <span className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1.5">
              <Sparkles size={12} className="text-[#C59B27]" />
              Accès rapide démonstration :
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillAccount('admin', 'Admin123!')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#FDF2F2] border border-slate-200 hover:border-[#F6CECE] text-left transition-all group"
              >
                <div className="text-xs font-bold text-slate-800 group-hover:text-[#9E2422] transition-colors">
                  👑 Administrateur
                </div>
                <div className="text-[10px] text-slate-500 font-mono">admin / Admin123!</div>
              </button>

              <button
                type="button"
                onClick={() => fillAccount('consultation', 'Consul123!')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#F0F9F5] border border-slate-200 hover:border-[#C6E7D9] text-left transition-all group"
              >
                <div className="text-xs font-bold text-slate-800 group-hover:text-[#2D6A4F] transition-colors">
                  👁️ Consultation
                </div>
                <div className="text-[10px] text-slate-500 font-mono">consultation / Consul123!</div>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Institutional Footer */}
      <footer className="text-center text-[11px] text-slate-500 space-y-1 relative z-10">
        <div>Direction Exploitation & Distribution Électricité · Siège Régional : 10, Rue Mohamed El Kaghat, Fès</div>
        <div>Portail officiel SRM-FM : <a href="https://srm-fm.ma/" target="_blank" rel="noreferrer" className="text-[#9E2422] font-semibold hover:underline">srm-fm.ma</a> · Fax : 05 35 62 07 95</div>
      </footer>

    </div>
  );
};

export default Login;
