import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Plus, Trash2, Pencil, ArrowLeft, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Agences = () => {
  const { isAdmin } = useContext(AuthContext);
  const [agences, setAgences]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const emptyForm = { nom: '' };
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData]     = useState(emptyForm);

  const fetchAll = async () => {
    setLoading(true);
    try { const r = await api.get('/Agence'); setAgences(r.data); }
    catch { setError('Erreur de chargement.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditTarget(null); setFormData(emptyForm); setShowForm(true); };
  const openEdit   = (a) => { setEditTarget(a.id); setFormData({ nom: a.nom }); setShowForm(true); };
  const closeForm  = () => { setShowForm(false); setEditTarget(null); setFormData(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTarget) { await api.put(`/Agence/${editTarget}`, { ...formData, id: editTarget }); }
      else             { await api.post('/Agence', formData); }
      closeForm(); fetchAll();
    } catch (err) { alert(err.response?.data || 'Une erreur est survenue.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette agence ?')) return;
    try { await api.delete(`/Agence/${id}`); fetchAll(); }
    catch { alert('Erreur lors de la suppression.'); }
  };

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 bg-dark-800 text-slate-400 hover:text-white rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Building2 className="text-cyan-500" /> Agences
            </h1>
          </div>
          {isAdmin && (
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/20 active:scale-95">
              <Plus size={18} /> Nouvelle Agence
            </button>
          )}
        </div>

        {error && <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg mb-6">{error}</div>}

        {showForm && (
          <div className="glass-panel p-6 mb-6 border-cyan-500/30">
            <h2 className="text-xl font-semibold text-white mb-4">{editTarget ? 'Modifier l\'agence' : 'Nouvelle Agence'}</h2>
            <form onSubmit={handleSubmit} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-1">Nom de l'agence</label>
                <input required className="input-field" value={formData.nom} onChange={e => setFormData({ nom: e.target.value })} placeholder="Ex: Agence Fès Centre" />
              </div>
              <button type="submit" className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-all">
                {editTarget ? 'Mettre à jour' : 'Enregistrer'}
              </button>
              <button type="button" onClick={closeForm} className="px-4 py-2 text-slate-400 border border-slate-600 hover:border-slate-400 rounded-lg transition-colors">
                Annuler
              </button>
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
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Nom de l'agence</th>
                  {isAdmin && <th className="p-4 font-semibold">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {agences.length === 0 ? (
                  <tr><td colSpan="3" className="p-4 text-center text-slate-500">Aucune agence trouvée.</td></tr>
                ) : (
                  agences.map(a => (
                    <tr key={a.id} className="border-b border-slate-700/50 hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 text-slate-500 text-sm">{a.id}</td>
                      <td className="p-4 text-white font-medium">{a.nom}</td>
                      {isAdmin && (
                        <td className="p-4 flex gap-2">
                          <button onClick={() => openEdit(a)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Pencil size={16} /></button>
                          <button onClick={() => handleDelete(a.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
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

export default Agences;
