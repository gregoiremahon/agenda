<?php
include 'db.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if ($input && isset($input['utilisateurId'])) {
    $stmt = $pdo->prepare("SELECT * FROM evenements WHERE createur_id = ?");
    $stmt->execute([$input['utilisateurId']]);
    $evenements = $stmt->fetchAll();

    echo json_encode($evenements);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Utilisateur non spécifié']);
}
?>
