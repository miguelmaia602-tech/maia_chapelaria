"""API Flask da Maia Chapelaria — atividade DWS 3."""
import sqlite3
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

BASE = Path(__file__).resolve().parent
DB = BASE / "maia_produtos.db"
app = Flask(__name__)
CORS(app)


def conectar():
    conexao = sqlite3.connect(DB)
    conexao.row_factory = sqlite3.Row
    return conexao


def criar_banco():
    with conectar() as conexao:
        conexao.execute("""CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            categoria TEXT NOT NULL DEFAULT 'chapeus',
            preco REAL NOT NULL,
            imagem TEXT NOT NULL DEFAULT ''
        )""")
        qtd = conexao.execute("SELECT COUNT(*) FROM produtos").fetchone()[0]
        if qtd == 0:
            produtos_iniciais = [
                ("Chapéu Texas Marrom", "chapeus", 189.90, "https://images.tcdn.com.br/img/img_prod/989359/chapeu_pralana_arizona_felt_la_marrom_5739_1_77c8587a4e1363ca6f5dc73626bd43f5.jpg"),
                ("Chapéu Country Preto", "chapeus", 219.90, "https://tse4.mm.bing.net/th/id/OIP.iS3r-eoWcKTzJEzQIzRrnwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"),
                ("Chapéu Western Bege", "chapeus", 199.90, "https://down-br.img.susercontent.com/file/sg-11134201-7rdvy-m0aesdf4qry815"),
                ("Chapéu Rodeio Clássico", "chapeus", 239.90, "https://www.mariachapeu.com.br/media/catalog/product/cache/1/image/1800x/040ec09b1e35df139433887a97daa66f/1/8/180129233315-2.png"),
            ]
            conexao.executemany("INSERT INTO produtos (nome, categoria, preco, imagem) VALUES (?, ?, ?, ?)", produtos_iniciais)


@app.get('/produtos')
def listar_produtos():
    with conectar() as conexao:
        registros = conexao.execute("SELECT * FROM produtos ORDER BY id").fetchall()
    return jsonify([dict(r) for r in registros])


@app.post('/produtos')
def cadastrar_produto():
    dados = request.get_json(silent=True)
    if not isinstance(dados, dict):
        return jsonify({'erro': 'Envie os dados em formato JSON.'}), 400
    nome = str(dados.get('nome', '')).strip()
    imagem = str(dados.get('imagem', '')).strip()
    try:
        preco = float(dados.get('preco', ''))
    except (ValueError, TypeError):
        return jsonify({'erro': 'Preço inválido.'}), 400
    if not nome or len(nome) > 100 or preco < 0 or preco > 1000000:
        return jsonify({'erro': 'Informe um nome (até 100 caracteres) e um preço válido.'}), 400
    if imagem and not imagem.startswith(('https://', 'http://')):
        return jsonify({'erro': 'Use um endereço de imagem http ou https.'}), 400
    with conectar() as conexao:
        cursor = conexao.execute(
            "INSERT INTO produtos (nome, categoria, preco, imagem) VALUES (?, ?, ?, ?)",
            (nome, 'chapeus', preco, imagem)
        )
        novo_id = cursor.lastrowid
        produto = conexao.execute('SELECT * FROM produtos WHERE id = ?', (novo_id,)).fetchone()
    return jsonify(dict(produto)), 201


@app.get('/')
def inicio():
    return send_from_directory(BASE, 'index.html')


@app.get('/<path:caminho>')
def arquivos_site(caminho):
    return send_from_directory(BASE, caminho)


criar_banco()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
