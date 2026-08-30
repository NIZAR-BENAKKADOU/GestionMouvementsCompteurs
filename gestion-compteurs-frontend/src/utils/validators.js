// ============================================================
// validators.js — Règles de validation métier SRM-FM
// ============================================================

// Helpers
const isEmpty   = (v) => !v || String(v).trim() === '';
const maxLen    = (v, n) => String(v).trim().length > n;
const minLen    = (v, n) => String(v).trim().length < n;

// --- ABONNE ---
export const validateNom = (v) => {
  if (isEmpty(v))              return 'Le nom est obligatoire.';
  if (minLen(v, 2))            return 'Le nom doit comporter au moins 2 caractères.';
  if (maxLen(v, 100))          return 'Le nom ne doit pas dépasser 100 caractères.';
  if (!/^[a-zA-ZÀ-ÿ\s'\-]+$/.test(v.trim())) return 'Le nom ne peut contenir que des lettres, espaces, apostrophes ou tirets.';
  return null;
};

export const validatePrenom = (v) => {
  if (isEmpty(v))              return 'Le prénom est obligatoire.';
  if (minLen(v, 2))            return 'Le prénom doit comporter au moins 2 caractères.';
  if (maxLen(v, 100))          return 'Le prénom ne doit pas dépasser 100 caractères.';
  if (!/^[a-zA-ZÀ-ÿ\s'\-]+$/.test(v.trim())) return 'Le prénom ne peut contenir que des lettres, espaces, apostrophes ou tirets.';
  return null;
};

// CIN marocaine : 1-2 lettres + 5-7 chiffres, ex: CD123456, Z56789, K123456
export const validateCin = (v) => {
  if (isEmpty(v))              return 'Le numéro CIN est obligatoire.';
  if (!/^[A-Za-z]{1,2}\d{5,7}$/.test(v.trim())) return 'Format CIN invalide (ex: CD123456, Z56789, K12345).';
  return null;
};

// --- AGENCE ---
export const validateAgenceNom = (v) => {
  if (isEmpty(v))              return 'Le nom de l\'agence est obligatoire.';
  if (minLen(v, 5))            return 'Le nom de l\'agence doit comporter au moins 5 caractères.';
  if (maxLen(v, 150))          return 'Le nom de l\'agence ne doit pas dépasser 150 caractères.';
  if (!/Agence/i.test(v))     return 'Le nom doit commencer par "Agence" (ex: Agence Fès Ville Nouvelle).';
  return null;
};

// --- TOURNEE ---
// Localisation : 2-3 lettres majuscules, ex: FES, MEK, TAZ
const VALID_LOCALISATIONS = ['FES','MEK','TAZ','SEF','IFR','HAJ','BLM','MYC','TAO','MDZ'];
export const validateLocalisation = (v) => {
  if (isEmpty(v))              return 'La localisation est obligatoire.';
  if (!VALID_LOCALISATIONS.includes(v.trim().toUpperCase()))
    return `Localisation invalide. Valeurs acceptées : ${VALID_LOCALISATIONS.join(', ')}.`;
  return null;
};

// Catégorie : DOM, PRO, IND
const VALID_CATEGORIES = ['DOM', 'PRO', 'IND'];
export const validateCategorie = (v) => {
  if (isEmpty(v))              return 'La catégorie est obligatoire.';
  if (!VALID_CATEGORIES.includes(v.trim().toUpperCase()))
    return 'Catégorie invalide. Valeurs acceptées : DOM, PRO, IND.';
  return null;
};

// Secteur : 1-2 chiffres (01-99)
export const validateSecteur = (v) => {
  if (isEmpty(v))              return 'Le secteur est obligatoire.';
  if (!/^\d{1,2}$/.test(v.trim())) return 'Secteur invalide : 1 ou 2 chiffres (ex: 01, 02).';
  return null;
};

// N° Tournée : 3 chiffres
export const validateNumeroTournee = (v) => {
  if (isEmpty(v))              return 'Le numéro de tournée est obligatoire.';
  if (!/^\d{3}$/.test(v.trim())) return 'N° Tournée invalide : exactement 3 chiffres (ex: 101).';
  return null;
};

// Ordre : 3 chiffres
export const validateOrdre = (v) => {
  if (isEmpty(v))              return 'L\'ordre est obligatoire.';
  if (!/^\d{3}$/.test(v.trim())) return 'Ordre invalide : exactement 3 chiffres (ex: 001).';
  return null;
};

// --- ABONNEMENT ---
// Police : POL-AAAA-NNNNN ou format libre mais non vide, min 6 chars
export const validatePolice = (v) => {
  if (isEmpty(v))              return 'Le numéro de police est obligatoire.';
  if (minLen(v, 6))            return 'Le numéro de police doit comporter au moins 6 caractères.';
  if (maxLen(v, 100))          return 'Le numéro de police ne doit pas dépasser 100 caractères.';
  if (!/^[A-Za-z0-9\-]+$/.test(v.trim())) return 'Police invalide : lettres, chiffres et tirets uniquement (ex: POL-2024-001).';
  return null;
};

export const validateAdresse = (v) => {
  if (isEmpty(v))              return 'L\'adresse est obligatoire.';
  if (minLen(v, 10))           return 'L\'adresse doit comporter au moins 10 caractères.';
  if (maxLen(v, 255))          return 'L\'adresse ne doit pas dépasser 255 caractères.';
  return null;
};

// --- ETUDE ---
// Calibre disjoncteur : ex 15A, 30A, 45A, 60A, 90A, 120A
const VALID_CALIBRES = ['5A','10A','15A','20A','25A','30A','40A','45A','60A','90A','120A'];
export const validateCalibre = (v) => {
  if (isEmpty(v))              return 'Le calibre disjoncteur est obligatoire.';
  if (!VALID_CALIBRES.includes(v.trim().toUpperCase()))
    return `Calibre invalide. Valeurs acceptées : ${VALID_CALIBRES.join(', ')}.`;
  return null;
};

// N° Travail : lettres/chiffres/tirets, ex TRV-2024-001 (optionnel)
export const validateNumeroTravail = (v) => {
  if (isEmpty(v)) return null; // optionnel
  if (maxLen(v, 100))          return 'Le N° de travail ne doit pas dépasser 100 caractères.';
  if (!/^[A-Za-z0-9\-]+$/.test(v.trim())) return 'N° travail invalide : lettres, chiffres et tirets uniquement (ex: TRV-2024-001).';
  return null;
};

// --- MOUVEMENT COMPTEUR ---
// N° Compteur : format CPT-TYPE-NNNNNN
export const validateNumCompteur = (v) => {
  if (isEmpty(v))              return 'Le numéro de compteur est obligatoire.';
  if (maxLen(v, 50))           return 'Le numéro de compteur ne doit pas dépasser 50 caractères.';
  if (!/^[A-Za-z0-9\-]+$/.test(v.trim())) return 'N° compteur invalide : lettres, chiffres et tirets uniquement (ex: CPT-ELEC-883491).';
  return null;
};

// Index valeur : 1-9 chiffres (valeur relevée en kWh)
export const validateIndexValeur = (v) => {
  if (isEmpty(v))              return 'L\'index relevé est obligatoire.';
  if (!/^\d{1,9}$/.test(v.trim())) return 'Index invalide : chiffres uniquement, max 9 chiffres (ex: 014520).';
  return null;
};

// Date mouvement : pas dans le futur
export const validateDateMouvement = (v) => {
  if (isEmpty(v))              return 'La date est obligatoire.';
  const d = new Date(v);
  if (isNaN(d.getTime()))      return 'Date invalide.';
  if (d > new Date())          return 'La date de mouvement ne peut pas être dans le futur.';
  return null;
};

// Helper : runs all validators, returns { field: errorMsg } or {}
export const runValidators = (rules) => {
  const errors = {};
  for (const [field, [value, fn]] of Object.entries(rules)) {
    const err = fn(value);
    if (err) errors[field] = err;
  }
  return errors;
};
