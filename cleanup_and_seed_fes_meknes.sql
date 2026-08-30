-- ============================================================================
-- SCRIPT DE NETTOYAGE COMPLET ET REINITIALISATION
-- Région : Fès - Meknès UNIQUEMENT
-- Villes : Fès | Meknès | Taza | Sefrou | Ifrane | El Hajeb
--           Boulemane | Moulay Yaâcoub | Taounate | Moulay Driss Zerhoun
--
-- CE SCRIPT SUPPRIME TOUTES LES DONNEES EXISTANTES ET LES REMPLACE
-- PAR DES DONNEES PROPRES DE LA REGION FES-MEKNES.
-- ============================================================================

USE GestionCompteursDB;
GO

PRINT '>>> Etape 1/9 : Suppression des mouvements de compteurs...';
DELETE FROM MOUVEMENT_COMPTEUR;

PRINT '>>> Etape 2/9 : Suppression des etudes...';
DELETE FROM ETUDE;

PRINT '>>> Etape 3/9 : Suppression des abonnements...';
DELETE FROM ABONNEMENT;

PRINT '>>> Etape 4/9 : Suppression des abonnes...';
DELETE FROM ABONNE;

PRINT '>>> Etape 5/9 : Suppression des tournees...';
DELETE FROM TOURNEE;

PRINT '>>> Etape 6/9 : Suppression des agences...';
DELETE FROM AGENCE;

PRINT '>>> Reinitialisation des compteurs IDENTITY...';
DBCC CHECKIDENT ('MOUVEMENT_COMPTEUR', RESEED, 0);
DBCC CHECKIDENT ('ETUDE',             RESEED, 0);
DBCC CHECKIDENT ('ABONNEMENT',        RESEED, 0);
DBCC CHECKIDENT ('ABONNE',            RESEED, 0);
DBCC CHECKIDENT ('TOURNEE',           RESEED, 0);
DBCC CHECKIDENT ('AGENCE',            RESEED, 0);
GO

-- Ajouter la colonne agence_id sur TOURNEE si elle n'existe pas encore
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('TOURNEE') AND name = 'agence_id')
BEGIN
    ALTER TABLE TOURNEE ADD agence_id INT NOT NULL DEFAULT 0;
    ALTER TABLE TOURNEE ADD CONSTRAINT FK_Tournee_Agence
        FOREIGN KEY (agence_id) REFERENCES AGENCE(id);
END
GO

PRINT '>>> Nettoyage termine. Insertion des donnees Fes-Meknes...';
GO

-- ============================================================================
-- UTILISATEURS (inchangés)
-- ============================================================================
IF NOT EXISTS (SELECT 1 FROM UTILISATEUR WHERE login = 'admin')
    INSERT INTO UTILISATEUR (login, password_hash, role)
    VALUES ('admin', '$2a$11$eU1tFv20U6cKjVbU3Kq1yO9g5M9wP4hA3/LgQG1TjJ7q2C7Lh4W0q', 'Administration');

IF NOT EXISTS (SELECT 1 FROM UTILISATEUR WHERE login = 'consultation')
    INSERT INTO UTILISATEUR (login, password_hash, role)
    VALUES ('consultation', '$2a$11$eU1tFv20U6cKjVbU3Kq1yO9g5M9wP4hA3/LgQG1TjJ7q2C7Lh4W0q', 'Consultation');
GO

-- ============================================================================
-- AGENCE - 11 agences, région Fès-Meknès uniquement
-- ============================================================================
PRINT '>>> Etape 7/9 : Insertion des agences Fes-Meknes...';
SET IDENTITY_INSERT AGENCE ON;

