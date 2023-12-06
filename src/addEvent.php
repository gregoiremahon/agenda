<?php
include 'db.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if ($input && !empty($input['utilisateurId'])) {
    $titre = $input['titre'];
    $description = $input['description'] ?? null;
    $debut = $input['debut'];
    $fin = $input['fin'] ?? null;
    $utilisateurId = $input['utilisateurId'];

    $stmt = $pdo->prepare("INSERT INTO evenements (titre, description, debut, fin, createur_id) VALUES (?, ?, ?, ?, ?)");
    if ($stmt->execute([$titre, $description, $debut, $fin, $utilisateurId])) {
        echo json_encode(['status' => 'success', 'message' => 'Événement ajouté avec succès']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'ajout de l\'événement']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Données invalides']);
}
?>
