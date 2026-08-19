import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Activity, Users, Settings, Building2, MapPin, User, ShieldCheck } from 'lucide-react';

const menuItems = [
  {
    label: 'Abonnés',
    desc: 'Consulter, ajouter, modifier et supprimer les abonnés.',
    path: '/abonnes',
    icon: User,
    color: 'emerald',
  },
  {
    label: 'Abonnements',
    desc: 'Gérer les polices, adresses et tournées.',
    path: '/abonnements',
    icon: Users,
    color: 'primary',
  },
  {
    label: 'Études',
    desc: 'Valider les nouvelles polices et anciennes références.',
    path: '/etudes',
    icon: Activity,
    color: 'indigo',
  },
  {
    label: 'Mouvements Compteur',
    desc: 'Poser ou déposer des compteurs sur les abonnements.',
    path: '/mouvements',
    icon: Settings,
    color: 'yellow',
  },
  {
    label: 'Agences',
    desc: 'Gérer les agences de la SRM-FM.',
    path: '/agences',
    icon: Building2,
    color: 'cyan',
  },
  {
    label: 'Tournées',
    desc: 'Gérer les tournées et répartitions géographiques.',
    path: '/tournees',
    icon: MapPin,
    color: 'violet',
  },
];

const colorMap = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'hover:border-emerald-500/50' },
  primary: { bg: 'bg-primary-500/10',  text: 'text-primary-500',  border: 'hover:border-primary-500/50' },
  indigo:  { bg: 'bg-indigo-500/10',   text: 'text-indigo-500',   border: 'hover:border-indigo-500/50' },
  yellow:  { bg: 'bg-yellow-500/10',   text: 'text-yellow-400',   border: 'hover:border-yellow-500/50' },
  cyan:    { bg: 'bg-cyan-500/10',     text: 'text-cyan-500',     border: 'hover:border-cyan-500/50' },
  violet:  { bg: 'bg-violet-500/10',   text: 'text-violet-500',   border: 'hover:border-violet-500/50' },
};

const Dashboard = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-slate-700/50 py-4 px-6 sticky top-0 z-10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="text-primary-500" /> Gestion des Mouvements de Compteurs
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck size={16} className={isAdmin ? 'text-emerald-400' : 'text-blue-400'} />
              <span className="text-slate-300">{user?.login}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${isAdmin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {isAdmin ? 'Administration' : 'Consultation'}
              </span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <LogOut size={18} /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="p-6 max-w-7xl mx-auto">
        {!isAdmin && (
          <div className="mb-6 px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 text-sm flex items-center gap-2">
            <ShieldCheck size={16} />
            Vous êtes en mode <strong>Consultation</strong> — les opérations de création, modification et suppression sont désactivées.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {menuItems.map(({ label, desc, path, icon: Icon, color }) => {
            const c = colorMap[color];
            return (
              <div
                key={path}
                onClick={() => navigate(path)}
                className={`glass-panel p-6 ${c.border} transition-all cursor-pointer hover:scale-[1.02] duration-200`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`p-3 ${c.bg} rounded-lg ${c.text}`}>
                    <Icon size={24} />
                  </div>
                  <h2 className="text-xl font-semibold text-white">{label}</h2>
                </div>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
