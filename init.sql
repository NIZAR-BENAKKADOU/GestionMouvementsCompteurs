-- =========================================================
-- Init Script - GestionCompteursDB
-- Executes only if database does not exist yet
-- =========================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'GestionCompteursDB')
BEGIN
    CREATE DATABASE GestionCompteursDB;
END
GO

USE GestionCompteursDB;
GO

-- =========================================================
-- Table : ABONNE
-- =========================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ABONNE')
BEGIN
    CREATE TABLE ABONNE (
        id          INT IDENTITY(1,1) PRIMARY KEY,
        nom         NVARCHAR(100) NOT NULL,
        prenom      NVARCHAR(100) NOT NULL,
        cin         NVARCHAR(20)  NOT NULL,
        CONSTRAINT UQ_Abonne_Cin UNIQUE (cin)
    );
END
GO

-- =========================================================
-- Table : AGENCE
-- =========================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AGENCE')
BEGIN
    CREATE TABLE AGENCE (
        id   INT IDENTITY(1,1) PRIMARY KEY,
        nom  NVARCHAR(150) NOT NULL
    );
END
GO

-- =========================================================
-- Table : TOURNEE
-- =========================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TOURNEE')
BEGIN
    CREATE TABLE TOURNEE (
        id             INT IDENTITY(1,1) PRIMARY KEY,
        localisation   NVARCHAR(10)  NOT NULL,
        categorie      NVARCHAR(10)  NOT NULL,
        secteur        NVARCHAR(10)  NOT NULL,
        numero_tournee NVARCHAR(10)  NOT NULL,
        ordre          NVARCHAR(10)  NOT NULL,
        agence_id      INT           NOT NULL,
        CONSTRAINT FK_Tournee_Agence FOREIGN KEY (agence_id) REFERENCES AGENCE(id)
    );
END
GO

-- =========================================================
-- Table : ABONNEMENT
-- =========================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ABONNEMENT')
BEGIN
    CREATE TABLE ABONNEMENT (
        id          INT IDENTITY(1,1) PRIMARY KEY,
        police      NVARCHAR(100) NOT NULL,
        adresse     NVARCHAR(255) NOT NULL,
        abonne_id   INT NOT NULL,
        agence_id   INT NOT NULL,
        tournee_id  INT NOT NULL,
        CONSTRAINT UQ_Abonnement_Police  UNIQUE (police),
        CONSTRAINT FK_Abonnement_Abonne  FOREIGN KEY (abonne_id)  REFERENCES ABONNE(id),
        CONSTRAINT FK_Abonnement_Agence  FOREIGN KEY (agence_id)  REFERENCES AGENCE(id),
        CONSTRAINT FK_Abonnement_Tournee FOREIGN KEY (tournee_id) REFERENCES TOURNEE(id)
    );
END
GO

-- =========================================================
-- Table : ETUDE
-- =========================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ETUDE')
BEGIN
    CREATE TABLE ETUDE (
        id                  INT IDENTITY(1,1) PRIMARY KEY,
        calibre_disjoncteur NVARCHAR(50)  NOT NULL,
        type_police         NVARCHAR(50)  NOT NULL,
        numero_travail      NVARCHAR(100) NOT NULL,
        abonnement_id       INT NOT NULL,
        ancienne_police_id  INT NULL,
        CONSTRAINT FK_Etude_Abonnement     FOREIGN KEY (abonnement_id)     REFERENCES ABONNEMENT(id),
        CONSTRAINT FK_Etude_AnciennePolice FOREIGN KEY (ancienne_police_id) REFERENCES ABONNEMENT(id)
    );
END
GO

-- =========================================================
-- Table : MOUVEMENT_COMPTEUR
-- =========================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MOUVEMENT_COMPTEUR')
BEGIN
    CREATE TABLE MOUVEMENT_COMPTEUR (
        id             INT IDENTITY(1,1) PRIMARY KEY,
        num_compteur   NVARCHAR(50)  NOT NULL,
        date_mouvement DATE          NOT NULL,
        index_valeur   NVARCHAR(20)  NOT NULL,
        type           CHAR(1)       NOT NULL,
        observation    NVARCHAR(500) NULL,
        abonnement_id  INT           NOT NULL,
        CONSTRAINT CK_MouvementCompteur_Type       CHECK (type IN ('S', 'E')),
        CONSTRAINT FK_MouvementCompteur_Abonnement FOREIGN KEY (abonnement_id) REFERENCES ABONNEMENT(id)
    );
END
GO

-- =========================================================
-- Table : UTILISATEUR
-- =========================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UTILISATEUR')
BEGIN
    CREATE TABLE UTILISATEUR (
        id            INT IDENTITY(1,1) PRIMARY KEY,
        login         NVARCHAR(100) NOT NULL,
        password_hash NVARCHAR(255) NOT NULL,
        role          NVARCHAR(50)  NOT NULL,
        CONSTRAINT UQ_Utilisateur_Login UNIQUE (login)
    );
END
GO

-- =========================================================
-- Trigger : TRG_Etude_CoherenceAnciennePolice
-- =========================================================
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'TRG_Etude_CoherenceAnciennePolice')
BEGIN
    EXEC('
    CREATE TRIGGER TRG_Etude_CoherenceAnciennePolice
    ON ETUDE
    AFTER INSERT, UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        IF EXISTS (
            SELECT 1
            FROM inserted i
            JOIN ABONNEMENT a1 ON i.abonnement_id = a1.id
            JOIN ABONNEMENT a2 ON i.ancienne_police_id = a2.id
            WHERE i.ancienne_police_id IS NOT NULL
              AND (a1.adresse != a2.adresse OR a1.tournee_id != a2.tournee_id)
        )
        BEGIN
            RAISERROR(''Incoherence : l''''adresse et la tournee de l''''ancienne police ne correspondent pas a l''''abonnement.'', 16, 1);
            ROLLBACK TRANSACTION;
        END
    END
    ');
END
GO
