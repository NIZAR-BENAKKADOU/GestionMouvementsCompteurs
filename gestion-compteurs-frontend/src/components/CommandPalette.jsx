import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Users, Home, Activity, Zap, Building2, MapPin, X, CornerDownLeft } from 'lucide-react';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const navShortcuts = [
    { title: 'Aperçu général', path: '/dashboard', icon: Home },
    { title: 'Statistiques & Analyses', path: '/analytics', icon: Activity },
    { title: 'Abonnés (Clients)', path: '/abonnes', icon: Users },
    { title: 'Abonnements (Polices)', path: '/abonnements', icon: Home },
    { title: 'Études de raccordement', path: '/etudes', icon: Activity },
    { title: 'Mouvements de Compteurs', path: '/mouvements', icon: Zap },
    { title: 'Agences SRM-FM', path: '/agences', icon: Building2 },
    { title: 'Tournées Techniques', path: '/tournees', icon: MapPin },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [abRes, mRes] = await Promise.all([
          api.get(`/Abonne/search?nomPrenom=${encodeURIComponent(query)}&police=${encodeURIComponent(query)}&cin=${encodeURIComponent(query)}`).catch(() => ({ data: [] })),
          api.get('/MouvementCompteur').catch(() => ({ data: [] }))
        ]);

        const matchingMouvements = (mRes.data || [])
          .filter(m => m.numCompteur.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 3)
          .map(m => ({
            id: `m-${m.id}`,
            title: `Compteur ${m.numCompteur} (${m.type === 'S' ? 'Pose' : 'Dépose'})`,
            subtitle: `Index: ${m.indexValeur} kWh · ${m.abonnementPolice || 'Abo #' + m.abonnementId}`,
            path: '/mouvements',
            icon: Zap
          }));

        const matchingAbonnes = (abRes.data || []).slice(0, 5).map(a => ({
          id: `a-${a.id}`,
          title: `${a.prenom} ${a.nom} (${a.cin})`,
          subtitle: a.abonnements?.length > 0 ? `Polices: ${a.abonnements.map(ab => ab.police).join(', ')}` : 'Aucun abonnement',
          path: '/abonnes',
          icon: Users
        }));

        setResults([...matchingAbonnes, ...matchingMouvements]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (path) => {
    navigate(path);
    onClose(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un abonné, une police, un N° de compteur..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          ) : (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
              ESC
            </span>
          )}
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {loading && (
            <div className="p-4 text-center text-xs text-slate-400">Recherche instantanée en cours...</div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-6 text-center text-xs text-slate-500">
              Aucun résultat pour "{query}".
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-1 mb-3">
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Résultats correspondants
              </div>
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelect(r.path)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-red-50 group-hover:text-srm-red transition-colors">
                      <r.icon size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{r.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{r.subtitle}</div>
                    </div>
                  </div>
                  <CornerDownLeft size={13} className="text-slate-400 group-hover:text-slate-600" />
                </button>
              ))}
            </div>
          )}

          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Accès rapide
            </div>
            {navShortcuts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(s.path)}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <s.icon size={14} className="text-slate-400 group-hover:text-srm-red" />
                  <span className="text-xs text-slate-700 group-hover:text-slate-900 font-medium">{s.title}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Aller →</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Conseil : utilisez <strong className="text-slate-600">↑ ↓</strong> et <strong className="text-slate-600">Entrée</strong></span>
          <span className="font-mono text-slate-700 font-medium">SRM-FM Spotlight</span>
        </div>

      </div>
    </div>
  );
};

export default CommandPalette;
