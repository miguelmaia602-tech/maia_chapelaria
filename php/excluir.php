<?php
include "conexao.php";
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if ($id) {
    $stmt = $conexao->prepare("DELETE FROM mensagens WHERE id = ?");
    $stmt->execute([$id]);
}
header("Location: mensagens.php");
exit;
?>
