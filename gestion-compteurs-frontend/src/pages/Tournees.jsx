import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Plus, Trash2, Pencil, ArrowLeft, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tournees = () => {
  const { isAdmin } = useContext(AuthContext);
  const [tournees, setTournees] = useState([]);
  const [agences, setAgences]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const emptyForm = { localisation: '', categorie: '', secteur: '', numeroTournee: '', ordre: '', agenceId: '' };
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData]     = useState(emptyForm);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tRes, aRes] = await Promise.all([api.get('/Tournee'), api.get('/Agence')]);
      setTournees(tRes.data);
      setAgences(aRes.data);
    } catch { setError('Erreur de chargement.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditTarget(null); setFormData(emptyForm); setShowForm(true); };
  const openEdit   = (t) => {
    setEditTarget(t.id);
    setFormData({ localisation: t.localisation, categorie: t.categorie, secteur: t.secteur, numeroTournee: t.numeroTournee, ordre: t.ordre, agenceId: t.agenceId });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditTarget(null); setFormData(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, agenceId: parseInt(formData.agenceId) };
    try {
      if (editTarget) { await api.put(`/Tournee/${editTarget}`, { ...payload, id: editTarget }); }
      else             { await api.post('/Tournee', payload); }
      closeForm(); fetchAll();
    } catch (err) { alert(err.response?.data || 'Une erreur est survenue.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette tournée ?')) return;
    try { await api.delete(`/Tournee/${id}`); fetchAll(); }
    catch { alert('Erreur lors de la suppression.'); }
  };

  const codeFormat = (t) => `${t.localisation} | ${t.categorie} | ${t.secteur} | ${t.numeroTournee} | ${t.ordre}`;

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 bg-dark-800 text-slate-400 hover:text-white rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <MapPin className="text-violet-500" /> Tournées
            </h1>
          </div>
          {isAdmin && (
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-violet-500/20 active:scale-95">
              <Plus size={18} /> Nouvelle Tournée
            </button>
          )}
        </div>

        {error && <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg mb-6">{error}</div>}

        {showForm && (
          <div className="glass-panel p-6 mb-6 border-violet-500/30">
            <h2 className="text-xl font-semibold text-white mb-4">{editTarget ? 'Modifier la tournée' : 'Nouvelle Tournée'}</h2>
            <p className="text-xs text-slate-500 mb-4">Format : <span className="font-mono text-violet-400">Localisation | Catégorie | Secteur | N° Tournée | Ordre</span> — Ex: 10 | A | 064 | 179 | 001</p>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[['localisation', 'Localisation', '10'], ['categorie', 'Catégorie', 'A'], ['secteur', 'Secteur', '064'], ['numeroTournee', 'N° Tournée', '179'], ['ordre', 'Ordre', '001']].map(([key, label, ph]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
                  <input required className="input-field font-mono" value={formData[key]}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })} placeholder={ph} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Agence</label>
                <select required className="input-field" value={formData.agenceId} onChange={e => setFormData({ ...formData, agenceId: e.target.value })}>
                  <option value="">-- Sélectionner --</option>
                  {agences.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
                </select>
              </div>
              <div className="col-span-2 md:col-span-3 flex gap-3">
                <button type="submit" className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-all">
                  {editTarget ? 'Mettre à jour' : 'Enregistrer'}
                </button>
                <button type="button" onClick={closeForm} className="px-4 py-2 text-slate-400 border border-slate-600 hover:border-slate-400 rounded-lg transition-colors">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-slate-400 text-center py-10">Chargement...</div>
        ) : (
          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-800/50 border-b border-slate-700/50 text-slate-300 text-sm">
                  <th className="p-4 font-semibold">Code Tournée</th>
                  <th className="p-4 font-semibold">Agence (ID)</th>
                  {isAdmin && <th className="p-4 font-semibold">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {tournees.length === 0 ? (
                  <tr><td colSpan="3" className="p-4 text-center text-slate-500">Aucune tournée trouvée.</td></tr>
                ) : (
                  tournees.map(t => (
                    <tr key={t.id} className="border-b border-slate-700/50 hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 text-white font-mono text-sm">{codeFormat(t)}</td>
                      <td className="p-4 text-slate-400">{t.agenceId}</td>
                      {isAdmin && (
                        <td className="p-4 flex gap-2">
                          <button onClick={() => openEdit(t)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Pencil size={16} /></button>
                          <button onClick={() => handleDelete(t.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </td>
                      )}
                    </tr>
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

export default Tournees;
