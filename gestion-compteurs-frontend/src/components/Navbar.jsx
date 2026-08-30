import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CommandPalette from './CommandPalette';
import { 
  Users, Home, Activity, Zap, Building2, MapPin, 
  LogOut, LayoutDashboard, Search, BarChart3
} from 'lucide-react';

const navLinks = [
  { label: 'Aperçu',      path: '/dashboard',   icon: LayoutDashboard },
  { label: 'Analyses',    path: '/analytics',   icon: BarChart3 },
  { label: 'Abonnés',     path: '/abonnes',     icon: Users },
  { label: 'Abonnements', path: '/abonnements', icon: Home },
  { label: 'Études',      path: '/etudes',      icon: Activity },
  { label: 'Mouvements',  path: '/mouvements',  icon: Zap },
  { label: 'Agences',     path: '/agences',     icon: Building2 },
  { label: 'Tournées',    path: '/tournees',    icon: MapPin },
];

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-niche-sm">
        
        {/* Moroccan Logo Tricolor Accent Bar (Terracotta Red - Amber Gold - Zellige Green) */}
        <div className="h-[2.5px] w-full bg-gradient-to-r from-[#9E2422] via-[#C59B27] to-[#2D6A4F]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* SRM-FM Brand & Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 shrink-0 group">
              <div className="bg-white p-1 rounded-xl shadow-niche-sm border border-slate-200/80 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <img 
                  src="/srm-logo.png" 
                  alt="SRM Fès-Meknès" 
                  className="h-10 w-auto object-contain" 
                />
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2">
                  <span>SRM-FM</span>
                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-[#FDF2F2] text-[#9E2422] border border-[#F6CECE]">
                    Électricité
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Société Régionale Multiservices</p>
              </div>
            </Link>

            {/* Navigation Items (Segmented Niche Bar) */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#F1F5F9]/80 p-1 rounded-xl border border-slate-200/80">
              {navLinks.map(({ label, path }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#9E2422] text-white shadow-crimson-btn'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Search (Cmd+K) & User profile */}
            <div className="flex items-center gap-2.5">
              
              {/* Spotlight Search Button */}
              <button
                onClick={() => setIsCommandOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-500 hover:text-slate-800 transition-all shadow-niche-sm"
              >
                <Search size={13} className="text-slate-400" />
                <span className="hidden md:inline text-[11px] font-medium">Rechercher...</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200">
                  ⌘K
                </span>
              </button>

              {/* User role pill */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-niche-sm">
                <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-[#2D6A4F]' : 'bg-blue-500'}`}></span>
                <span className="font-bold text-slate-800">{user?.login}</span>
                <span className="text-slate-400 text-[10px]">({isAdmin ? 'Admin' : 'Lecture'})</span>
              </div>

              <button
                onClick={handleLogout}
                title="Se déconnecter"
                className="p-2 rounded-xl text-slate-400 hover:text-[#9E2422] hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Spotlight Command Palette Modal */}
      <CommandPalette isOpen={isCommandOpen} onClose={setIsCommandOpen} />
    </>
  );
};

export default Navbar;
