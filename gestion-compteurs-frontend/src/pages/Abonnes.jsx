import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Plus, Trash2, Pencil, ArrowLeft, Search, X, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Abonnes = () => {
  const { isAdmin } = useContext(AuthContext);
  const [abonnes, setAbonnes]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Formulaire create/edit
  const emptyForm = { nom: '', prenom: '', cin: '' };
  const [showForm, setShowForm]   = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = create, id = edit
  const [formData, setFormData]   = useState(emptyForm);

  // Recherche
  const [search, setSearch] = useState({ police: '', secteur: '', numeroTournee: '', ordre: '', nomPrenom: '', cin: '' });
  const [searched, setSearched] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const r = await api.get('/Abonne/search');
      setAbonnes(r.data);
    } catch { setError('Erreur de chargement.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const params = {};
      Object.entries(search).forEach(([k, v]) => { if (v.trim()) params[k] = v.trim(); });
      const r = await api.get('/Abonne/search', { params });
      setAbonnes(r.data);
    } catch { setError('Erreur lors de la recherche.'); }
    finally { setLoading(false); }
  };

  const clearSearch = () => {
    setSearch({ police: '', secteur: '', numeroTournee: '', ordre: '', nomPrenom: '', cin: '' });
    setSearched(false);
    fetchAll();
  };

  const openCreate = () => { setEditTarget(null); setFormData(emptyForm); setShowForm(true); };
  const openEdit   = (a) => { setEditTarget(a.id); setFormData({ nom: a.nom, prenom: a.prenom, cin: a.cin }); setShowForm(true); };
  const closeForm  = () => { setShowForm(false); setEditTarget(null); setFormData(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTarget) {
        await api.put(`/Abonne/${editTarget}`, { ...formData, id: editTarget });
      } else {
        await api.post('/Abonne', formData);
      }
      closeForm();
      fetchAll();
    } catch (err) {
      alert(err.response?.data || 'Une erreur est survenue.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet abonné et tous ses abonnements ?')) return;
    try { await api.delete(`/Abonne/${id}`); fetchAll(); }
    catch { alert('Erreur lors de la suppression.'); }
  };

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 bg-dark-800 text-slate-400 hover:text-white rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <User className="text-emerald-500" /> Abonnés
            </h1>
          </div>
          {isAdmin && (
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-95">
              <Plus size={18} /> Nouvel Abonné
            </button>
          )}
        </div>

        {error && <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg mb-6">{error}</div>}

        {/* Recherche multicritères */}
        <div className="glass-panel p-5 mb-6">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Search size={16} /> Recherche multicritères
          </h2>
          <form onSubmit={handleSearch} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nom / Prénom</label>
              <input className="input-field text-sm" placeholder="Ex: Ben Ali" value={search.nomPrenom}
                onChange={e => setSearch({ ...search, nomPrenom: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">CIN</label>
              <input className="input-field text-sm" placeholder="Ex: A123456" value={search.cin}
                onChange={e => setSearch({ ...search, cin: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Police</label>
              <input className="input-field text-sm" placeholder="Ex: 064179" value={search.police}
                onChange={e => setSearch({ ...search, police: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Secteur</label>
              <input className="input-field text-sm" placeholder="Ex: 064" value={search.secteur}
                onChange={e => setSearch({ ...search, secteur: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">N° Tournée</label>
              <input className="input-field text-sm" placeholder="Ex: 179" value={search.numeroTournee}
                onChange={e => setSearch({ ...search, numeroTournee: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Ordre</label>
              <input className="input-field text-sm" placeholder="Ex: 001" value={search.ordre}
                onChange={e => setSearch({ ...search, ordre: e.target.value })} />
            </div>
            <div className="col-span-2 md:col-span-3 lg:col-span-6 flex gap-3 justify-end">
              {searched && (
                <button type="button" onClick={clearSearch} className="flex items-center gap-1 px-3 py-2 text-slate-400 hover:text-white border border-slate-600 hover:border-slate-400 rounded-lg text-sm transition-colors">
                  <X size={14} /> Effacer
                </button>
              )}
              <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-all">
                <Search size={14} /> Rechercher
              </button>
            </div>
          </form>
        </div>

        {/* Formulaire create/edit */}
        {showForm && (
          <div className="glass-panel p-6 mb-6 border-emerald-500/30">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editTarget ? 'Modifier l\'abonné' : 'Nouvel Abonné'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nom</label>
                <input required className="input-field" value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} placeholder="BENALI" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Prénom</label>
                <input required className="input-field" value={formData.prenom} onChange={e => setFormData({ ...formData, prenom: e.target.value })} placeholder="Mohammed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">CIN</label>
                <input required className="input-field" value={formData.cin} onChange={e => setFormData({ ...formData, cin: e.target.value })} placeholder="A123456" />
              </div>
              <div className="md:col-span-3 flex gap-3">
                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all">
                  {editTarget ? 'Mettre à jour' : 'Enregistrer'}
                </button>
                <button type="button" onClick={closeForm} className="px-5 py-2 text-slate-400 border border-slate-600 hover:border-slate-400 rounded-lg transition-colors">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste */}
        {loading ? (
          <div className="text-slate-400 text-center py-10">Chargement...</div>
        ) : (
          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-800/50 border-b border-slate-700/50 text-slate-300 text-sm">
                  <th className="p-4 font-semibold">Prénom Nom</th>
                  <th className="p-4 font-semibold">CIN</th>
                  <th className="p-4 font-semibold">Abonnements</th>
                  {isAdmin && <th className="p-4 font-semibold">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {abonnes.length === 0 ? (
                  <tr><td colSpan="4" className="p-4 text-center text-slate-500">Aucun abonné trouvé.</td></tr>
                ) : (
                  abonnes.map(a => (
                    <React.Fragment key={a.id}>
                      <tr className="border-b border-slate-700/50 hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 text-white font-medium">{a.prenom} {a.nom}</td>
                        <td className="p-4 text-slate-300">{a.cin}</td>
                        <td className="p-4">
                          <button onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                            className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                            {a.abonnements?.length || 0} abonnement(s)
                            {expandedId === a.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                        {isAdmin && (
                          <td className="p-4 flex gap-2">
                            <button onClick={() => openEdit(a)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(a.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                          </td>
                        )}
                      </tr>
                      {expandedId === a.id && a.abonnements?.length > 0 && (
                        <tr className="bg-dark-800/30">
                          <td colSpan="4" className="px-8 py-3">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-slate-400 border-b border-slate-700/30">
                                  <th className="py-2 text-left font-medium">Police</th>
                                  <th className="py-2 text-left font-medium">Adresse</th>
                                  <th className="py-2 text-left font-medium">Agence</th>
                                  <th className="py-2 text-left font-medium">Tournée</th>
                                </tr>
                              </thead>
                              <tbody>
                                {a.abonnements.map(ab => (
                                  <tr key={ab.id} className="border-b border-slate-700/20">
                                    <td className="py-2 text-emerald-400 font-medium">{ab.police}</td>
                                    <td className="py-2 text-slate-300">{ab.adresse}</td>
                                    <td className="py-2 text-slate-400">{ab.agenceNom || ab.agenceId}</td>
                                    <td className="py-2 text-slate-400 font-mono text-xs">{ab.tourneeCode || ab.tourneeId}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Abonnes;
