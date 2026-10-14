<?php

include "../config/conexao.php";

$nome = $_POST["nome"];
$email = $_POST["email"];
$mensagem = $_POST["mensagem"];

$sql = "INSERT INTO mensagens (nome, email, mensagem)
        VALUES (?, ?, ?)";

$stmt = $conexao->prepare($sql);

$stmt->execute([
    $nome,
    $email,
    $mensagem
]);

header("Location: mensagens.php");
exit;

?>