INSERT INTO AGENCE (id, nom) VALUES
    (1,  N'Agence Fès Ville Nouvelle'),
    (2,  N'Agence Fès Médina'),
    (3,  N'Agence Meknès Hamria'),
    (4,  N'Agence Meknès Ismailia'),
    (5,  N'Agence Taza Centre'),
    (6,  N'Agence Sefrou Ville'),
    (7,  N'Agence Ifrane Centre'),
    (8,  N'Agence El Hajeb Ville'),
    (9,  N'Agence Boulemane'),
    (10, N'Agence Moulay Yaâcoub'),
    (11, N'Agence Taounate Centre'),
    (12, N'Agence Moulay Driss Zerhoun');

SET IDENTITY_INSERT AGENCE OFF;
GO

-- ============================================================================
-- TOURNEE - Codes région Fès-Meknès uniquement
-- FES | MEK | TAZ | SEF | IFR | HAJ | BLM | MYC | TAO | MDZ
-- ============================================================================
PRINT '>>> Insertion des tournees...';
SET IDENTITY_INSERT TOURNEE ON;

-- agence_id : FES Ville Nvl=1, FES Médina=2, MEK Hamria=3, MEK Ismailia=4
--              TAZ=5, SEF=6, IFR=7, HAJ=8, BLM=9, MYC=10, TAO=11, MDZ=12
INSERT INTO TOURNEE (id, localisation, categorie, secteur, numero_tournee, ordre, agence_id) VALUES
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
    (18, N'MDZ', N'DOM', N'01', N'101', N'001', 12);

SET IDENTITY_INSERT TOURNEE OFF;
GO

-- ============================================================================
-- ABONNE - Abonnés avec prénoms/noms de la région Fès-Meknès
-- ============================================================================
PRINT '>>> Insertion des abonnes...';
SET IDENTITY_INSERT ABONNE ON;

INSERT INTO ABONNE (id, nom, prenom, cin) VALUES
    -- Fès
    (1,  N'EL ALAMI',    N'Mohammed',   N'CD123456'),
    (2,  N'BENNANI',     N'Fatima',     N'CD789012'),
    (3,  N'IDRISSI',     N'Karim',      N'D345678'),
    (4,  N'CHRAIBI',     N'Meryem',     N'D901234'),
    (5,  N'SEBTI',       N'Yassir',     N'CD556677'),
    (6,  N'FILALI',      N'Naima',      N'D334455'),
    -- Meknès
    (7,  N'TAZI',        N'Youssef',    N'Z567890'),
    (8,  N'EL AMRANI',   N'Salma',      N'CD112233'),
    (9,  N'BOUZIANE',    N'Rachid',     N'D998877'),
    (10, N'LAHLOU',      N'Houda',      N'Z889900'),
    -- Taza
    (11, N'BERRADA',     N'Omar',       N'CD445566'),
    (12, N'SQUALLI',     N'Khadija',    N'Z778899'),
    -- Sefrou
    (13, N'FILALI',      N'Hassan',     N'CD332211'),
    -- Ifrane
    (14, N'KETTANI',     N'Zineb',      N'D554433'),
    -- El Hajeb
    (15, N'ALAOUI',      N'Hamza',      N'CD889900'),
    -- Boulemane
    (16, N'ZOUITEN',     N'Sanaa',      N'D667788'),
    -- Moulay Yaâcoub
    (17, N'BENALI',      N'Amine',      N'CD990011'),
    -- Taounate
    (18, N'MOUSSAOUI',   N'Leila',      N'Z441122'),
    -- Moulay Driss Zerhoun
    (19, N'EL IDRISSI',  N'Abdelkader', N'D223344'),
    -- Fès (supplémentaires)
    (20, N'GUESSOUS',    N'Rajae',      N'CD778855'),
    (21, N'TAHIRI',      N'Nour',       N'D667711'),
    (22, N'ZENAGUI',     N'Bilal',      N'CD445599');

SET IDENTITY_INSERT ABONNE OFF;
GO

-- ============================================================================
-- ABONNEMENT - Adresses exclusivement dans la région Fès-Meknès
-- ============================================================================
PRINT '>>> Insertion des abonnements...';
SET IDENTITY_INSERT ABONNEMENT ON;

