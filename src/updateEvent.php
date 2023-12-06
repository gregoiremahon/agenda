<?php
include 'db.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

function validateDate($date, $format = 'Y-m-d\TH:i') {
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) == $date;
}

if ($input && !empty($input['id']) && !empty($input['utilisateurId'])) {
    $id = $input['id'];
    $titre = $input['titre'];
    $description = $input['description'] ?? null;
    $debut = $input['debut'];
    $fin = $input['fin'] ?? null;

    // Validation des données
    if (empty($titre) || !validateDate($debut) || ($fin && !validateDate($fin))) {
        echo json_encode(['status' => 'error', 'message' => 'Validation des données échouée']);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE evenements SET titre = ?, description = ?, debut = ?, fin = ? WHERE id = ? AND createur_id = ?");
    if ($stmt->execute([$titre, $description, $debut, $fin, $id, $input['utilisateurId']])) {
        echo json_encode(['status' => 'success', 'message' => 'Événement mis à jour']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la mise à jour']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Données invalides']);
}
?>
