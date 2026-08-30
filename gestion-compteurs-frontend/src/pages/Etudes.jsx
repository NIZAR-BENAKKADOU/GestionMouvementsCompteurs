import React, { useState, useEffect, useContext } from 'react';
import api, { getErrorMessage } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Plus, Trash2, Pencil, RefreshCw, X, Activity } from 'lucide-react';
import { validateCalibre, validateNumeroTravail, runValidators } from '../utils/validators';

const FieldError = ({ msg }) => msg
  ? <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500 shrink-0 inline-block" />{msg}</p>
  : null;

const CALIBRES = ['5A','10A','15A','20A','25A','30A','40A','45A','60A','90A','120A'];

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
  const [formErrors, setFormErrors] = useState({});

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [eRes, abRes] = await Promise.all([
        api.get('/Etude'), 
        api.get('/Abonnement')
      ]);
      setEtudes(eRes.data);
      setAbonnements(abRes.data);
    } catch (err) { 
      setError(getErrorMessage(err, 'Erreur lors du chargement des études.')); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditTarget(null); setFormData(emptyForm); setFormErrors({}); setShowForm(true); };
  const openEdit   = (e) => {
    setEditTarget(e.id);
    setFormData({ 
      calibreDisjoncteur: e.calibreDisjoncteur, 
      typePolice: e.typePolice, 
      numeroTravail: e.numeroTravail || '', 
      abonnementId: e.abonnementId, 
      anciennePoliceId: e.anciennePoliceId || '' 
    });
    setFormErrors({});
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditTarget(null); setFormData(emptyForm); setFormErrors({}); };

  const validate = () => {
    const errors = runValidators({
      calibreDisjoncteur: [formData.calibreDisjoncteur, validateCalibre],
      numeroTravail:      [formData.numeroTravail,      validateNumeroTravail],
    });
    if (!formData.abonnementId) errors.abonnementId = 'Veuillez sélectionner un abonnement.';
    if (formData.typePolice === 1 && !formData.anciennePoliceId)
      errors.anciennePoliceId = 'Veuillez sélectionner l\'ancienne police de référence.';
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
    const payload = {
      ...formData,
      abonnementId:    parseInt(formData.abonnementId),
      anciennePoliceId: formData.typePolice === 0 ? null : (parseInt(formData.anciennePoliceId) || null)
    };
    try {
      if (editTarget) { 
        await api.put(`/Etude/${editTarget}`, { ...payload, id: editTarget }); 
      } else { 
        await api.post('/Etude', payload); 
      }
      closeForm(); 
      fetchAll();
    } catch (err) { 
      alert(getErrorMessage(err, 'Une erreur est survenue lors de l\'enregistrement.')); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce dossier d\'étude ?')) return;
    try { 
      await api.delete(`/Etude/${id}`); 
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Études de Raccordement</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Dossiers de branchement, calibres et types de police SRM-FM</p>
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
                <span>Nouveau dossier</span>
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
            <div className="py-16 text-center text-xs text-slate-400">Chargement des dossiers d'études...</div>
          ) : etudes.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Activity size={32} className="mx-auto text-slate-300" />
              <div className="text-sm font-semibold text-slate-700">Aucun dossier d'étude enregistré</div>
              <p className="text-xs text-slate-400">Ajoutez une première étude technique pour un contrat.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="table-header">
                    <th className="p-3.5 pl-6">N° Dossier</th>
                    <th className="p-3.5">Police liée</th>
                    <th className="p-3.5">Calibre Disjoncteur</th>
                    <th className="p-3.5">Type de Police</th>
                    <th className="p-3.5">N° Travail</th>
                    <th className="p-3.5">Ancienne Police</th>
                    {isAdmin && <th className="p-3.5 pr-6 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {etudes.map((e) => (
                    <tr key={e.id} className="table-row">
                      <td className="p-3.5 pl-6 font-bold font-mono text-slate-500">
                        #{e.id}
                      </td>
                      <td className="p-3.5 font-bold font-mono text-slate-900">
                        {e.abonnementPolice || `Abo #${e.abonnementId}`}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-900">
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[11px]">
                          {e.calibreDisjoncteur}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                          e.typePolice === 0 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {e.typePolice === 0 ? 'Nouvel Abonnement' : 'Ancienne Police'}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">
                        {e.numeroTravail || '—'}
                      </td>
                      <td className="p-3.5 font-mono text-slate-500">
                        {e.anciennePoliceCode || (e.anciennePoliceId ? `Police #${e.anciennePoliceId}` : '—')}
                      </td>
                      {isAdmin && (
                        <td className="p-3.5 pr-6 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => openEdit(e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Modifier"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(e.id)}
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
                  {editTarget ? 'Modifier le dossier technique' : 'Nouvelle étude de raccordement'}
                </h3>
                <button onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Abonnement concerné *</label>
                  <select
                    className={`input-field ${formErrors.abonnementId ? 'border-red-400 bg-red-50' : ''}`}
                    required
                    value={formData.abonnementId}
                    onChange={e => { setFormData({ ...formData, abonnementId: e.target.value }); setFormErrors(p => ({ ...p, abonnementId: null })); }}
                  >
                    <option value="">-- Choisir un contrat --</option>
                    {abonnements.map(ab => (
                      <option key={ab.id} value={ab.id}>
                        Police: {ab.police} — {ab.abonneNomPrenom || 'Client'} ({ab.adresse})
                      </option>
                    ))}
                  </select>
                  <FieldError msg={formErrors.abonnementId} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Calibre Disjoncteur *</label>
                    <select
                      className={`input-field font-mono ${formErrors.calibreDisjoncteur ? 'border-red-400 bg-red-50' : ''}`}
                      required
                      value={formData.calibreDisjoncteur}
                      onChange={e => handleChange('calibreDisjoncteur', e.target.value)}
                    >
                      <option value="">-- Choisir un calibre --</option>
                      {CALIBRES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <FieldError msg={formErrors.calibreDisjoncteur} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">N° Travail (Bon) <span className="normal-case font-normal text-slate-400">(ex: TRV-2024-001)</span></label>
                    <input
                      className={`input-field font-mono uppercase ${formErrors.numeroTravail ? 'border-red-400 bg-red-50' : ''}`}
                      placeholder="TRV-AAAA-NNN"
                      maxLength={100}
                      value={formData.numeroTravail}
                      onChange={e => handleChange('numeroTravail', e.target.value.toUpperCase())}
                    />
                    <FieldError msg={formErrors.numeroTravail} />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Type de Police *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, typePolice: 0, anciennePoliceId: '' })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        formData.typePolice === 0 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Nouvel Abonnement
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, typePolice: 1 })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        formData.typePolice === 1 
                          ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Ancienne Police (Changement)
                    </button>
                  </div>
                </div>

                {formData.typePolice === 1 && (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Ancienne Police de référence *</label>
                    <select
                      className="input-field"
                      required
                      value={formData.anciennePoliceId}
                      onChange={e => setFormData({ ...formData, anciennePoliceId: e.target.value })}
                    >
                      <option value="">-- Sélectionner l'ancienne police --</option>
                      {abonnements
                        .filter(ab => ab.id !== parseInt(formData.abonnementId))
                        .map(ab => (
                          <option key={ab.id} value={ab.id}>
                            Police: {ab.police} — {ab.adresse}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button type="button" onClick={closeForm} className="btn-secondary">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    {editTarget ? 'Enregistrer' : 'Valider l\'étude'}
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

export default Etudes;
