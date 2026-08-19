import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { Plus, Trash2, Pencil, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Abonnements = () => {
  const { isAdmin } = useContext(AuthContext);
  const [abonnements, setAbonnements] = useState([]);
  const [abonnes, setAbonnes]         = useState([]);
  const [agences, setAgences]         = useState([]);
  const [tournees, setTournees]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  const emptyForm = { police: '', adresse: '', abonneId: '', agenceId: '', tourneeId: '' };
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData]     = useState(emptyForm);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [aboRes, abRes, agRes, tRes] = await Promise.all([
        api.get('/Abonnement'),
        api.get('/Abonne'),
        api.get('/Agence'),
        api.get('/Tournee')
      ]);
      setAbonnements(aboRes.data);
      setAbonnes(abRes.data);
      setAgences(agRes.data);
      setTournees(tRes.data);
    } catch { setError('Erreur lors du chargement.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditTarget(null); setFormData(emptyForm); setShowForm(true); };
  const openEdit   = (a) => {
    setEditTarget(a.id);
    setFormData({ police: a.police, adresse: a.adresse, abonneId: a.abonneId, agenceId: a.agenceId, tourneeId: a.tourneeId });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditTarget(null); setFormData(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, abonneId: parseInt(formData.abonneId), agenceId: parseInt(formData.agenceId), tourneeId: parseInt(formData.tourneeId) };
    try {
      if (editTarget) { await api.put(`/Abonnement/${editTarget}`, { ...payload, id: editTarget }); }
      else             { await api.post('/Abonnement', payload); }
      closeForm(); fetchAll();
    } catch (err) { alert(err.response?.data || 'Une erreur est survenue.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet abonnement ?')) return;
    try { await api.delete(`/Abonnement/${id}`); fetchAll(); }
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
              <Home className="text-primary-500" /> Abonnements
            </h1>
          </div>
          {isAdmin && (
            <button onClick={openCreate} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Nouvel Abonnement
            </button>
          )}
        </div>

        {error && <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg mb-6">{error}</div>}

        {showForm && (
          <div className="glass-panel p-6 mb-8 animate-fade-in-down">
            <h2 className="text-xl font-semibold text-white mb-4">{editTarget ? 'Modifier l\'abonnement' : 'Créer un Abonnement'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Police</label>
                <input required type="text" className="input-field" value={formData.police} onChange={e => setFormData({ ...formData, police: e.target.value })} placeholder="Ex: POL-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Adresse</label>
                <input required type="text" className="input-field" value={formData.adresse} onChange={e => setFormData({ ...formData, adresse: e.target.value })} placeholder="Adresse complète" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Abonné</label>
                <select required className="input-field" value={formData.abonneId} onChange={e => setFormData({ ...formData, abonneId: e.target.value })}>
                  <option value="">-- Sélectionner --</option>
                  {abonnes.map(a => <option key={a.id} value={a.id}>{a.prenom} {a.nom} — {a.cin}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Agence</label>
                <select required className="input-field" value={formData.agenceId} onChange={e => setFormData({ ...formData, agenceId: e.target.value })}>
                  <option value="">-- Sélectionner --</option>
                  {agences.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Tournée</label>
                <select required className="input-field" value={formData.tourneeId} onChange={e => setFormData({ ...formData, tourneeId: e.target.value })}>
                  <option value="">-- Sélectionner --</option>
                  {tournees.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.localisation} | {t.categorie} | {t.secteur} | {t.numeroTournee} | {t.ordre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-3 md:col-span-2">
                <button type="submit" className="btn-primary">{editTarget ? 'Mettre à jour' : 'Enregistrer'}</button>
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
                  <th className="p-4 font-semibold">Police</th>
                  <th className="p-4 font-semibold">Adresse</th>
                  <th className="p-4 font-semibold">Abonné</th>
                  <th className="p-4 font-semibold">Agence</th>
                  <th className="p-4 font-semibold">Tournée</th>
                  {isAdmin && <th className="p-4 font-semibold">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {abonnements.length === 0 ? (
                  <tr><td colSpan="6" className="p-4 text-center text-slate-500">Aucun abonnement trouvé.</td></tr>
                ) : (
                  abonnements.map(abo => (
                    <tr key={abo.id} className="border-b border-slate-700/50 hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 text-white font-medium">{abo.police}</td>
                      <td className="p-4 text-slate-300 text-sm">{abo.adresse}</td>
                      <td className="p-4 text-slate-300">{abo.abonneNomPrenom || abo.abonneId}</td>
                      <td className="p-4 text-slate-400">{abo.agenceNom || abo.agenceId}</td>
                      <td className="p-4 text-slate-400 font-mono text-xs">{abo.tourneeCode || abo.tourneeId}</td>
                      {isAdmin && (
                        <td className="p-4 flex gap-2">
                          <button onClick={() => openEdit(abo)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Pencil size={16} /></button>
                          <button onClick={() => handleDelete(abo.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
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

export default Abonnements;
