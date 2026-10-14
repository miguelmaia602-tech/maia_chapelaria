<?php
include "../config/conexao.php";
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id) { die("Registro inválido."); }
$stmt = $conexao->prepare("SELECT * FROM mensagens WHERE id = ?");
$stmt->execute([$id]);
$mensagem = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$mensagem) { die("Registro não encontrado."); }
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $texto = $_POST['mensagem'];
    $stmt = $conexao->prepare("UPDATE mensagens SET nome = ?, email = ?, mensagem = ? WHERE id = ?");
    $stmt->execute([$nome, $email, $texto, $id]);
    header("Location: mensagens.php");
    exit;
}
?>
<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Editar — Maia Chapelaria</title><link rel="stylesheet" href="../css/style.css"></head>
<body><header class="header"><a href="../index.html" class="logo">MAIA <span>CHAPELARIA</span></a><nav><a href="../index.html">Início</a><a href="../pages/historia.html">História</a><a href="../pages/produtos.html">Galeria</a><a href="../pages/contato.html">Contato</a></nav></header>
<main class="page"><section class="section-title"><p class="eyebrow">CRUD</p><h1>Editar mensagem</h1></section>
<form class="form admin-form" method="POST">
<label>Nome<input type="text" name="nome" value="<?php echo htmlspecialchars($mensagem['nome']); ?>" required></label>
<label>E-mail<input type="email" name="email" value="<?php echo htmlspecialchars($mensagem['email']); ?>" required></label>
<label>Mensagem<textarea name="mensagem" rows="6" required><?php echo htmlspecialchars($mensagem['mensagem']); ?></textarea></label>
<button class="btn" type="submit">Salvar alteração</button>
</form></main><footer><p>© 2026 Maia Chapelaria — História dos Chapéus</p></footer></body></html>
