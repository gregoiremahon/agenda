/* Init database */

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS gestionnaire_taches;
USE gestionnaire_taches;

-- Création de la table 'utilisateurs' (pour une future fonctionnalité d'authentification)
CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Création de la table 'evenements'
CREATE TABLE IF NOT EXISTS evenements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    debut DATETIME NOT NULL,
    fin DATETIME,
    createur_id INT,
    FOREIGN KEY (createur_id) REFERENCES utilisateurs(id)
) ENGINE=InnoDB;
