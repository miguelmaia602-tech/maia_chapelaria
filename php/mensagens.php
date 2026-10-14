<?php
include "../config/conexao.php";
$stmt = $conexao->prepare("SELECT * FROM mensagens ORDER BY id DESC");
$stmt->execute();
$mensagens = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mensagens — Maia Chapelaria</title><link rel="stylesheet" href="../css/style.css">
</head>
<body>
<header class="header"><a href="../index.html" class="logo">MAIA <span>CHAPELARIA</span></a><nav><a href="../index.html">Início</a><a href="../pages/historia.html">História</a><a href="../pages/produtos.html">Galeria</a><a href="../pages/contato.html">Contato</a></nav></header>
<main class="page">
<section class="section-title"><p class="eyebrow">ÁREA DE MENSAGENS</p><h1>Mensagens recebidas</h1><p>Cadastro, listagem, edição e exclusão usando PHP e MySQL.</p></section>
<div class="admin-list">
<?php foreach ($mensagens as $mensagem): ?>
<article class="admin-card">
    <h3><?php echo htmlspecialchars($mensagem["nome"]); ?></h3>
    <p><strong>E-mail:</strong> <?php echo htmlspecialchars($mensagem["email"]); ?></p>
    <p><?php echo nl2br(htmlspecialchars($mensagem["mensagem"])); ?></p>
    <div class="admin-actions">
        <a class="btn" href="editar.php?id=<?php echo $mensagem['id']; ?>">Editar</a>
        <a class="remove" href="excluir.php?id=<?php echo $mensagem['id']; ?>" onclick="return confirm('Deseja excluir esta mensagem?')">Excluir</a>
    </div>
</article>
<?php endforeach; ?>
<?php if (!$mensagens): ?><div class="cart empty"><h2>Nenhuma mensagem cadastrada.</h2></div><?php endif; ?>
</div>
</main>
<footer><p>© 2026 Maia Chapelaria — História dos Chapéus</p></footer>
</body></html>
