<?php
include 'db.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if ($input) {
    $nom = $input['nom'];
    $motDePasse = $input['motDePasse'];

    $stmt = $pdo->prepare("SELECT id, mot_de_passe FROM utilisateurs WHERE nom = ?");
    $stmt->execute([$nom]);
    $utilisateur = $stmt->fetch();

    if ($utilisateur && password_verify($motDePasse, $utilisateur['mot_de_passe'])) {
        // Le mot de passe est correct
        echo json_encode(['status' => 'success', 'utilisateur' => ['id' => $utilisateur['id'], 'nom' => $nom]]);
    } else {
        // Les informations d'identification sont incorrectes
        http_response_code(401); // Non autorisé
        echo json_encode(['status' => 'error', 'message' => 'Nom d\'utilisateur ou mot de passe incorrect']);
    }
} else {
    http_response_code(400); // Mauvaise requête
    echo json_encode(['status' => 'error', 'message' => 'Données invalides']);
}
?>
