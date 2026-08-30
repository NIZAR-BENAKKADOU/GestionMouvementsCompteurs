import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { 
  Users, Home, Zap, Building2, 
  ArrowUpRight, ArrowDownLeft, RefreshCw, Printer, Building
} from 'lucide-react';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    abonnes: [],
    abonnements: [],
    etudes: [],
    mouvements: [],
    agences: [],
    tournees: []
  });

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [abRes, aboRes, eRes, mRes, agRes, tRes] = await Promise.all([
        api.get('/Abonne').catch(() => ({ data: [] })),
        api.get('/Abonnement').catch(() => ({ data: [] })),
        api.get('/Etude').catch(() => ({ data: [] })),
        api.get('/MouvementCompteur').catch(() => ({ data: [] })),
        api.get('/Agence').catch(() => ({ data: [] })),
        api.get('/Tournee').catch(() => ({ data: [] })),
      ]);

      setData({
        abonnes: abRes.data || [],
        abonnements: aboRes.data || [],
        etudes: eRes.data || [],
        mouvements: mRes.data || [],
        agences: agRes.data || [],
        tournees: tRes.data || []
      });
    } catch (err) {
      console.error('Erreur chargement analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Calculs statistiques
  const totalMouvements = data.mouvements.length;
  const poses = data.mouvements.filter(m => m.type === 'S');
  const deposes = data.mouvements.filter(m => m.type === 'E');
  const posePct = totalMouvements ? Math.round((poses.length / totalMouvements) * 100) : 0;
  const deposePct = totalMouvements ? 100 - posePct : 0;

  // Répartition par agence
  const agenceMap = {};
  data.agences.forEach(ag => { agenceMap[ag.id] = { nom: ag.nom, count: 0 }; });
  data.abonnements.forEach(ab => {
    if (agenceMap[ab.agenceId]) {
      agenceMap[ab.agenceId].count += 1;
    }
  });
  const agenceStats = Object.values(agenceMap).sort((a, b) => b.count - a.count);

  // Répartition Type de Police
  const nouveauxAbonnements = data.etudes.filter(e => e.typePolice === 0).length;
  const reprisesAnciennePolice = data.etudes.filter(e => e.typePolice === 1).length;

  return (
    <div className="min-h-screen bg-[#F6F8FA] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-10">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Statistiques & Analyse</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">Vue d'ensemble des indicateurs techniques SRM-FM</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAllData}
              title="Actualiser"
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors shadow-niche-sm"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => window.print()}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              <Printer size={14} />
              <span>Imprimer</span>
            </button>
          </div>
        </div>

        {/* 4 Spacious Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Abonnés enregistrés', val: data.abonnes.length, icon: Users, color: 'text-slate-900' },
            { label: 'Polices actives', val: data.abonnements.length, icon: Home, color: 'text-slate-900' },
            { label: 'Opérations compteurs', val: data.mouvements.length, icon: Zap, color: 'text-slate-900' },
            { label: 'Agences SRM-FM', val: data.agences.length, icon: Building2, color: 'text-slate-900' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-niche-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{item.label}</span>
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                  <item.icon size={16} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {loading ? '—' : item.val}
              </div>
            </div>
          ))}
        </div>

        {/* 2 Chic Main Insights (Poses vs Déposes & Répartition Agences) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Operations Meter Breakdown */}
          <div className="bg-white border border-slate-200/90 p-7 rounded-3xl shadow-niche-card space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Activité des Compteurs</h2>
              <p className="text-xs text-slate-500 mt-0.5">Répartition entre les poses et les retraits de compteurs</p>
            </div>

            {/* Split Progress Bar */}
            <div className="space-y-3">
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex border border-slate-200 p-0.5">
                <div 
                  style={{ width: `${posePct}%` }} 
                  className="bg-[#2D6A4F] rounded-full transition-all duration-500" 
                  title={`Poses: ${poses.length}`}
                />
                <div 
                  style={{ width: `${deposePct}%` }} 
                  className="bg-[#9E2422] rounded-full transition-all duration-500 ml-1" 
                  title={`Déposes: ${deposes.length}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#F0F9F5] border border-[#C6E7D9] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F]">
                    <ArrowUpRight size={15} />
                    <span>Poses / Sortie</span>
                  </div>
                  <div className="text-2xl font-black text-[#2D6A4F]">{poses.length}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{posePct}% des mouvements</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FDF2F2] border border-[#F6CECE] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#9E2422]">
                    <ArrowDownLeft size={15} />
                    <span>Déposes / Entrée</span>
                  </div>
                  <div className="text-2xl font-black text-[#9E2422]">{deposes.length}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{deposePct}% des mouvements</div>
                </div>
              </div>
            </div>
          </div>

          {/* Agences Volume Breakdown */}
          <div className="bg-white border border-slate-200/90 p-7 rounded-3xl shadow-niche-card space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Répartition par Agence</h2>
              <p className="text-xs text-slate-500 mt-0.5">Volume de contrats rattachés aux agences SRM-FM</p>
            </div>

            {agenceStats.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">Aucune agence enregistrée.</div>
            ) : (
              <div className="space-y-4">
                {agenceStats.map((ag, idx) => {
                  const pct = data.abonnements.length ? Math.round((ag.count / data.abonnements.length) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-800">{ag.nom}</span>
                        <span className="font-mono text-slate-500">{ag.count} polices ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          style={{ width: `${Math.max(pct, 5)}%` }} 
                          className="h-full bg-slate-800 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Section 3: Technical Types (Nouvel Abonnement vs Ancienne Police) */}
        <div className="bg-white border border-slate-200/90 p-7 rounded-3xl shadow-niche-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Types d'Abonnements & Études</h2>
            <p className="text-xs text-slate-500 mt-0.5">Proportion des nouvelles demandes vs changements de police</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
              <span className="text-slate-600 font-medium">Nouveaux abonnements : </span>
              <strong className="text-emerald-800 font-bold ml-1">{nouveauxAbonnements}</strong>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs">
              <span className="text-slate-600 font-medium">Anciennes polices : </span>
              <strong className="text-blue-800 font-bold ml-1">{reprisesAnciennePolice}</strong>
            </div>
          </div>
        </div>

        {/* Institutional Footer */}
        <footer className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
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

export default Analytics;
