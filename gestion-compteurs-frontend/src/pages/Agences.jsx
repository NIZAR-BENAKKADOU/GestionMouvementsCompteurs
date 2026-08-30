import React, { useState, useEffect, useContext } from 'react';
import api, { getErrorMessage } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Plus, Trash2, Pencil, RefreshCw, X, Building2 } from 'lucide-react';
import { validateAgenceNom, runValidators } from '../utils/validators';

const FieldError = ({ msg }) => msg
  ? <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500 shrink-0 inline-block" />{msg}</p>
  : null;

const Agences = () => {
  const { isAdmin } = useContext(AuthContext);
  const [agences, setAgences]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const emptyForm = { nom: '' };
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData]     = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try { 
      const r = await api.get('/Agence'); 
      setAgences(r.data); 
    } catch (err) { 
      setError(getErrorMessage(err, 'Erreur lors du chargement des agences.')); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditTarget(null); setFormData(emptyForm); setFormErrors({}); setShowForm(true); };
  const openEdit   = (a) => { setEditTarget(a.id); setFormData({ nom: a.nom }); setFormErrors({}); setShowForm(true); };
  const closeForm  = () => { setShowForm(false); setEditTarget(null); setFormData(emptyForm); setFormErrors({}); };

  const validate = () => runValidators({ nom: [formData.nom, validateAgenceNom] });
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    try {
      if (editTarget) { 
        await api.put(`/Agence/${editTarget}`, { ...formData, id: editTarget }); 
      } else { 
        await api.post('/Agence', formData); 
      }
      closeForm(); 
      fetchAll();
    } catch (err) { 
      alert(getErrorMessage(err, 'Une erreur est survenue lors de l\'enregistrement.')); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette agence ?')) return;
    try { 
      await api.delete(`/Agence/${id}`); 
      fetchAll(); 
    } catch (err) { 
      alert(getErrorMessage(err, 'Erreur lors de la suppression.')); 
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agences Régionales</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Points de service SRM-FM de la région Fès - Meknès</p>
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
                <span>Nouvelle agence</span>
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
            <div className="py-16 text-center text-xs text-slate-400">Chargement des agences...</div>
          ) : agences.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Building2 size={32} className="mx-auto text-slate-300" />
              <div className="text-sm font-semibold text-slate-700">Aucune agence enregistrée</div>
              <p className="text-xs text-slate-400">Créez votre première agence SRM-FM.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="table-header">
                    <th className="p-3.5 pl-6">ID</th>
                    <th className="p-3.5">Nom de l'Agence</th>
                    {isAdmin && <th className="p-3.5 pr-6 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agences.map((a) => (
                    <tr key={a.id} className="table-row">
                      <td className="p-3.5 pl-6 font-mono text-slate-400">
                        #{a.id}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                          <Building2 size={14} />
                        </div>
                        <span>{a.nom}</span>
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
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {editTarget ? 'Modifier l\'agence' : 'Nouvelle agence'}
                </h3>
                <button onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Nom de l'agence * <span className="normal-case font-normal text-slate-400">(ex: Agence Fès Ville Nouvelle)</span></label>
                  <input
                    className={`input-field ${formErrors.nom ? 'border-red-400 bg-red-50' : ''}`}
                    required
                    placeholder="Agence ..."
                    maxLength={150}
                    value={formData.nom}
                    onChange={e => handleChange('nom', e.target.value)}
                  />
                  <FieldError msg={formErrors.nom} />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button type="button" onClick={closeForm} className="btn-secondary">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    {editTarget ? 'Enregistrer' : 'Créer l\'agence'}
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

export default Agences;
