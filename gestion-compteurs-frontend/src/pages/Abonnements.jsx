import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import api, { getErrorMessage } from '../services/api';
import { Plus, Trash2, Pencil, RefreshCw, X, Home } from 'lucide-react';
import { validatePolice, validateAdresse, runValidators } from '../utils/validators';

const FieldError = ({ msg }) => msg
  ? <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500 shrink-0 inline-block" />{msg}</p>
  : null;

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
  const [formErrors, setFormErrors] = useState({});

  const fetchAll = async () => {
    setLoading(true);
    setError('');
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
    } catch (err) { 
      setError(getErrorMessage(err, 'Erreur lors du chargement des abonnements.')); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditTarget(null); setFormData(emptyForm); setFormErrors({}); setShowForm(true); };
  const openEdit   = (a) => {
    setEditTarget(a.id);
    setFormData({ 
      police: a.police, 
      adresse: a.adresse, 
      abonneId: a.abonneId, 
      agenceId: a.agenceId, 
      tourneeId: a.tourneeId 
    });
    setFormErrors({});
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditTarget(null); setFormData(emptyForm); setFormErrors({}); };

  const validate = () => runValidators({
    police:  [formData.police,  validatePolice],
    adresse: [formData.adresse, validateAdresse],
  });
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (!formData.abonneId)  errors.abonneId  = 'Veuillez sélectionner un abonné.';
    if (!formData.agenceId)  errors.agenceId  = 'Veuillez sélectionner une agence.';
    if (!formData.tourneeId) errors.tourneeId = 'Veuillez sélectionner une tournée.';
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    const payload = { 
      ...formData, 
      abonneId: parseInt(formData.abonneId), 
      agenceId: parseInt(formData.agenceId), 
      tourneeId: parseInt(formData.tourneeId) 
    };
    try {
      if (editTarget) { 
        await api.put(`/Abonnement/${editTarget}`, { ...payload, id: editTarget }); 
      } else { 
        await api.post('/Abonnement', payload); 
      }
      closeForm(); 
      fetchAll();
    } catch (err) { 
      alert(getErrorMessage(err, 'Une erreur est survenue lors de l\'enregistrement.')); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet abonnement ?')) return;
    try { 
      await api.delete(`/Abonnement/${id}`); 
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Polices & Abonnements</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Gestion des contrats, adresses et rattachements SRM-FM</p>
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
                <span>Nouveau contrat</span>
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

        {/* Abonnements Table Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-niche-card overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400">Chargement des abonnements...</div>
          ) : abonnements.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Home size={32} className="mx-auto text-slate-300" />
              <div className="text-sm font-semibold text-slate-700">Aucun abonnement enregistré</div>
              <p className="text-xs text-slate-400">Ajoutez un premier contrat rattaché à un client.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="table-header">
                    <th className="p-3.5 pl-6">N° Police</th>
                    <th className="p-3.5">Abonné (Client)</th>
                    <th className="p-3.5">Adresse</th>
                    <th className="p-3.5">Agence</th>
                    <th className="p-3.5">Tournée</th>
                    {isAdmin && <th className="p-3.5 pr-6 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {abonnements.map((a) => (
                    <tr key={a.id} className="table-row">
                      <td className="p-3.5 pl-6 font-bold font-mono text-slate-900">
                        {a.police}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-900">
                        {a.abonneNomPrenom || `Abonné #${a.abonneId}`}
                      </td>
                      <td className="p-3.5 text-slate-600 max-w-xs truncate">
                        {a.adresse}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                          {a.agenceNom || `Agence #${a.agenceId}`}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-500">
                        {a.tourneeCode || `Tournée #${a.tourneeId}`}
                      </td>
                      {isAdmin && (
                        <td className="p-3.5 pr-6 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => openEdit(a)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Modifier"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
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
                  {editTarget ? 'Modifier le contrat' : 'Nouveau contrat d\'abonnement'}
                </h3>
                <button onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">N° Police * <span className="normal-case font-normal text-slate-400">(ex: POL-2025-001)</span></label>
                    <input
                      className={`input-field font-mono ${formErrors.police ? 'border-red-400 bg-red-50' : ''}`}
                      required
                      placeholder="POL-AAAA-NNNNN"
                      maxLength={100}
                      value={formData.police}
                      onChange={e => handleChange('police', e.target.value.toUpperCase())}
                    />
                    <FieldError msg={formErrors.police} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Abonné *</label>
                    <select
                      className={`input-field ${formErrors.abonneId ? 'border-red-400 bg-red-50' : ''}`}
                      required
                      value={formData.abonneId}
                      onChange={e => { setFormData({ ...formData, abonneId: e.target.value }); setFormErrors(p => ({ ...p, abonneId: null })); }}
                    >
                      <option value="">-- Sélectionner un client --</option>
                      {abonnes.map(ab => (
                        <option key={ab.id} value={ab.id}>{ab.prenom} {ab.nom} ({ab.cin})</option>
                      ))}
                    </select>
                    <FieldError msg={formErrors.abonneId} />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Adresse géographique * <span className="normal-case font-normal text-slate-400">(dans la région Fès-Meknès)</span></label>
                  <input
                    className={`input-field ${formErrors.adresse ? 'border-red-400 bg-red-50' : ''}`}
                    required
                    placeholder="ex: 12, Bd Allal Ben Abdellah, Ville Nouvelle, Fès"
                    maxLength={255}
                    value={formData.adresse}
                    onChange={e => handleChange('adresse', e.target.value)}
                  />
                  <FieldError msg={formErrors.adresse} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Agence SRM-FM *</label>
                    <select
                      className={`input-field ${formErrors.agenceId ? 'border-red-400 bg-red-50' : ''}`}
                      required
                      value={formData.agenceId}
                      onChange={e => { setFormData({ ...formData, agenceId: e.target.value }); setFormErrors(p => ({ ...p, agenceId: null })); }}
                    >
                      <option value="">-- Choisir une agence --</option>
                      {agences.map(ag => (
                        <option key={ag.id} value={ag.id}>{ag.nom}</option>
                      ))}
                    </select>
                    <FieldError msg={formErrors.agenceId} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Tournée de relève *</label>
                    <select
                      className={`input-field font-mono text-[11px] ${formErrors.tourneeId ? 'border-red-400 bg-red-50' : ''}`}
                      required
                      value={formData.tourneeId}
                      onChange={e => { setFormData({ ...formData, tourneeId: e.target.value }); setFormErrors(p => ({ ...p, tourneeId: null })); }}
                    >
                      <option value="">-- Choisir une tournée --</option>
                      {tournees.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.localisation} | {t.categorie} | {t.secteur} | {t.numeroTournee} | {t.ordre}
                        </option>
                      ))}
                    </select>
                    <FieldError msg={formErrors.tourneeId} />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button type="button" onClick={closeForm} className="btn-secondary">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    {editTarget ? 'Enregistrer' : 'Créer le contrat'}
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

export default Abonnements;
