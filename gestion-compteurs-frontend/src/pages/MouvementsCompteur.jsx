import React, { useState, useEffect, useContext } from 'react';
import api, { getErrorMessage } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Plus, Trash2, Pencil, RefreshCw, X, Zap, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { validateNumCompteur, validateIndexValeur, validateDateMouvement, runValidators } from '../utils/validators';

const FieldError = ({ msg }) => msg
  ? <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500 shrink-0 inline-block" />{msg}</p>
  : null;

const MouvementsCompteur = () => {
  const { isAdmin } = useContext(AuthContext);
  const [mouvements, setMouvements]   = useState([]);
  const [abonnements, setAbonnements] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  const emptyForm = { 
    numCompteur: '', 
    dateMouvement: new Date().toISOString().split('T')[0], 
    indexValeur: '', 
    type: 'S', 
    observation: '', 
    abonnementId: '' 
  };
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData]     = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [mRes, abRes] = await Promise.all([
        api.get('/MouvementCompteur'), 
        api.get('/Abonnement')
      ]);
      setMouvements(mRes.data);
      setAbonnements(abRes.data);
    } catch (err) { 
      setError(getErrorMessage(err, 'Erreur lors du chargement des mouvements.')); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditTarget(null); setFormData(emptyForm); setFormErrors({}); setShowForm(true); };
  const openEdit   = (m) => {
    setEditTarget(m.id);
    setFormData({ 
      numCompteur: m.numCompteur, 
      dateMouvement: m.dateMouvement ? m.dateMouvement.split('T')[0] : '', 
      indexValeur: m.indexValeur, 
      type: m.type, 
      observation: m.observation || '', 
      abonnementId: m.abonnementId 
    });
    setFormErrors({});
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditTarget(null); setFormData(emptyForm); setFormErrors({}); };

  const validate = () => {
    const errors = runValidators({
      numCompteur:   [formData.numCompteur,   validateNumCompteur],
      indexValeur:   [formData.indexValeur,   validateIndexValeur],
      dateMouvement: [formData.dateMouvement, validateDateMouvement],
    });
    if (!formData.abonnementId) errors.abonnementId = 'Veuillez sélectionner un abonnement.';
    return errors;
  };
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    const payload = { ...formData, abonnementId: parseInt(formData.abonnementId) };
    try {
      if (editTarget) { 
        await api.put(`/MouvementCompteur/${editTarget}`, { ...payload, id: editTarget }); 
      } else { 
        await api.post('/MouvementCompteur', payload); 
      }
      closeForm(); 
      fetchAll();
    } catch (err) { 
      alert(getErrorMessage(err, 'Une erreur est survenue lors de l\'enregistrement.')); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet enregistrement ?')) return;
    try { 
      await api.delete(`/MouvementCompteur/${id}`); 
      fetchAll(); 
    } catch (err) { 
      alert(getErrorMessage(err, 'Erreur lors de la suppression.')); 
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mouvements de Compteurs</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Historique et saisie des poses (S) et déposes (E) de compteurs SRM-FM</p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={fetchAll}
              title="Actualiser"
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors shadow-niche-sm"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            {isAdmin && (
              <button onClick={openCreate} className="btn-primary">
                <Plus size={15} />
                <span>Nouveau mouvement</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
            <span>{error}</span>
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-niche-card overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400">Chargement des mouvements...</div>
          ) : mouvements.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Zap size={32} className="mx-auto text-slate-300" />
              <div className="text-sm font-semibold text-slate-700">Aucun mouvement enregistré</div>
              <p className="text-xs text-slate-400">Enregistrez une première pose ou dépose de compteur.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="table-header">
                    <th className="p-3.5 pl-6">N° Compteur</th>
                    <th className="p-3.5">Type Opération</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Index (kWh)</th>
                    <th className="p-3.5">Police liée</th>
                    <th className="p-3.5">Observations</th>
                    {isAdmin && <th className="p-3.5 pr-6 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mouvements.map((m) => (
                    <tr key={m.id} className="table-row">
                      <td className="p-3.5 pl-6 font-bold font-mono text-slate-900">
                        {m.numCompteur}
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                          m.type === 'S' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}>
                          {m.type === 'S' ? <ArrowUpRight size={13} /> : <ArrowDownLeft size={13} />}
                          <span>{m.type === 'S' ? 'Pose (Sortie)' : 'Dépose (Entrée)'}</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                        {new Date(m.dateMouvement).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-3.5 font-bold font-mono text-slate-900">
                        {m.indexValeur} kWh
                      </td>
                      <td className="p-3.5 font-mono text-srm-red font-semibold">
                        {m.abonnementPolice || `Abo #${m.abonnementId}`}
                      </td>
                      <td className="p-3.5 text-slate-500 max-w-xs truncate">
                        {m.observation || '—'}
                      </td>
                      {isAdmin && (
                        <td className="p-3.5 pr-6 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => openEdit(m)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Modifier"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {editTarget ? 'Modifier le mouvement' : 'Enregistrer une opération compteur'}
                </h3>
                <button onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">N° Compteur * <span className="normal-case font-normal text-slate-400">(ex: CPT-ELEC-883491)</span></label>
                    <input
                      className={`input-field font-mono uppercase ${formErrors.numCompteur ? 'border-red-400 bg-red-50' : ''}`}
                      required
                      placeholder="CPT-TYPE-NNNNNN"
                      maxLength={50}
                      value={formData.numCompteur}
                      onChange={e => handleChange('numCompteur', e.target.value.toUpperCase())}
                    />
                    <FieldError msg={formErrors.numCompteur} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Abonnement (Police) *</label>
                    <select
                      className={`input-field ${formErrors.abonnementId ? 'border-red-400 bg-red-50' : ''}`}
                      required
                      value={formData.abonnementId}
                      onChange={e => { setFormData({ ...formData, abonnementId: e.target.value }); setFormErrors(p => ({ ...p, abonnementId: null })); }}
                    >
                      <option value="">-- Sélectionner un contrat --</option>
                      {abonnements.map(ab => (
                        <option key={ab.id} value={ab.id}>
                          Police: {ab.police} ({ab.adresse})
                        </option>
                      ))}
                    </select>
                    <FieldError msg={formErrors.abonnementId} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Date Opération * <span className="normal-case font-normal text-slate-400">(pas dans le futur)</span></label>
                    <input
                      type="date"
                      className={`input-field ${formErrors.dateMouvement ? 'border-red-400 bg-red-50' : ''}`}
                      required
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.dateMouvement}
                      onChange={e => handleChange('dateMouvement', e.target.value)}
                    />
                    <FieldError msg={formErrors.dateMouvement} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Index Relevé (kWh) * <span className="normal-case font-normal text-slate-400">(chiffres uniquement)</span></label>
                    <input
                      className={`input-field font-mono ${formErrors.indexValeur ? 'border-red-400 bg-red-50' : ''}`}
                      required
                      placeholder="ex: 014520"
                      maxLength={9}
                      value={formData.indexValeur}
                      onChange={e => handleChange('indexValeur', e.target.value.replace(/\D/g, ''))}
                    />
                    <FieldError msg={formErrors.indexValeur} />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Type de Mouvement *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'S' })}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        formData.type === 'S' 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ArrowUpRight size={14} />
                      <span>Pose (Sortie / S)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'E' })}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        formData.type === 'E' 
                          ? 'bg-red-50 border-red-300 text-red-800 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ArrowDownLeft size={14} />
                      <span>Dépose (Entrée / E)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Observations</label>
                  <input
                    className="input-field"
                    placeholder="Remarques techniques éventuelles..."
                    value={formData.observation}
                    onChange={e => setFormData({ ...formData, observation: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button type="button" onClick={closeForm} className="btn-secondary">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    {editTarget ? 'Enregistrer' : 'Valider l\'opération'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default MouvementsCompteur;
