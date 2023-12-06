<?php
include 'db.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if ($input) {
    $nom = $input['nom'];
    $motDePasse = password_hash($input['motDePasse'], PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO utilisateurs (nom, mot_de_passe) VALUES (?, ?)");
    $success = $stmt->execute([$nom, $motDePasse]);

    if ($success) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Impossible de créer l\'utilisateur']);
    }
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Données invalides']);
}
?>
