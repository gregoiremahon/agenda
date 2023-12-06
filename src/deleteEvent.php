<?php
include 'db.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if ($input && !empty($input['id']) && !empty($input['utilisateurId'])) {
    $id = $input['id'];
    $utilisateurId = $input['utilisateurId'];

    $stmt = $pdo->prepare("DELETE FROM evenements WHERE id = ? AND createur_id = ?");
    if ($stmt->execute([$id, $utilisateurId])) {
        echo json_encode(['status' => 'success', 'message' => 'Événement supprimé']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la suppression']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Données invalides']);
}
?>
