-- ============================================================================
-- SCRIPT D'INSERTION DE DONNEES DE TEST - GESTION DES MOUVEMENTS DE COMPTEURS
-- Région : Fès - Meknès (Fès, Meknès, Taza, Sefrou, Ifrane, El Hajeb,
--                         Boulemane, Moulay Yaâcoub, Taounate, Moulay Driss Zerhoun)
-- Base de données : GestionCompteursDB
-- Ce script est 100% aligné avec le schéma réel et les entités EF Core.
-- IMPORTANT : Exécuter cleanup_and_seed_fes_meknes.sql pour nettoyer la BD
--             avant de rejouer ce script sur une BD existante.
-- ============================================================================

USE GestionCompteursDB;
GO

-- ============================================================================
-- 1. TABLE : UTILISATEUR (Comptes de connexion)
-- Mots de passe hashés avec BCrypt
-- admin        -> Admin123!   (Role: Administration)
-- consultation -> Consul123!  (Role: Consultation)
-- ============================================================================
IF NOT EXISTS (SELECT 1 FROM UTILISATEUR WHERE login = 'admin')
BEGIN
    INSERT INTO UTILISATEUR (login, password_hash, role)
    VALUES ('admin', '$2a$11$eU1tFv20U6cKjVbU3Kq1yO9g5M9wP4hA3/LgQG1TjJ7q2C7Lh4W0q', 'Administration');
END

IF NOT EXISTS (SELECT 1 FROM UTILISATEUR WHERE login = 'consultation')
BEGIN
    INSERT INTO UTILISATEUR (login, password_hash, role)
    VALUES ('consultation', '$2a$11$eU1tFv20U6cKjVbU3Kq1yO9g5M9wP4hA3/LgQG1TjJ7q2C7Lh4W0q', 'Consultation');
END
GO

-- ============================================================================
-- 2. TABLE : AGENCE (id, nom)
-- 11 agences couvrant les 10 villes de la région Fès-Meknès
-- ============================================================================
-- Ajouter la colonne agence_id sur TOURNEE si elle n'existe pas encore
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('TOURNEE') AND name = 'agence_id')
BEGIN
    ALTER TABLE TOURNEE ADD agence_id INT NOT NULL DEFAULT 0;
END
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Tournee_Agence')
BEGIN
    ALTER TABLE TOURNEE ADD CONSTRAINT FK_Tournee_Agence
        FOREIGN KEY (agence_id) REFERENCES AGENCE(id);
END
GO
SET IDENTITY_INSERT AGENCE ON;

MERGE INTO AGENCE AS target
USING (VALUES
    (1,  N'Agence Fès Ville Nouvelle'),
    (2,  N'Agence Fès Médina'),
    (3,  N'Agence Meknès Hamria'),
    (4,  N'Agence Taza Centre'),
    (5,  N'Agence Sefrou Ville'),
    (6,  N'Agence Ifrane Centre'),
    (7,  N'Agence El Hajeb Ville'),
    (8,  N'Agence Boulemane'),
    (9,  N'Agence Moulay Yaâcoub'),
    (10, N'Agence Taounate Centre'),
    (11, N'Agence Moulay Driss Zerhoun')
) AS source (id, nom)
ON target.id = source.id
WHEN NOT MATCHED THEN
    INSERT (id, nom) VALUES (source.id, source.nom)
WHEN MATCHED THEN
    UPDATE SET nom = source.nom;

SET IDENTITY_INSERT AGENCE OFF;
GO

-- ============================================================================
-- 3. TABLE : TOURNEE (id, localisation, categorie, secteur, numero_tournee, ordre, agence_id)
-- agence_id : FES Ville Nvl=1, FES Médina=2, MEK Hamria=3, MEK Ismailia=4
--             TAZ=5, SEF=6, IFR=7, HAJ=8, BLM=9, MYC=10, TAO=11, MDZ=12
-- ============================================================================
SET IDENTITY_INSERT TOURNEE ON;

