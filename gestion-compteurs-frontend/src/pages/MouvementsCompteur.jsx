import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Plus, Trash2, Pencil, ArrowLeft, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const MouvementsCompteur = () => {
  const { isAdmin } = useContext(AuthContext);
  const [mouvements, setMouvements]   = useState([]);
  const [abonnements, setAbonnements] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  const emptyForm = { numCompteur: '', dateMouvement: new Date().toISOString().split('T')[0], indexValeur: '', type: 'S', observation: '', abonnementId: '' };
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData]     = useState(emptyForm);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [mRes, abRes] = await Promise.all([api.get('/MouvementCompteur'), api.get('/Abonnement')]);
      setMouvements(mRes.data);
      setAbonnements(abRes.data);
    } catch { setError('Erreur lors du chargement.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditTarget(null); setFormData(emptyForm); setShowForm(true); };
  const openEdit   = (m) => {
    setEditTarget(m.id);
    setFormData({ numCompteur: m.numCompteur, dateMouvement: m.dateMouvement, indexValeur: m.indexValeur, type: m.type, observation: m.observation || '', abonnementId: m.abonnementId });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditTarget(null); setFormData(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, abonnementId: parseInt(formData.abonnementId) };
    try {
      if (editTarget) { await api.put(`/MouvementCompteur/${editTarget}`, { ...payload, id: editTarget }); }
      else             { await api.post('/MouvementCompteur', payload); }
      closeForm(); fetchAll();
    } catch (err) { alert(err.response?.data || 'Une erreur est survenue.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce mouvement ?')) return;
    try { await api.delete(`/MouvementCompteur/${id}`); fetchAll(); }
    catch { alert('Erreur lors de la suppression.'); }
  };

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 bg-dark-800 text-slate-400 hover:text-white rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Zap className="text-yellow-400" /> Mouvements de Compteur
            </h1>
          </div>
          {isAdmin && (
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-yellow-500/20 active:scale-95">
              <Plus size={18} /> Nouveau Mouvement
            </button>
          )}
        </div>

        {error && <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg mb-6">{error}</div>}

        {showForm && (
          <div className="glass-panel p-6 mb-8 border-yellow-500/20">
            <h2 className="text-xl font-semibold text-white mb-4">{editTarget ? 'Modifier le mouvement' : 'Enregistrer un Mouvement'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">N° Compteur</label>
                <input required type="text" className="input-field" value={formData.numCompteur} onChange={e => setFormData({ ...formData, numCompteur: e.target.value })} placeholder="Ex: CPT-001234" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Date du Mouvement</label>
                <input required type="date" className="input-field" value={formData.dateMouvement} onChange={e => setFormData({ ...formData, dateMouvement: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Index</label>
                <input required type="text" className="input-field" value={formData.indexValeur} onChange={e => setFormData({ ...formData, indexValeur: e.target.value })} placeholder="Ex: 00012345" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Abonnement (Police)</label>
                <select required className="input-field" value={formData.abonnementId} onChange={e => setFormData({ ...formData, abonnementId: e.target.value })}>
                  <option value="">-- Sélectionner --</option>
                  {abonnements.map(a => <option key={a.id} value={a.id}>{a.police} — {a.adresse}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Type de Mouvement</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value="S" checked={formData.type === 'S'} onChange={() => setFormData({ ...formData, type: 'S' })} className="accent-yellow-400" />
                    <span className="text-slate-300"><span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs mr-1">S</span>Sortie (Pose)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value="E" checked={formData.type === 'E'} onChange={() => setFormData({ ...formData, type: 'E' })} className="accent-yellow-400" />
                    <span className="text-slate-300"><span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs mr-1">E</span>Entrée (Dépose)</span>
                  </label>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Observation</label>
                <textarea className="input-field" rows={2} value={formData.observation} onChange={e => setFormData({ ...formData, observation: e.target.value })} placeholder="Remarques éventuelles..." />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-medium transition-all">{editTarget ? 'Mettre à jour' : 'Enregistrer'}</button>
                <button type="button" onClick={closeForm} className="px-4 py-2 text-slate-400 border border-slate-600 hover:border-slate-400 rounded-lg transition-colors">Annuler</button>
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
                  <th className="p-4 font-semibold">N° Compteur</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Index</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Police</th>
                  <th className="p-4 font-semibold">Observation</th>
                  {isAdmin && <th className="p-4 font-semibold">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {mouvements.length === 0 ? (
                  <tr><td colSpan="7" className="p-4 text-center text-slate-500">Aucun mouvement trouvé.</td></tr>
                ) : (
                  mouvements.map(m => (
                    <tr key={m.id} className="border-b border-slate-700/50 hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 text-white font-medium">{m.numCompteur}</td>
                      <td className="p-4 text-slate-300">{new Date(m.dateMouvement).toLocaleDateString('fr-FR')}</td>
                      <td className="p-4 text-slate-300">{m.indexValeur}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${m.type === 'S' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {m.type === 'S' ? 'S — Sortie' : 'E — Entrée'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{m.abonnementPolice || m.abonnementId}</td>
                      <td className="p-4 text-slate-400 text-sm max-w-[150px] truncate">{m.observation || '—'}</td>
                      {isAdmin && (
                        <td className="p-4 flex gap-2">
                          <button onClick={() => openEdit(m)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Pencil size={16} /></button>
                          <button onClick={() => handleDelete(m.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
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

export default MouvementsCompteur;
