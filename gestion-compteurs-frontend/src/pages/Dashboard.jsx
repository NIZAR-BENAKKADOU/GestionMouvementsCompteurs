import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { 
  Users, Home, Activity, Zap, Building2, MapPin, 
  ArrowUpRight, ArrowDownLeft, Clock, Building, ExternalLink, ShieldCheck,
  BarChart3, Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    abonnes: 0,
    abonnements: 0,
    etudes: 0,
    mouvements: 0,
    agences: 0,
    tournees: 0,
    poses: 0,
    deposes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [abRes, aboRes, eRes, mRes, agRes, tRes] = await Promise.all([
          api.get('/Abonne').catch(() => ({ data: [] })),
          api.get('/Abonnement').catch(() => ({ data: [] })),
          api.get('/Etude').catch(() => ({ data: [] })),
          api.get('/MouvementCompteur').catch(() => ({ data: [] })),
          api.get('/Agence').catch(() => ({ data: [] })),
          api.get('/Tournee').catch(() => ({ data: [] })),
        ]);

        const mouvements = mRes.data || [];
        const poses = mouvements.filter(m => m.type === 'S').length;
        const deposes = mouvements.filter(m => m.type === 'E').length;

        setStats({
          abonnes: abRes.data.length,
          abonnements: aboRes.data.length,
          etudes: eRes.data.length,
          mouvements: mouvements.length,
          agences: agRes.data.length,
          tournees: tRes.data.length,
          poses,
          deposes,
        });
      } catch (err) {
        console.error('Stats loading error', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const totalMoves = stats.poses + stats.deposes || 1;
  const posePercentage = Math.round((stats.poses / totalMoves) * 100);

  const modules = [
    {
      title: 'Gestion des Abonnés',
      desc: 'Répertoire des clients (Nom, Prénom, CIN) et recherche multicritères.',
      path: '/abonnes',
      icon: Users,
      count: stats.abonnes,
      countLabel: 'clients',
      accentColor: '#2D6A4F',
      badgeBg: '#F0F9F5',
      badgeBorder: '#C6E7D9',
    },
    {
      title: 'Polices & Abonnements',
      desc: 'Contrats, adresses géographiques, tournées et agences de rattachement.',
      path: '/abonnements',
      icon: Home,
      count: stats.abonnements,
      countLabel: 'polices',
      accentColor: '#9E2422',
      badgeBg: '#FDF2F2',
      badgeBorder: '#F6CECE',
    },
    {
      title: 'Études de Branchement',
      desc: 'Calibre disjoncteur, nouveaux abonnements & reprises d\'anciennes polices.',
      path: '/etudes',
      icon: Activity,
      count: stats.etudes,
      countLabel: 'dossiers',
      accentColor: '#4338CA',
      badgeBg: '#EEF2FF',
      badgeBorder: '#C7D2FE',
    },
    {
      title: 'Mouvements de Compteurs',
      desc: 'Historique et saisie des poses (Sortie) et déposes (Entrée) avec index.',
      path: '/mouvements',
      icon: Zap,
      count: stats.mouvements,
      countLabel: 'opérations',
      accentColor: '#B8860B',
      badgeBg: '#FEF9EE',
      badgeBorder: '#F9E4B7',
    },
    {
      title: 'Agences Régionales',
      desc: 'Points de service SRM-FM de la région Fès - Meknès.',
      path: '/agences',
      icon: Building2,
      count: stats.agences,
      countLabel: 'agences',
      accentColor: '#0E7490',
      badgeBg: '#ECFEFF',
      badgeBorder: '#A5F3FC',
    },
    {
      title: 'Tournées Techniques',
      desc: 'Découpage normalisé : Localisation | Catégorie | Secteur | Tournée | Ordre.',
      path: '/tournees',
      icon: MapPin,
      count: stats.tournees,
      countLabel: 'circuits',
      accentColor: '#6D28D9',
      badgeBg: '#F5F3FF',
      badgeBorder: '#DDD6FE',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8FA] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 space-y-10">
        
        {/* SRM-FM Executive Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 shadow-niche-card">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
            
            <div className="flex items-start gap-6">
              <div className="bg-white p-4 rounded-3xl shadow-niche-card border border-slate-200/90 shrink-0 transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/srm-logo.png" 
                  alt="SRM Fès-Meknès" 
                  className="h-20 w-auto object-contain" 
                />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-[#FDF2F2] text-[#9E2422] border border-[#F6CECE]">
                    الشركة الجهوية متعددة الخدمات فاس - مكناس
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">Direction Distribution Électricité</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Espace Gestion Technique des Compteurs
                </h1>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed font-medium">
                  Supervision des opérations de comptage et gestion des abonnés sur l'ensemble de la région Fès-Meknès (Préfectures de Fès et Meknès, Provinces de Sefrou, El Hajeb, Moulay Yacoub, Ifrane, Boulemane, Taza, Taounate).
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={() => navigate('/analytics')}
                className="btn-primary flex items-center justify-center gap-2 py-3 px-5 text-xs font-bold"
              >
                <BarChart3 size={16} />
                <span>Voir les Analyses</span>
              </button>
              <a 
                href="https://srm-fm.ma/" 
                target="_blank" 
                rel="noreferrer"
                className="btn-secondary text-xs flex items-center justify-center gap-1.5"
              >
                <span>Site SRM-FM</span>
                <ExternalLink size={13} />
              </a>
            </div>

          </div>

          {!isAdmin && (
            <div className="mt-8 p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2.5 font-medium">
              <ShieldCheck size={18} className="text-blue-600 shrink-0" />
              <span>Session active en <strong>Mode Consultation</strong> — Consultation et recherche autorisées.</span>
            </div>
          )}
        </div>

        {/* Quick Analytics Teaser Card */}
        <div 
          onClick={() => navigate('/analytics')}
          className="bg-gradient-to-r from-white via-white to-[#FAFBFD] border border-slate-200/90 hover:border-[#9E2422]/40 p-6 rounded-3xl cursor-pointer shadow-niche-card hover:shadow-niche-card-hover transition-all duration-200 group flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF2F2] border border-[#F6CECE] flex items-center justify-center text-[#9E2422] group-hover:scale-110 transition-transform">
              <BarChart3 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#9E2422] transition-colors">
                  Statistiques & Analyses Décisionnelles
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF9EE] text-[#B8860B] border border-[#F9E4B7]">
                  Rapport complet
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Consultez la répartition par agence, l'évolution des poses ({posePercentage}%) vs déposes, les calibres et circuits de relève.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#9E2422] shrink-0 group-hover:translate-x-1 transition-transform">
            <span>Ouvrir les statistiques complètes</span>
            <ArrowUpRight size={16} />
          </div>
        </div>

        {/* Operational Modules Navigation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Modules d'exploitation</span>
            <span className="text-xs text-slate-400 font-semibold">6 modules disponibles</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((m, idx) => (
              <div
                key={idx}
                onClick={() => navigate(m.path)}
                className="bg-white hover:bg-[#FAFBFD] border border-slate-200/90 p-6 rounded-3xl cursor-pointer transition-all duration-200 flex flex-col justify-between group shadow-niche-card hover:shadow-niche-card-hover hover:-translate-y-1"
                style={{ borderTop: `3.5px solid ${m.accentColor}` }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold transition-all shadow-niche-sm"
                      style={{ backgroundColor: m.badgeBg, color: m.accentColor, border: `1px solid ${m.badgeBorder}` }}
                    >
                      <m.icon size={20} />
                    </div>
                    <span 
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: m.badgeBg, color: m.accentColor, border: `1px solid ${m.badgeBorder}` }}
                    >
                      {m.count} {m.countLabel}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 group-hover:text-[#9E2422] transition-colors flex items-center justify-between">
                    <span>{m.title}</span>
                    <ArrowUpRight size={16} className="text-slate-400 group-hover:text-[#9E2422] transition-colors" />
                  </h2>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-normal">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                  <span>Accéder au module</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Institutional Footer */}
        <footer className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <Building size={14} className="text-slate-400 shrink-0" />
            <span><strong>Siège :</strong> 10, Rue Mohamed El Kaghat, B.P. 2097, Fès</span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span>Fax : 05 35 62 07 95</span>
            <span>·</span>
            <a href="https://srm-fm.ma/" target="_blank" rel="noreferrer" className="text-[#9E2422] font-semibold hover:underline">
              srm-fm.ma
            </a>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default Dashboard;