MERGE INTO TOURNEE AS target
USING (VALUES
    (1,  N'FES', N'DOM', N'01', N'101', N'001', 1),
    (2,  N'FES', N'DOM', N'01', N'102', N'002', 1),
    (3,  N'FES', N'DOM', N'01', N'103', N'003', 1),
    (4,  N'FES', N'PRO', N'02', N'201', N'001', 2),
    (5,  N'FES', N'IND', N'03', N'301', N'001', 2),
    (6,  N'MEK', N'DOM', N'01', N'101', N'001', 3),
    (7,  N'MEK', N'DOM', N'01', N'102', N'002', 3),
    (8,  N'MEK', N'PRO', N'02', N'201', N'001', 4),
    (9,  N'MEK', N'IND', N'03', N'301', N'001', 4),
    (10, N'TAZ', N'DOM', N'01', N'101', N'001', 5),
    (11, N'TAZ', N'PRO', N'02', N'201', N'001', 5),
    (12, N'SEF', N'DOM', N'01', N'101', N'001', 6),
    (13, N'IFR', N'DOM', N'01', N'101', N'001', 7),
    (14, N'HAJ', N'DOM', N'01', N'101', N'001', 8),
    (15, N'BLM', N'DOM', N'01', N'101', N'001', 9),
    (16, N'MYC', N'DOM', N'01', N'101', N'001', 10),
    (17, N'TAO', N'DOM', N'01', N'101', N'001', 11),
    (18, N'MDZ', N'DOM', N'01', N'101', N'001', 12)
) AS source (id, localisation, categorie, secteur, numero_tournee, ordre, agence_id)
ON target.id = source.id
WHEN NOT MATCHED THEN
    INSERT (id, localisation, categorie, secteur, numero_tournee, ordre, agence_id)
    VALUES (source.id, source.localisation, source.categorie, source.secteur, source.numero_tournee, source.ordre, source.agence_id)
WHEN MATCHED THEN
    UPDATE SET localisation = source.localisation, categorie = source.categorie,
               secteur = source.secteur, numero_tournee = source.numero_tournee,
               ordre = source.ordre, agence_id = source.agence_id;

-- Supprimer les tournées hors région (TNG, TET, LAR, ASL, FND, MRT, etc.)
DELETE FROM TOURNEE WHERE localisation NOT IN
    (N'FES', N'MEK', N'TAZ', N'SEF', N'IFR', N'HAJ', N'BLM', N'MYC', N'TAO', N'MDZ');

SET IDENTITY_INSERT TOURNEE OFF;
GO

-- ============================================================================
-- 4. TABLE : ABONNE (id, nom, prenom, cin)
-- ============================================================================
SET IDENTITY_INSERT ABONNE ON;

MERGE INTO ABONNE AS target
USING (VALUES
    (1,  N'EL ALAMI',  N'Mohammed', N'CD123456'),
    (2,  N'BENNANI',   N'Fatima',   N'CD789012'),
    (3,  N'IDRISSI',   N'Karim',    N'D345678'),
    (4,  N'CHRAIBI',   N'Meryem',   N'D901234'),
    (5,  N'TAZI',      N'Youssef',  N'Z567890'),
    (6,  N'EL AMRANI', N'Salma',    N'CD112233'),
    (7,  N'BOUZIANE',  N'Rachid',   N'D998877'),
    (8,  N'BERRADA',   N'Omar',     N'CD445566'),
    (9,  N'SQUALLI',   N'Khadija',  N'Z778899'),
    (10, N'FILALI',    N'Hassan',   N'CD332211'),
    (11, N'KETTANI',   N'Zineb',    N'D554433'),
    (12, N'ALAOUI',    N'Hamza',    N'CD889900')
) AS source (id, nom, prenom, cin)
ON target.id = source.id
WHEN NOT MATCHED THEN
    INSERT (id, nom, prenom, cin) VALUES (source.id, source.nom, source.prenom, source.cin)
WHEN MATCHED THEN
    UPDATE SET nom = source.nom, prenom = source.prenom, cin = source.cin;

SET IDENTITY_INSERT ABONNE OFF;
GO

-- ============================================================================
-- 5. TABLE : ABONNEMENT (id, police, adresse, abonne_id, agence_id, tournee_id)
-- ============================================================================
SET IDENTITY_INSERT ABONNEMENT ON;