INSERT INTO ABONNEMENT (id, police, adresse, abonne_id, agence_id, tournee_id) VALUES
    -- FES - Ville Nouvelle (agence 1)
    (1,  N'POL-2024-00101', N'15 Avenue Hassan II, Fès',                             1,  1,  1),
    (2,  N'POL-2024-00102', N'42 Boulevard des Saadiens, Fès',                       2,  1,  2),
    (3,  N'POL-2024-00103', N'7 Rue Abdelkrim El Khattabi, Fès',                     5,  1,  3),
    (4,  N'POL-2024-00104', N'20 Rue Ibn Khaldoun, Fès',                             6,  1,  1),
    -- FES - Médina (agence 2)
    (5,  N'POL-2024-00201', N'8 Rue Talaa Kebira, Médina, Fès',                      3,  2,  4),
    (6,  N'POL-2024-00202', N'33 Derb Lferrane, Médina, Fès',                        4,  2,  4),
    (7,  N'POL-2024-00203', N'Lot 12, Zone Industrielle Sidi Brahim, Fès',           1,  2,  5),
    -- MEKNES - Hamria (agence 3)
    (8,  N'POL-2024-00301', N'24 Avenue des F.A.R., Hamria, Meknès',                 7,  3,  6),
    (9,  N'POL-2024-00302', N'11 Rue Rouamzine, Meknès',                             8,  3,  7),
    (10, N'POL-2024-00303', N'48 Boulevard Mohammed V, Meknès',                      10, 3,  8),
    -- MEKNES - Ismailia (agence 4)
    (11, N'POL-2024-00401', N'Lot 18, Zone Industrielle Sidi Bouzekri, Meknès',      9,  4,  9),
    (12, N'POL-2024-00402', N'6 Rue Dar Smen, Médina, Meknès',                       7,  4,  6),
    -- TAZA (agence 5)
    (13, N'POL-2024-00501', N'10 Avenue Mohammed V, Taza',                           11, 5,  10),
    (14, N'POL-2024-00502', N'25 Rue Hassan II, Taza',                               12, 5,  10),
    (15, N'POL-2024-00503', N'Zone Industrielle Oued Amlil, Taza',                   11, 5,  11),
    -- SEFROU (agence 6)
    (16, N'POL-2024-00601', N'5 Boulevard Moulay Hassan, Sefrou',                    13, 6,  12),
    -- IFRANE (agence 7)
    (17, N'POL-2024-00701', N'18 Rue de la Cascade, Ifrane',                         14, 7,  13),
    (18, N'POL-2024-00702', N'Résidence Riad Al Arz, Ifrane',                        21, 7,  13),
    -- EL HAJEB (agence 8)
    (19, N'POL-2024-00801', N'33 Avenue Hassan II, El Hajeb',                        15, 8,  14),
    -- BOULEMANE (agence 9)
    (20, N'POL-2024-00901', N'7 Rue Principale, Boulemane',                          16, 9,  15),
    -- MOULAY YAÂCOUB (agence 10)
    (21, N'POL-2024-01001', N'12 Route des Thermes, Moulay Yaâcoub',                 17, 10, 16),
    -- TAOUNATE (agence 11)
    (22, N'POL-2024-01101', N'28 Avenue Al Massira, Taounate',                       18, 11, 17),
    (23, N'POL-2024-01102', N'15 Rue de la Médina, Taounate',                        20, 11, 17),
    -- MOULAY DRISS ZERHOUN (agence 12)
    (24, N'POL-2024-01201', N'14 Place Al Qasba, Moulay Driss Zerhoun',              19, 12, 18),
    (25, N'POL-2024-01202', N'3 Rue Idriss Ier, Moulay Driss Zerhoun',              22, 12, 18);

SET IDENTITY_INSERT ABONNEMENT OFF;
GO

-- ============================================================================
-- ETUDE
-- ============================================================================
PRINT '>>> Insertion des etudes...';
SET IDENTITY_INSERT ETUDE ON;

