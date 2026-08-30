import React, { useState, useEffect, useContext } from 'react';
import api, { getErrorMessage } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { 
  Search, Plus, Trash2, Pencil, RefreshCw, ChevronDown, ChevronUp, 
  Home, X, User
} from 'lucide-react';
import { validateNom, validatePrenom, validateCin, runValidators } from '../utils/validators';

const FieldError = ({ msg }) => msg
  ? <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500 shrink-0 inline-block" />{msg}</p>
  : null;

const Abonnes = () => {
  const { isAdmin } = useContext(AuthContext);
  const [abonnes, setAbonnes]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [expandedId, setExpandedId]   = useState(null);

  const [search, setSearch] = useState({
    nomPrenom: '',
    cin: '',
    police: '',
    secteur: '',
    numeroTournee: '',
    ordre: ''
  });
  const [searched, setSearched] = useState(false);

  const emptyForm = { nom: '', prenom: '', cin: '' };
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData]     = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const r = await api.get('/Abonne/search');
      setAbonnes(r.data);
    } catch (err) { 
      setError(getErrorMessage(err, 'Erreur lors du chargement des abonnés.')); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setError('');
    try {
      const params = {};
      Object.entries(search).forEach(([k, v]) => { if (v.trim()) params[k] = v.trim(); });
      const r = await api.get('/Abonne/search', { params });
      setAbonnes(r.data);
    } catch (err) { 
      setError(getErrorMessage(err, 'Erreur lors de la recherche.')); 
    } finally { 
      setLoading(false); 
    }
  };

  const resetSearch = () => {
    setSearch({ nomPrenom: '', cin: '', police: '', secteur: '', numeroTournee: '', ordre: '' });
    setSearched(false);
    fetchAll();
  };

  const openCreate = () => { setEditTarget(null); setFormData(emptyForm); setFormErrors({}); setShowForm(true); };
  const openEdit   = (a) => { setEditTarget(a.id); setFormData({ nom: a.nom, prenom: a.prenom, cin: a.cin }); setFormErrors({}); setShowForm(true); };
  const closeForm  = () => { setShowForm(false); setEditTarget(null); setFormData(emptyForm); setFormErrors({}); };

  const validate = () => runValidators({
    nom:    [formData.nom,    validateNom],
    prenom: [formData.prenom, validatePrenom],
    cin:    [formData.cin,    validateCin],
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error on change
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    try {
      if (editTarget) {
        await api.put(`/Abonne/${editTarget}`, { ...formData, id: editTarget });
      } else {
        await api.post('/Abonne', formData);
      }
      closeForm();
      fetchAll();
    } catch (err) {
      alert(getErrorMessage(err, 'Une erreur est survenue lors de l\'enregistrement.'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet abonné ?')) return;
    try { 
      await api.delete(`/Abonne/${id}`); 
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Répertoire des Abonnés</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Recherche multicritères et fiches clients SRM-FM</p>
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
                <span>Nouvel abonné</span>
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

        {/* Minimal Search Bar */}
        <div className="bg-white border border-slate-200/90 p-4.5 rounded-2xl shadow-niche-card">
          <form onSubmit={handleSearch} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <div>
              <input 
                className="input-field" 
                placeholder="Nom / Prénom" 
                value={search.nomPrenom}
                onChange={e => setSearch({ ...search, nomPrenom: e.target.value })} 
              />
            </div>
            <div>
              <input 
                className="input-field" 
                placeholder="N° CIN" 
                value={search.cin}
                onChange={e => setSearch({ ...search, cin: e.target.value })} 
              />
            </div>
            <div>
              <input 
                className="input-field" 
                placeholder="Police" 
                value={search.police}
                onChange={e => setSearch({ ...search, police: e.target.value })} 
              />
            </div>
            <div>
              <input 
                className="input-field" 
                placeholder="Secteur" 
                value={search.secteur}
                onChange={e => setSearch({ ...search, secteur: e.target.value })} 
              />
            </div>
            <div>
              <input 
                className="input-field" 
                placeholder="N° Tournée" 
                value={search.numeroTournee}
                onChange={e => setSearch({ ...search, numeroTournee: e.target.value })} 
              />
            </div>
            <div className="flex gap-1.5">
              <input 
                className="input-field flex-1" 
                placeholder="Ordre" 
                value={search.ordre}
                onChange={e => setSearch({ ...search, ordre: e.target.value })} 
              />
              <button 
                type="submit" 
                className="p-2.5 bg-[#9E2422] hover:bg-[#861D1B] text-white rounded-xl transition-colors shrink-0 shadow-crimson-btn"
                title="Lancer la recherche"
              >
                <Search size={14} />
              </button>
              {searched && (
                <button 
                  type="button" 
                  onClick={resetSearch} 
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors shrink-0"
                  title="Réinitialiser les filtres"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Abonnes List */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-srm-card overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400">Chargement des abonnés en cours...</div>
          ) : abonnes.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <User size={32} className="mx-auto text-slate-300" />
              <div className="text-sm font-semibold text-slate-700">Aucun abonné trouvé</div>
              <p className="text-xs text-slate-400">Modifiez vos critères de recherche ou ajoutez un nouveau client.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {abonnes.map((a) => {
                const isExp = expandedId === a.id;
                const abos = a.abonnements || [];

                return (
                  <div key={a.id} className="transition-colors hover:bg-slate-50/70">
                    <div className="p-4 sm:px-6 flex items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-semibold text-xs shrink-0">
                          {a.prenom?.charAt(0)}{a.nom?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-900 truncate">
                              {a.prenom} {a.nom}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-mono border border-slate-200">
                              {a.cin}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {abos.length === 0 
                              ? 'Aucun contrat lié' 
                              : `${abos.length} contrat${abos.length > 1 ? 's' : ''} rattaché${abos.length > 1 ? 's' : ''}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {abos.length > 0 && (
                          <button
                            onClick={() => setExpandedId(isExp ? null : a.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                          >
                            <span>{isExp ? 'Masquer' : 'Voir contrats'}</span>
                            {isExp ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>
                        )}

                        {isAdmin && (
                          <>
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
                          </>
                        )}
                      </div>

                    </div>

                    {/* Collapsible Abonnements List */}
                    {isExp && abos.length > 0 && (
                      <div className="bg-slate-50/80 px-6 py-3 border-t border-slate-100 space-y-2">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Contrats & Polices liés :
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {abos.map((ab) => (
                            <div 
                              key={ab.id} 
                              className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1 shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 font-mono">Police: {ab.police}</span>
                                <span className="text-[10px] text-slate-500 font-medium px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                                  {ab.agenceNom || `Agence #${ab.agenceId}`}
                                </span>
                              </div>
                              <div className="text-slate-600 text-[11px] flex items-center gap-1 truncate">
                                <Home size={12} className="text-slate-400 shrink-0" />
                                <span className="truncate">{ab.adresse}</span>
                              </div>
                              {ab.tourneeCode && (
                                <div className="text-[10px] text-slate-400 font-mono">
                                  Tournée : {ab.tourneeCode}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {editTarget ? 'Modifier l\'abonné' : 'Nouvel abonné'}
                </h3>
                <button onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Nom *</label>
                  <input
                    className={`input-field uppercase ${formErrors.nom ? 'border-red-400 bg-red-50 focus:ring-red-200' : ''}`}
                    required
                    placeholder="ex: ALAMI"
                    maxLength={100}
                    value={formData.nom}
                    onChange={e => handleChange('nom', e.target.value.toUpperCase())}
                  />
                  <FieldError msg={formErrors.nom} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Prénom *</label>
                  <input
                    className={`input-field ${formErrors.prenom ? 'border-red-400 bg-red-50 focus:ring-red-200' : ''}`}
                    required
                    placeholder="ex: Mohammed"
                    maxLength={100}
                    value={formData.prenom}
                    onChange={e => handleChange('prenom', e.target.value)}
                  />
                  <FieldError msg={formErrors.prenom} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">N° CIN * <span className="normal-case font-normal text-slate-400">(ex: CD123456, Z56789)</span></label>
                  <input
                    className={`input-field font-mono uppercase ${formErrors.cin ? 'border-red-400 bg-red-50 focus:ring-red-200' : ''}`}
                    required
                    placeholder="ex: CD123456"
                    maxLength={9}
                    value={formData.cin}
                    onChange={e => handleChange('cin', e.target.value.toUpperCase())}
                  />
                  <FieldError msg={formErrors.cin} />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button type="button" onClick={closeForm} className="btn-secondary">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    {editTarget ? 'Enregistrer' : 'Créer'}
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

export default Abonnes;