MERGE INTO ABONNEMENT AS target
USING (VALUES
    (1,  N'POL-2024-00101', N'15 Avenue Hassan II, Fès',                        1,  1,  1),
    (2,  N'POL-2024-00102', N'42 Boulevard des Saadiens, Fès',                  2,  1,  2),
    (3,  N'POL-2024-00201', N'8 Rue Talaa Kebira, Médina, Fès',                 3,  2,  3),
    (4,  N'POL-2024-00301', N'24 Avenue des F.A.R., Hamria, Meknès',            4,  3,  4),
    (5,  N'POL-2024-00401', N'Lot 18, Zone Industrielle Sidi Bouzekri, Meknès', 5,  3,  5),
    (6,  N'POL-2024-00501', N'10 Avenue Mohammed V, Taza',                      6,  4,  6),
    (7,  N'POL-2024-00601', N'5 Boulevard Moulay Hassan, Sefrou',               7,  5,  7),
    (8,  N'POL-2024-00701', N'18 Rue de la Cascade, Ifrane',                    8,  6,  8),
    (9,  N'POL-2024-00801', N'33 Avenue Hassan II, El Hajeb',                   9,  7,  9),
    (10, N'POL-2024-00901', N'7 Rue Principale, Boulemane',                     10, 8,  10),
    (11, N'POL-2024-01001', N'12 Route des Thermes, Moulay Yaâcoub',            11, 9,  11),
    (12, N'POL-2024-01101', N'28 Avenue Al Massira, Taounate',                  12, 10, 12),
    (13, N'POL-2024-01201', N'14 Place Al Qasba, Moulay Driss Zerhoun',         1,  11, 13)
) AS source (id, police, adresse, abonne_id, agence_id, tournee_id)
ON target.id = source.id
WHEN NOT MATCHED THEN
    INSERT (id, police, adresse, abonne_id, agence_id, tournee_id)
    VALUES (source.id, source.police, source.adresse, source.abonne_id, source.agence_id, source.tournee_id)
WHEN MATCHED THEN
    UPDATE SET police = source.police, adresse = source.adresse,
               abonne_id = source.abonne_id, agence_id = source.agence_id, tournee_id = source.tournee_id;

-- Supprimer les abonnements liés aux agences hors région (Tanger, Tétouan, Larache...)
DELETE FROM ABONNEMENT
WHERE agence_id NOT IN (SELECT id FROM AGENCE);

SET IDENTITY_INSERT ABONNEMENT OFF;
GO

-- ============================================================================
-- 6. TABLE : ETUDE
-- Valeurs valides pour type_police : 'Nouvel Abonnement' ou 'Ancienne Police'
-- ============================================================================
SET IDENTITY_INSERT ETUDE ON;

MERGE INTO ETUDE AS target
USING (VALUES
    (1,  N'15A', N'Nouvel Abonnement', N'TRV-2024-01', 1,  NULL),
    (2,  N'30A', N'Nouvel Abonnement', N'TRV-2024-02', 2,  NULL),
    (3,  N'45A', N'Nouvel Abonnement', N'TRV-2024-03', 3,  NULL),
    (4,  N'60A', N'Nouvel Abonnement', N'TRV-2024-04', 5,  NULL),
    (5,  N'20A', N'Nouvel Abonnement', N'TRV-2024-05', 6,  NULL),
    (6,  N'15A', N'Nouvel Abonnement', N'TRV-2024-06', 7,  NULL),
    (7,  N'30A', N'Nouvel Abonnement', N'TRV-2024-07', 8,  NULL),
    (8,  N'15A', N'Nouvel Abonnement', N'TRV-2024-08', 9,  NULL),
    (9,  N'20A', N'Nouvel Abonnement', N'TRV-2024-09', 10, NULL),
    (10, N'15A', N'Nouvel Abonnement', N'TRV-2024-10', 11, NULL),
    (11, N'25A', N'Nouvel Abonnement', N'TRV-2024-11', 12, NULL),
    (12, N'15A', N'Nouvel Abonnement', N'TRV-2024-12', 13, NULL)
) AS source (id, calibre_disjoncteur, type_police, numero_travail, abonnement_id, ancienne_police_id)
ON target.id = source.id
WHEN NOT MATCHED THEN
    INSERT (id, calibre_disjoncteur, type_police, numero_travail, abonnement_id, ancienne_police_id)
    VALUES (source.id, source.calibre_disjoncteur, source.type_police, source.numero_travail, source.abonnement_id, source.ancienne_police_id)
WHEN MATCHED THEN
    UPDATE SET calibre_disjoncteur = source.calibre_disjoncteur, type_police = source.type_police,
               numero_travail = source.numero_travail, abonnement_id = source.abonnement_id,
               ancienne_police_id = source.ancienne_police_id;

-- Supprimer les études liées aux abonnements hors région
DELETE FROM ETUDE
WHERE abonnement_id NOT IN (SELECT id FROM ABONNEMENT);

SET IDENTITY_INSERT ETUDE OFF;
GO