INSERT INTO ETUDE (id, calibre_disjoncteur, type_police, numero_travail, abonnement_id, ancienne_police_id) VALUES
    (1,  N'15A', N'Nouvel Abonnement', N'TRV-2024-01', 1,  NULL),
    (2,  N'30A', N'Nouvel Abonnement', N'TRV-2024-02', 2,  NULL),
    (3,  N'15A', N'Nouvel Abonnement', N'TRV-2024-03', 3,  NULL),
    (4,  N'20A', N'Nouvel Abonnement', N'TRV-2024-04', 4,  NULL),
    (5,  N'45A', N'Nouvel Abonnement', N'TRV-2024-05', 5,  NULL),
    (6,  N'30A', N'Nouvel Abonnement', N'TRV-2024-06', 6,  NULL),
    (7,  N'60A', N'Nouvel Abonnement', N'TRV-2024-07', 7,  NULL),
    (8,  N'30A', N'Nouvel Abonnement', N'TRV-2024-08', 8,  NULL),
    (9,  N'20A', N'Nouvel Abonnement', N'TRV-2024-09', 9,  NULL),
    (10, N'15A', N'Nouvel Abonnement', N'TRV-2024-10', 10, NULL),
    (11, N'60A', N'Nouvel Abonnement', N'TRV-2024-11', 11, NULL),
    (12, N'15A', N'Nouvel Abonnement', N'TRV-2024-12', 12, NULL),
    (13, N'20A', N'Nouvel Abonnement', N'TRV-2024-13', 13, NULL),
    (14, N'15A', N'Nouvel Abonnement', N'TRV-2024-14', 14, NULL),
    (15, N'15A', N'Nouvel Abonnement', N'TRV-2024-15', 16, NULL),
    (16, N'20A', N'Nouvel Abonnement', N'TRV-2024-16', 17, NULL),
    (17, N'15A', N'Nouvel Abonnement', N'TRV-2024-17', 18, NULL),
    (18, N'15A', N'Nouvel Abonnement', N'TRV-2024-18', 19, NULL),
    (19, N'30A', N'Nouvel Abonnement', N'TRV-2024-19', 20, NULL),
    (20, N'15A', N'Nouvel Abonnement', N'TRV-2024-20', 21, NULL),
    (21, N'25A', N'Nouvel Abonnement', N'TRV-2024-21', 22, NULL),
    (22, N'15A', N'Nouvel Abonnement', N'TRV-2024-22', 24, NULL);

SET IDENTITY_INSERT ETUDE OFF;
GO

-- ============================================================================
-- MOUVEMENT_COMPTEUR
-- Type : 'S' = Sortie (Pose), 'E' = Entrée (Dépose)
-- ============================================================================
PRINT '>>> Etape 8/9 : Insertion des mouvements de compteurs...';
SET IDENTITY_INSERT MOUVEMENT_COMPTEUR ON;

