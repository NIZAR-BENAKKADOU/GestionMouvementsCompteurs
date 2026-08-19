import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Plus, Trash2, Pencil, ArrowLeft, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Etudes = () => {
  const { isAdmin } = useContext(AuthContext);
  const [etudes, setEtudes]           = useState([]);
  const [abonnements, setAbonnements] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  const emptyForm = { calibreDisjoncteur: '', typePolice: 0, numeroTravail: '', abonnementId: '', anciennePoliceId: '' };
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData]     = useState(emptyForm);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [eRes, abRes] = await Promise.all([api.get('/Etude'), api.get('/Abonnement')]);
      setEtudes(eRes.data);
      setAbonnements(abRes.data);
    } catch { setError('Erreur lors du chargement.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditTarget(null); setFormData(emptyForm); setShowForm(true); };
  const openEdit   = (e) => {
    setEditTarget(e.id);
    setFormData({ calibreDisjoncteur: e.calibreDisjoncteur, typePolice: e.typePolice, numeroTravail: e.numeroTravail || '', abonnementId: e.abonnementId, anciennePoliceId: e.anciennePoliceId || '' });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditTarget(null); setFormData(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      abonnementId:    parseInt(formData.abonnementId),
      anciennePoliceId: formData.typePolice === 0 ? null : (parseInt(formData.anciennePoliceId) || null)
    };
    try {
      if (editTarget) { await api.put(`/Etude/${editTarget}`, { ...payload, id: editTarget }); }
      else             { await api.post('/Etude', payload); }
      closeForm(); fetchAll();
    } catch (err) { alert(err.response?.data || 'Une erreur est survenue.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette étude ?')) return;
    try { await api.delete(`/Etude/${id}`); fetchAll(); }
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
              <Activity className="text-indigo-500" /> Études
            </h1>
          </div>
          {isAdmin && (
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
              <Plus size={18} /> Nouvelle Étude
            </button>
          )}
        </div>

        {error && <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg mb-6">{error}</div>}

        {showForm && (
          <div className="glass-panel p-6 mb-8 border-indigo-500/30 animate-fade-in-down">
            <h2 className="text-xl font-semibold text-white mb-4">{editTarget ? 'Modifier l\'étude' : 'Créer une Étude'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Calibre Disjoncteur</label>
                <input required type="text" className="input-field" value={formData.calibreDisjoncteur} onChange={e => setFormData({ ...formData, calibreDisjoncteur: e.target.value })} placeholder="Ex: 15A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">N° de Travail</label>
                <input type="text" className="input-field" value={formData.numeroTravail} onChange={e => setFormData({ ...formData, numeroTravail: e.target.value })} placeholder="TRV-2026-..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Type de Police</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input type="radio" name="typePolice" checked={formData.typePolice === 0} onChange={() => setFormData({ ...formData, typePolice: 0 })} className="accent-indigo-500" />
                    Nouvel Abonnement
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input type="radio" name="typePolice" checked={formData.typePolice === 1} onChange={() => setFormData({ ...formData, typePolice: 1 })} className="accent-indigo-500" />
                    Ancienne Police
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Abonnement</label>
                <select required className="input-field" value={formData.abonnementId} onChange={e => setFormData({ ...formData, abonnementId: parseInt(e.target.value) || '' })}>
                  <option value="">-- Sélectionner un abonnement --</option>
                  {abonnements.map(a => <option key={a.id} value={a.id}>{a.police} — {a.adresse}</option>)}
                </select>
              </div>
              {formData.typePolice === 1 && (
                <div className="animate-fade-in-down">
                  <label className="block text-sm font-medium text-indigo-300 mb-1">Ancienne Police</label>
                  <select required className="input-field border-indigo-500/50" value={formData.anciennePoliceId} onChange={e => setFormData({ ...formData, anciennePoliceId: parseInt(e.target.value) || '' })}>
                    <option value="">-- Sélectionner l'ancienne police --</option>
                    {abonnements.filter(a => a.id !== formData.abonnementId).map(a => <option key={a.id} value={a.id}>{a.police} — {a.adresse}</option>)}
                  </select>
                  <p className="text-xs text-indigo-400 mt-1">L'adresse et la tournée doivent correspondre.</p>
                </div>
              )}
              <div className="flex items-end gap-3 md:col-span-2">
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all">{editTarget ? 'Mettre à jour' : 'Enregistrer l\'étude'}</button>
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
                  <th className="p-4 font-semibold">N° Travail</th>
                  <th className="p-4 font-semibold">Calibre</th>
                  <th className="p-4 font-semibold">Type Police</th>
                  <th className="p-4 font-semibold">Abonnement</th>
                  <th className="p-4 font-semibold">Anc. Police</th>
                  {isAdmin && <th className="p-4 font-semibold">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {etudes.length === 0 ? (
                  <tr><td colSpan="6" className="p-4 text-center text-slate-500">Aucune étude trouvée.</td></tr>
                ) : (
                  etudes.map(etude => (
                    <tr key={etude.id} className="border-b border-slate-700/50 hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 text-white font-medium">{etude.numeroTravail || '—'}</td>
                      <td className="p-4 text-slate-300">{etude.calibreDisjoncteur}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${etude.typePolice === 0 ? 'bg-primary-500/20 text-primary-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {etude.typePolice === 0 ? 'Nouvel Abonnement' : 'Ancienne Police'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{etude.abonnementPolice || etude.abonnementId}</td>
                      <td className="p-4 text-slate-400">{etude.anciennePoliceCode || etude.anciennePoliceId || '—'}</td>
                      {isAdmin && (
                        <td className="p-4 flex gap-2">
                          <button onClick={() => openEdit(etude)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Pencil size={16} /></button>
                          <button onClick={() => handleDelete(etude.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
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

export default Etudes;
