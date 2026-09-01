import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import {
  Users, Home, Zap, Building2,
  ArrowUpRight, ArrowDownLeft, RefreshCw, Printer,
  Building, TrendingUp, Activity, BarChart3, PieChart
} from 'lucide-react';

/* ─── Pure-SVG Chart Primitives ─────────────────────────────── */

/** Animated SVG Donut Chart */
const DonutChart = ({ segments, size = 160, stroke = 28, label, sublabel }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  let offset = 0;
  const total = segments.reduce((s, sg) => s + sg.value, 0);
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        {segments.map((seg, i) => {
          const dash = total ? (seg.value / total) * circ : 0;
          const gap = circ - dash;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)' }}
            />
          );
          offset += dash + 3;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-2xl font-black text-white leading-none">{label}</span>
        {sublabel && <span className="text-[11px] text-slate-400 font-medium mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
};

/** SVG horizontal bar — single row */
const HBar = ({ pct, color, height = 8 }) => (
  <div className="w-full rounded-full overflow-hidden" style={{ height, background: 'rgba(255,255,255,0.06)' }}>
    <div
      className="h-full rounded-full transition-all duration-700"
      style={{ width: `${Math.max(pct, 3)}%`, background: color }}
    />
  </div>
);

/** SVG Area Sparkline */
const Sparkline = ({ data, color = '#16A34A', height = 56, width = 200 }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (v / max) * (height - 8) - 4;
    return `${x},${y}`;
  });
  const area = `M${pts[0]} L${pts.join(' L')} L${width},${height} L0,${height} Z`;
  const line = `M${pts.join(' L')}`;
  const gradId = `spark-${color.replace('#', '')}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ─── Color palette ──────────────────────────────────────────── */
const COLORS = {
  green:  '#16A34A',
  red:    '#DC2626',
  blue:   '#2563EB',
  purple: '#7C3AED',
  amber:  '#D97706',
};

const AGENCE_COLORS = [
  '#2563EB','#7C3AED','#16A34A','#D97706','#DC2626','#0891B2','#DB2777'
];

/* ─── Main Component ─────────────────────────────────────────── */
const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({
    abonnes: [], abonnements: [], etudes: [],
    mouvements: [], agences: [], tournees: []
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
        abonnes:     abRes.data  || [],
        abonnements: aboRes.data || [],
        etudes:      eRes.data   || [],
        mouvements:  mRes.data   || [],
        agences:     agRes.data  || [],
        tournees:    tRes.data   || [],
      });
    } catch (err) {
      console.error('Erreur chargement analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  /* ── Derived stats ── */
  const poses    = data.mouvements.filter(m => m.type === 'S');
  const deposes  = data.mouvements.filter(m => m.type === 'E');
  const totalMvt = data.mouvements.length;
  const posePct  = totalMvt ? Math.round((poses.length / totalMvt) * 100) : 0;
  const deposePct = totalMvt ? 100 - posePct : 0;

  // Agence breakdown
  const agenceMap = {};
  data.agences.forEach(ag => { agenceMap[ag.id] = { nom: ag.nom, count: 0 }; });
  data.abonnements.forEach(ab => { if (agenceMap[ab.agenceId]) agenceMap[ab.agenceId].count++; });
  const agenceStats = Object.values(agenceMap).sort((a, b) => b.count - a.count);

  // Tournee breakdown
  const tourneesParAgence = {};
  data.agences.forEach(ag => { tourneesParAgence[ag.id] = { nom: ag.nom, count: 0 }; });
  data.tournees.forEach(t => { if (tourneesParAgence[t.agenceId]) tourneesParAgence[t.agenceId].count++; });
  const tourneeStats = Object.values(tourneesParAgence).sort((a, b) => b.count - a.count);

  // Monthly movements (last 6 months)
  const monthlyPoses   = Array(6).fill(0);
  const monthlyDeposes = Array(6).fill(0);
  const now = new Date();
  data.mouvements.forEach(m => {
    const d = new Date(m.dateMouvement);
    const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    if (diff >= 0 && diff < 6) {
      if (m.type === 'S') monthlyPoses[5 - diff]++;
      else monthlyDeposes[5 - diff]++;
    }
  });
  const monthLabels = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return d.toLocaleString('fr-FR', { month: 'short' });
  });

  // Études breakdown
  const nouveauxAbonnements    = data.etudes.filter(e => e.typePolice === 0).length;
  const reprisesAnciennePolice = data.etudes.filter(e => e.typePolice === 1).length;
  const totalEtudes = data.etudes.length;

  const kpis = [
    { label: 'Abonnés',        val: data.abonnes.length,      icon: Users,     color: COLORS.blue,   spark: monthlyPoses,                                    sparkColor: COLORS.blue },
    { label: 'Polices Actives', val: data.abonnements.length,  icon: Home,      color: COLORS.purple, spark: monthlyDeposes,                                  sparkColor: COLORS.purple },
    { label: 'Opérations',      val: totalMvt,                 icon: Zap,       color: COLORS.green,  spark: monthlyPoses.map((v, i) => v + monthlyDeposes[i]), sparkColor: COLORS.green },
    { label: 'Agences SRM',     val: data.agences.length,      icon: Building2, color: COLORS.amber,  spark: tourneeStats.slice(0, 6).map(t => t.count),      sparkColor: COLORS.amber },
  ];

  const tabs = [
    { id: 'overview',    label: 'Vue Globale',  icon: BarChart3 },
    { id: 'mouvements',  label: 'Mouvements',   icon: Activity  },
    { id: 'repartition', label: 'Répartition',  icon: PieChart  },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)' }}>
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Tableau de bord analytique</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Statistiques &amp; Analyse</h1>
            <p className="text-sm text-slate-400 mt-0.5">Vue d'ensemble des indicateurs techniques SRM-FM</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAllData}
              title="Actualiser"
              className="p-2.5 rounded-xl border text-slate-400 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <Printer size={14} /> Imprimer
            </button>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 flex flex-col gap-3 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${k.color}22`, border: `1px solid ${k.color}44` }}
                >
                  <k.icon size={17} style={{ color: k.color }} />
                </div>
                <TrendingUp size={13} className="text-emerald-400 opacity-50" />
              </div>
              <div>
                <div className="text-3xl font-black text-white">{loading ? '—' : k.val}</div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">{k.label}</div>
              </div>
              <div className="opacity-60">
                <Sparkline data={k.spark} color={k.sparkColor} height={40} width={200} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
              style={activeTab === t.id
                ? { background: 'rgba(255,255,255,0.12)', color: 'white' }
                : { color: '#94A3B8' }}
            >
              <t.icon size={13} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ TAB: OVERVIEW ══ */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Donut Mouvements */}
            <div className="rounded-2xl p-6 flex flex-col gap-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <h2 className="text-sm font-bold text-white">Activité Compteurs</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Poses vs Déposes</p>
              </div>
              <div className="flex items-center justify-center py-2">
                <DonutChart
                  size={160} stroke={26}
                  label={totalMvt} sublabel="opérations"
                  segments={[
                    { value: poses.length,  color: COLORS.green },
                    { value: deposes.length, color: COLORS.red },
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3 space-y-1" style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)' }}>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400"><ArrowUpRight size={13}/> Poses</div>
                  <div className="text-xl font-black text-white">{poses.length}</div>
                  <div className="text-[10px] text-slate-400">{posePct}% du total</div>
                </div>
                <div className="rounded-xl p-3 space-y-1" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)' }}>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-red-400"><ArrowDownLeft size={13}/> Déposes</div>
                  <div className="text-xl font-black text-white">{deposes.length}</div>
                  <div className="text-[10px] text-slate-400">{deposePct}% du total</div>
                </div>
              </div>
            </div>

            {/* Agences Bars */}
            <div className="rounded-2xl p-6 flex flex-col gap-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <h2 className="text-sm font-bold text-white">Répartition par Agence</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Polices par agence SRM-FM</p>
              </div>
              {agenceStats.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">Aucune agence enregistrée.</div>
              ) : (
                <div className="space-y-4 flex-1">
                  {agenceStats.slice(0, 6).map((ag, idx) => {
                    const pct = data.abonnements.length ? Math.round((ag.count / data.abonnements.length) * 100) : 0;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-200 truncate max-w-[120px]">{ag.nom}</span>
                          <span className="font-mono text-slate-400 shrink-0">{ag.count} <span className="text-slate-600">({pct}%)</span></span>
                        </div>
                        <HBar pct={pct} color={AGENCE_COLORS[idx % AGENCE_COLORS.length]} height={7} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Études Donut */}
            <div className="rounded-2xl p-6 flex flex-col gap-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <h2 className="text-sm font-bold text-white">Types d'Études</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Nouvelles polices vs Reprises</p>
              </div>
              <div className="flex items-center justify-center py-2">
                <DonutChart
                  size={160} stroke={26}
                  label={totalEtudes} sublabel="études"
                  segments={[
                    { value: nouveauxAbonnements,    color: COLORS.blue },
                    { value: reprisesAnciennePolice, color: COLORS.amber },
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3 space-y-1" style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.25)' }}>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-blue-400"><Home size={12}/> Nouveaux</div>
                  <div className="text-xl font-black text-white">{nouveauxAbonnements}</div>
                  <div className="text-[10px] text-slate-400">Nouvel abonnement</div>
                </div>
                <div className="rounded-xl p-3 space-y-1" style={{ background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.25)' }}>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400"><RefreshCw size={12}/> Reprises</div>
                  <div className="text-xl font-black text-white">{reprisesAnciennePolice}</div>
                  <div className="text-[10px] text-slate-400">Ancienne police</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ══ TAB: MOUVEMENTS ══ */}
        {activeTab === 'mouvements' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Poses sparkline */}
            <div className="rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">Poses par mois</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">6 derniers mois</p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Sortie (S)
                </div>
              </div>
              <Sparkline data={monthlyPoses} color={COLORS.green} height={100} width={400} />
              <div className="flex justify-between">
                {monthLabels.map((ml, i) => (
                  <div key={i} className="text-center">
                    <div className="text-sm font-black text-white">{monthlyPoses[i]}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{ml}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Déposes sparkline */}
            <div className="rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">Déposes par mois</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">6 derniers mois</p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Entrée (E)
                </div>
              </div>
              <Sparkline data={monthlyDeposes} color={COLORS.red} height={100} width={400} />
              <div className="flex justify-between">
                {monthLabels.map((ml, i) => (
                  <div key={i} className="text-center">
                    <div className="text-sm font-black text-white">{monthlyDeposes[i]}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{ml}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Combined bars */}
            <div className="rounded-2xl p-6 flex flex-col gap-4 lg:col-span-2"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-sm font-bold text-white">Volume mensuel combiné</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Poses + Déposes sur 6 mois</p>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <span className="w-3 h-1.5 rounded-full bg-emerald-400 inline-block" /> Poses
                  </span>
                  <span className="flex items-center gap-1.5 text-red-400 font-semibold">
                    <span className="w-3 h-1.5 rounded-full bg-red-400 inline-block" /> Déposes
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {monthLabels.map((ml, i) => {
                  const posVal = monthlyPoses[i];
                  const depVal = monthlyDeposes[i];
                  const maxV   = Math.max(...monthlyPoses, ...monthlyDeposes, 1);
                  return (
                    <div key={i} className="space-y-1.5">
                      <span className="text-[10px] text-slate-500 capitalize font-semibold">{ml}</span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <HBar pct={(posVal / maxV) * 100} color={COLORS.green} height={7} />
                          <span className="text-[10px] text-slate-400 w-6 shrink-0 text-right">{posVal}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HBar pct={(depVal / maxV) * 100} color={COLORS.red} height={7} />
                          <span className="text-[10px] text-slate-400 w-6 shrink-0 text-right">{depVal}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ══ TAB: REPARTITION ══ */}
        {activeTab === 'repartition' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Agences detailed */}
            <div className="rounded-2xl p-6 flex flex-col gap-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <h2 className="text-sm font-bold text-white">Polices par Agence</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Répartition des abonnements</p>
              </div>
              <div className="space-y-5">
                {agenceStats.map((ag, idx) => {
                  const pct = data.abonnements.length ? Math.round((ag.count / data.abonnements.length) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: AGENCE_COLORS[idx % AGENCE_COLORS.length] }} />
                          <span className="font-semibold text-slate-200">{ag.nom}</span>
                        </div>
                        <span className="font-mono font-bold text-white">{ag.count}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <HBar pct={pct} color={AGENCE_COLORS[idx % AGENCE_COLORS.length]} height={8} />
                        <span className="text-[10px] text-slate-500 w-8 shrink-0 text-right">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tournées */}
            <div className="rounded-2xl p-6 flex flex-col gap-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <h2 className="text-sm font-bold text-white">Tournées par Agence</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Volume de tournées enregistrées</p>
              </div>
              <div className="space-y-5">
                {tourneeStats.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">Aucune tournée enregistrée.</div>
                ) : tourneeStats.map((t, idx) => {
                  const maxT = tourneeStats[0].count || 1;
                  const pct  = Math.round((t.count / maxT) * 100);
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: AGENCE_COLORS[idx % AGENCE_COLORS.length] }} />
                          <span className="font-semibold text-slate-200">{t.nom}</span>
                        </div>
                        <span className="font-mono font-bold text-white">{t.count}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <HBar pct={pct} color={AGENCE_COLORS[idx % AGENCE_COLORS.length]} height={8} />
                        <span className="text-[10px] text-slate-500 w-8 shrink-0 text-right">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary table */}
            <div className="rounded-2xl p-6 flex flex-col gap-4 lg:col-span-2"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <h2 className="text-sm font-bold text-white">Résumé des Indicateurs</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Tableau de synthèse global</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['Indicateur','Valeur','Détail','Tendance'].map(h => (
                        <th key={h} className="text-left py-2.5 pr-6 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { ind: 'Abonnés enregistrés',   val: data.abonnes.length,     detail: 'Total base de données',                              trend: '↑' },
                      { ind: 'Polices actives',        val: data.abonnements.length, detail: 'Contrats en cours',                                  trend: '↑' },
                      { ind: 'Opérations Compteurs',   val: totalMvt,               detail: `${poses.length} poses · ${deposes.length} déposes`, trend: '↔' },
                      { ind: 'Études réalisées',       val: totalEtudes,             detail: `${nouveauxAbonnements} nouveaux · ${reprisesAnciennePolice} reprises`, trend: '↑' },
                      { ind: 'Agences actives',        val: data.agences.length,     detail: 'Périmètre Fès-Meknès',                              trend: '—' },
                      { ind: 'Tournées planifiées',    val: data.tournees.length,    detail: 'Couverture réseau',                                  trend: '↑' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="transition-colors hover:bg-white/[0.02]">
                        <td className="py-3 pr-6 font-semibold text-slate-200">{row.ind}</td>
                        <td className="py-3 pr-6 font-black text-white text-sm">{loading ? '—' : row.val}</td>
                        <td className="py-3 pr-6 text-slate-500">{row.detail}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                            row.trend === '↑' ? 'text-emerald-400 bg-emerald-400/10' :
                            row.trend === '↔' ? 'text-amber-400 bg-amber-400/10' :
                            'text-slate-400 bg-slate-400/10'
                          }`}>{row.trend}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ── Footer ── */}
        <footer
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <Building size={13} className="text-slate-600 shrink-0" />
            <span><strong className="text-slate-500">Siège :</strong> 10, Rue Mohamed El Kaghat, B.P. 2097, Fès</span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span>Fax : 05 35 62 07 95</span>
            <span>·</span>
            <a href="https://srm-fm.ma/" target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-400 font-semibold transition-colors">
              srm-fm.ma
            </a>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default Analytics;