INSERT INTO MOUVEMENT_COMPTEUR (id, num_compteur, date_mouvement, index_valeur, type, observation, abonnement_id) VALUES
    (1,  N'CPT-ELEC-883491', CAST('2024-01-15' AS DATE), N'000120', 'S', N'Pose initiale - Fès Ville Nouvelle Hassan II',        1),
    (2,  N'CPT-ELEC-771203', CAST('2024-02-10' AS DATE), N'000450', 'S', N'Raccordement Fès Saadiens',                          2),
    (3,  N'CPT-ELEC-223344', CAST('2024-02-20' AS DATE), N'000230', 'S', N'Pose Fès Abdelkrim El Khattabi',                     3),
    (4,  N'CPT-ELEC-334455', CAST('2024-03-01' AS DATE), N'012450', 'E', N'Dépose compteur défectueux - Fès Médina',            5),
    (5,  N'CPT-ELEC-993211', CAST('2024-03-02' AS DATE), N'000000', 'S', N'Pose compteur remplacement - Fès Médina',            5),
    (6,  N'CPT-ELEC-445566', CAST('2024-03-15' AS DATE), N'000180', 'S', N'Installation Derb Lferrane Médina Fès',              6),
    (7,  N'CPT-TRI-102938',  CAST('2024-04-05' AS DATE), N'045800', 'S', N'Alimentation ZI Sidi Brahim Fès',                   7),
    (8,  N'CPT-ELEC-441198', CAST('2024-04-18' AS DATE), N'003210', 'S', N'Branchement Meknès Hamria FAR',                     8),
    (9,  N'CPT-ELEC-556677', CAST('2024-04-25' AS DATE), N'001100', 'S', N'Pose Meknès Rouamzine',                             9),
    (10, N'CPT-ELEC-667788', CAST('2024-05-10' AS DATE), N'000890', 'S', N'Raccordement Meknès Mohammed V',                    10),
    (11, N'CPT-TRI-203847',  CAST('2024-05-20' AS DATE), N'038200', 'S', N'Alimentation ZI Sidi Bouzekri Meknès',              11),
    (12, N'CPT-ELEC-778899', CAST('2024-05-28' AS DATE), N'000410', 'S', N'Installation Dar Smen Médina Meknès',               12),
    (13, N'CPT-ELEC-663821', CAST('2024-06-11' AS DATE), N'001890', 'S', N'Pose Taza Mohammed V',                              13),
    (14, N'CPT-ELEC-889900', CAST('2024-06-22' AS DATE), N'000670', 'S', N'Installation Taza Hassan II',                       14),
    (15, N'CPT-TRI-314159',  CAST('2024-06-30' AS DATE), N'022400', 'S', N'Alimentation ZI Oued Amlil Taza',                   15),
    (16, N'CPT-ELEC-332145', CAST('2024-07-04' AS DATE), N'000340', 'S', N'Raccordement Sefrou Moulay Hassan',                 16),
    (17, N'CPT-ELEC-112233', CAST('2024-07-12' AS DATE), N'000110', 'S', N'Installation chalet Ifrane Cascade',                17),
    (18, N'CPT-ELEC-223310', CAST('2024-07-18' AS DATE), N'000060', 'S', N'Pose Résidence Riad Al Arz Ifrane',                 18),
    (19, N'CPT-ELEC-778844', CAST('2024-07-25' AS DATE), N'000520', 'S', N'Pose compteur El Hajeb Hassan II',                  19),
    (20, N'CPT-ELEC-994411', CAST('2024-08-01' AS DATE), N'000215', 'S', N'Branchement Boulemane centre',                      20),
    (21, N'CPT-ELEC-665522', CAST('2024-08-10' AS DATE), N'000080', 'S', N'Installation Moulay Yaâcoub thermes',               21),
    (22, N'CPT-ELEC-445533', CAST('2024-08-18' AS DATE), N'000190', 'S', N'Pose Taounate Al Massira',                          22),
    (23, N'CPT-ELEC-778811', CAST('2024-08-20' AS DATE), N'000095', 'S', N'Installation Taounate Médina',                      23),
    (24, N'CPT-ELEC-556644', CAST('2024-08-24' AS DATE), N'000050', 'S', N'Pose Moulay Driss Zerhoun Al Qasba',                24),
    (25, N'CPT-ELEC-667722', CAST('2024-08-25' AS DATE), N'000030', 'S', N'Installation Moulay Driss Zerhoun Idriss Ier',      25);

SET IDENTITY_INSERT MOUVEMENT_COMPTEUR OFF;
GO

-- ============================================================================
-- ETAPE 9 : RAPPORT DE VERIFICATION FINAL
-- ============================================================================
PRINT '>>> Etape 9/9 : Verification finale...';
PRINT '=== RAPPORT FINAL - REGION FES-MEKNES ===';
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

PRINT '=== VERIFICATION : Villes dans les adresses ===';
SELECT police, adresse FROM ABONNEMENT ORDER BY id;
GO
