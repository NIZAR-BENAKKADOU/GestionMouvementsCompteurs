import React, { useState, useEffect, useContext } from 'react';
import api, { getErrorMessage } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Plus, Trash2, Pencil, RefreshCw, X, MapPin } from 'lucide-react';
import { validateLocalisation, validateCategorie, validateSecteur, validateNumeroTournee, validateOrdre, runValidators } from '../utils/validators';

const FieldError = ({ msg }) => msg
  ? <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500 shrink-0 inline-block" />{msg}</p>
  : null;

const LOCALISATIONS = ['FES','MEK','TAZ','SEF','IFR','HAJ','BLM','MYC','TAO','MDZ'];
const CATEGORIES = ['DOM','PRO','IND'];

const Tournees = () => {
  const { isAdmin } = useContext(AuthContext);
  const [tournees, setTournees] = useState([]);
  const [agences, setAgences]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const emptyForm = { 
    localisation: '', 
    categorie: '', 
    secteur: '', 
    numeroTournee: '', 
    ordre: '', 
    agenceId: '' 
  };
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData]     = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [tRes, aRes] = await Promise.all([
        api.get('/Tournee'), 
        api.get('/Agence')
      ]);
      setTournees(tRes.data);
      setAgences(aRes.data);
    } catch (err) { 
      setError(getErrorMessage(err, 'Erreur lors du chargement des tournées.')); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditTarget(null); setFormData(emptyForm); setFormErrors({}); setShowForm(true); };
  const openEdit   = (t) => {
    setEditTarget(t.id);
    setFormData({ 
      localisation: t.localisation, 
      categorie: t.categorie, 
      secteur: t.secteur, 
      numeroTournee: t.numeroTournee, 
      ordre: t.ordre, 
      agenceId: t.agenceId 
    });
    setFormErrors({});
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditTarget(null); setFormData(emptyForm); setFormErrors({}); };

  const validate = () => {
    const errors = runValidators({
      localisation:  [formData.localisation,  validateLocalisation],
      categorie:     [formData.categorie,     validateCategorie],
      secteur:       [formData.secteur,       validateSecteur],
      numeroTournee: [formData.numeroTournee, validateNumeroTournee],
      ordre:         [formData.ordre,         validateOrdre],
    });
    if (!formData.agenceId) errors.agenceId = 'Veuillez sélectionner une agence.';
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
    const payload = { ...formData, agenceId: parseInt(formData.agenceId) };
    try {
      if (editTarget) { 
        await api.put(`/Tournee/${editTarget}`, { ...payload, id: editTarget }); 
      } else { 
        await api.post('/Tournee', payload); 
      }
      closeForm(); 
      fetchAll();
    } catch (err) { 
      alert(getErrorMessage(err, 'Une erreur est survenue lors de l\'enregistrement.')); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette tournée ?')) return;
    try { 
      await api.delete(`/Tournee/${id}`); 
      fetchAll(); 
    } catch (err) { 
      alert(getErrorMessage(err, 'Erreur lors de la suppression.')); 
    }
  };

  const codeFormat = (t) => `${t.localisation} | ${t.categorie} | ${t.secteur} | ${t.numeroTournee} | ${t.ordre}`;

  return (
    <div className="min-h-screen bg-[#F6F8FA] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tournées Techniques</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Découpage normalisé : Localisation | Catégorie | Secteur | Tournée | Ordre</p>
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
                <span>Nouvelle tournée</span>
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
            <div className="py-16 text-center text-xs text-slate-400">Chargement des tournées...</div>
          ) : tournees.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <MapPin size={32} className="mx-auto text-slate-300" />
              <div className="text-sm font-semibold text-slate-700">Aucune tournée enregistrée</div>
              <p className="text-xs text-slate-400">Ajoutez un premier circuit de relève.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="table-header">
                    <th className="p-3.5 pl-6">Code Tournée Formaté</th>
                    <th className="p-3.5">Loc.</th>
                    <th className="p-3.5">Cat.</th>
                    <th className="p-3.5">Secteur</th>
                    <th className="p-3.5">N° Tournée</th>
                    <th className="p-3.5">Ordre</th>
                    <th className="p-3.5">Agence</th>
                    {isAdmin && <th className="p-3.5 pr-6 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tournees.map((t) => (
                    <tr key={t.id} className="table-row">
                      <td className="p-3.5 pl-6 font-bold font-mono text-slate-900">
                        {codeFormat(t)}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">{t.localisation}</td>
                      <td className="p-3.5 font-mono text-slate-600">{t.categorie}</td>
                      <td className="p-3.5 font-mono text-slate-600">{t.secteur}</td>
                      <td className="p-3.5 font-mono text-slate-600">{t.numeroTournee}</td>
                      <td className="p-3.5 font-mono text-slate-600">{t.ordre}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                          {t.agenceNom || `Agence #${t.agenceId}`}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="p-3.5 pr-6 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => openEdit(t)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Modifier"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
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
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {editTarget ? 'Modifier la tournée' : 'Nouvelle tournée de relève'}
                </h3>
                <button onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Localisation *</label>
                    <select
                      className={`input-field font-mono ${formErrors.localisation ? 'border-red-400 bg-red-50' : ''}`}
                      required
                      value={formData.localisation}
                      onChange={e => handleChange('localisation', e.target.value)}
                    >
                      <option value="">-- Choisir --</option>
                      {LOCALISATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <FieldError msg={formErrors.localisation} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Catégorie *</label>
                    <select
                      className={`input-field font-mono uppercase ${formErrors.categorie ? 'border-red-400 bg-red-50' : ''}`}
                      required
                      value={formData.categorie}
                      onChange={e => handleChange('categorie', e.target.value)}
                    >
                      <option value="">-- Choisir --</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <FieldError msg={formErrors.categorie} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Secteur * <span className="normal-case font-normal text-slate-400">(ex: 01)</span></label>
                    <input
                      className={`input-field font-mono ${formErrors.secteur ? 'border-red-400 bg-red-50' : ''}`}
                      required
                      placeholder="01"
                      maxLength={2}
                      value={formData.secteur}
                      onChange={e => handleChange('secteur', e.target.value.replace(/\D/g, ''))}
                    />
                    <FieldError msg={formErrors.secteur} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">N° Tournée * <span className="normal-case font-normal text-slate-400">(3 chiffres)</span></label>
                    <input
                      className={`input-field font-mono ${formErrors.numeroTournee ? 'border-red-400 bg-red-50' : ''}`}
                      required
                      placeholder="101"
                      maxLength={3}
                      value={formData.numeroTournee}
                      onChange={e => handleChange('numeroTournee', e.target.value.replace(/\D/g, ''))}
                    />
                    <FieldError msg={formErrors.numeroTournee} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Ordre * <span className="normal-case font-normal text-slate-400">(3 chiffres)</span></label>
                    <input
                      className={`input-field font-mono ${formErrors.ordre ? 'border-red-400 bg-red-50' : ''}`}
                      required
                      placeholder="001"
                      maxLength={3}
                      value={formData.ordre}
                      onChange={e => handleChange('ordre', e.target.value.replace(/\D/g, ''))}
                    />
                    <FieldError msg={formErrors.ordre} />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Agence de rattachement *</label>
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

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button type="button" onClick={closeForm} className="btn-secondary">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    {editTarget ? 'Enregistrer' : 'Créer la tournée'}
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

export default Tournees;