-- ============================================================================
-- 7. TABLE : MOUVEMENT_COMPTEUR
-- Type : 'S' = Sortie (Pose), 'E' = Entrée (Dépose)
-- ============================================================================
SET IDENTITY_INSERT MOUVEMENT_COMPTEUR ON;

MERGE INTO MOUVEMENT_COMPTEUR AS target
USING (VALUES
    (1,  N'CPT-ELEC-883491', CAST('2024-01-15' AS DATE), N'000120', 'S', N'Pose initiale compteur électronique Fès',             1),
    (2,  N'CPT-ELEC-771203', CAST('2024-02-10' AS DATE), N'000450', 'S', N'Nouveau raccordement client Fès Saadiens',           2),
    (3,  N'CPT-ELEC-554129', CAST('2024-03-01' AS DATE), N'012450', 'E', N'Dépose ancien compteur défectueux Fès Médina',       3),
    (4,  N'CPT-ELEC-993211', CAST('2024-03-02' AS DATE), N'000000', 'S', N'Pose compteur de remplacement smart Fès Médina',      3),
    (5,  N'CPT-ELEC-441198', CAST('2024-04-18' AS DATE), N'003210', 'S', N'Branchement Meknès Hamria',                           4),
    (6,  N'CPT-TRI-102938',  CAST('2024-05-20' AS DATE), N'045800', 'S', N'Alimentation atelier Z.I. Sidi Bouzekri Meknès',      5),
    (7,  N'CPT-ELEC-663821', CAST('2024-06-11' AS DATE), N'001890', 'S', N'Installation standard Taza Centre',                   6),
    (8,  N'CPT-ELEC-332145', CAST('2024-06-25' AS DATE), N'000340', 'S', N'Raccordement résidence Sefrou',                       7),
    (9,  N'CPT-ELEC-112233', CAST('2024-07-04' AS DATE), N'000110', 'S', N'Installation chalet Ifrane',                          8),
    (10, N'CPT-ELEC-778844', CAST('2024-07-15' AS DATE), N'000520', 'S', N'Pose compteur El Hajeb',                              9),
    (11, N'CPT-ELEC-994411', CAST('2024-08-01' AS DATE), N'000215', 'S', N'Nouveau branchement Boulemane',                      10),
    (12, N'CPT-ELEC-665522', CAST('2024-08-10' AS DATE), N'000080', 'S', N'Branchement complexe thermal Moulay Yaâcoub',        11),
    (13, N'CPT-ELEC-334455', CAST('2024-08-20' AS DATE), N'000190', 'S', N'Installation Taounate Centre',                       12),
    (14, N'CPT-ELEC-556677', CAST('2024-08-25' AS DATE), N'000050', 'S', N'Pose compteur Zerhoun Médina',                       13)
) AS source (id, num_compteur, date_mouvement, index_valeur, type, observation, abonnement_id)
ON target.id = source.id
WHEN NOT MATCHED THEN
    INSERT (id, num_compteur, date_mouvement, index_valeur, type, observation, abonnement_id)
    VALUES (source.id, source.num_compteur, source.date_mouvement, source.index_valeur, source.type, source.observation, source.abonnement_id)
WHEN MATCHED THEN
    UPDATE SET num_compteur = source.num_compteur, date_mouvement = source.date_mouvement,
               index_valeur = source.index_valeur, type = source.type,
               observation = source.observation, abonnement_id = source.abonnement_id;

-- Supprimer les mouvements liés aux abonnements hors région
DELETE FROM MOUVEMENT_COMPTEUR
WHERE abonnement_id NOT IN (SELECT id FROM ABONNEMENT);

SET IDENTITY_INSERT MOUVEMENT_COMPTEUR OFF;
GO

-- ============================================================================
-- 8. RAPPORT DU NOMBRE DE LIGNES PAR TABLE
-- ============================================================================
SELECT 'UTILISATEUR'        AS TableName, COUNT(*) AS Total FROM UTILISATEUR
UNION ALL
SELECT 'AGENCE',             COUNT(*) FROM AGENCE
UNION ALL
SELECT 'TOURNEE',            COUNT(*) FROM TOURNEE
UNION ALL
SELECT 'ABONNE',             COUNT(*) FROM ABONNE
UNION ALL
SELECT 'ABONNEMENT',         COUNT(*) FROM ABONNEMENT
UNION ALL
SELECT 'ETUDE',              COUNT(*) FROM ETUDE
UNION ALL
SELECT 'MOUVEMENT_COMPTEUR', COUNT(*) FROM MOUVEMENT_COMPTEUR;
GO
