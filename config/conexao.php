<?php

$conexao = new PDO(
    "mysql:host=localhost;dbname=maia_country",
    "root",
    ""
);

$conexao->setAttribute(
    PDO::ATTR_ERRMODE,
    PDO::ERRMODE_EXCEPTION
);

?>