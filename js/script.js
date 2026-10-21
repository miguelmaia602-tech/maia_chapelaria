const products = [

    {
        id: 1,
        nome: "Chapéu Texas Marrom",
        categoria: "chapeus",
        preco: 189.90,
        imagem:"https://images.tcdn.com.br/img/img_prod/989359/chapeu_pralana_arizona_felt_la_marrom_5739_1_77c8587a4e1363ca6f5dc73626bd43f5.jpg"
    },

    {
        id: 2,
        nome: "Chapéu Country Preto",
        categoria: "chapeus",
        preco: 219.90,
        imagem: "https://tse4.mm.bing.net/th/id/OIP.iS3r-eoWcKTzJEzQIzRrnwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
    },

    {
        id: 3,
        nome: "Chapéu Western Bege",
        categoria: "chapeus",
        preco: 199.90,
        imagem: "https://down-br.img.susercontent.com/file/sg-11134201-7rdvy-m0aesdf4qry815"
    },

    {
        id: 4,
        nome: "Chapéu Rodeio Clássico",
        categoria: "chapeus",
        preco: 239.90,
        imagem: "https://www.mariachapeu.com.br/media/catalog/product/cache/1/image/1800x/040ec09b1e35df139433887a97daa66f/1/8/180129233315-2.png"
    },

    {
        id: 5,
        nome: "Bota Country Feminina",
        categoria: "botas",
        preco: 349.90,
        imagem: "https://down-br.img.susercontent.com/file/58a10a8f07627e97de5757edaa66bd87"
    },

    {
        id: 6,
        nome: "Bota Mr. West Masculina",
        categoria: "botas",
        preco: 739.90,
        imagem: "https://cdn.awsli.com.br/2500x2500/2710/2710048/produto/308482893/_dsc0474-2ibqznix71.JPG"
    },

    {
        id: 7,
        nome: "Cinto Country Feminino",
        categoria: "acessorios",
        preco: 129.90,
        imagem: "https://tse3.mm.bing.net/th/id/OIP.SXpOAGBA04soV07zqrdEsQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
    },

    {
        id: 8,
        nome: "Cinto Country Masculino",
        categoria: "acessorios",
        preco: 159.90,
        imagem: "https://images.tcdn.com.br/img/img_prod/1125801/cinto_de_couro_masculino_largo_bordado_caramelo_dawson_5239_10_8d7d4791035bae0422e13f047753f5cc.jpg"
    }

];

// Atividade 3: integração real com a API Flask usando GET e POST.
// Quando o site é aberto pelo Flask, utiliza a mesma origem.
// No Live Server (porta 5500), usa a API local na porta 5000.
const API_PRODUTOS = window.location.port === "5000"
    ? "/produtos" : "http://localhost:5000/produtos";

function getCategoryName(category) {
    return category === "chapeus" ? "Chapéu" : category;
}

let produtosBanco = [];

function renderProducts(filter = "todos") {
    const area = document.getElementById("products");
    if (!area) return;
    area.replaceChildren();
    const lista = produtosBanco.filter(p => filter === "todos" || p.categoria === filter);
    lista.forEach(produto => {
        const card = document.createElement("article");
        card.className = "product history-product";
        const imgBox = document.createElement("div");
        imgBox.className = "product-img";
        if (produto.imagem) {
            const img = document.createElement("img");
            img.src = produto.imagem;
            img.alt = produto.nome;
            img.loading = "lazy";
            imgBox.appendChild(img);
        } else {
            imgBox.textContent = "🤠";
        }
        const info = document.createElement("div");
        info.className = "product-info";
        const marca = document.createElement("p");
        marca.className = "product-brand";
        marca.textContent = "MAIA CHAPELARIA · ACERVO";
        const titulo = document.createElement("h3");
        titulo.textContent = produto.nome;
        const preco = document.createElement("p");
        preco.textContent = Number(produto.preco).toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
        info.append(marca, titulo, preco);
        card.append(imgBox, info);
        area.appendChild(card);
    });
}

async function listarProdutos() {
    const mensagem = document.getElementById("apiMensagem");
    if (!mensagem) return;
    try {
        const resposta = await fetch(API_PRODUTOS, { method: "GET" });
        if (!resposta.ok) throw new Error("Falha ao buscar produtos");
        produtosBanco = await resposta.json();
        const ativo = document.querySelector(".filter.active");
        renderProducts(ativo ? ativo.dataset.filter : "todos");
        mensagem.textContent = `${produtosBanco.length} produto(s) no banco de dados.`;
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = "Não foi possível carregar os produtos. Inicie a API Flask (python app.py).";
    }
}

async function cadastrarProduto(evento) {
    evento.preventDefault();
    const form = evento.currentTarget;
    const mensagem = document.getElementById("produtoMensagem");
    const botao = document.getElementById("produtoEnviar");
    const dados = {
        nome: document.getElementById("produtoNome").value.trim(),
        preco: Number(document.getElementById("produtoPreco").value),
        imagem: document.getElementById("produtoImagem").value.trim()
    };
    botao.disabled = true;
    mensagem.textContent = "Cadastrando...";
    try {
        const resposta = await fetch(API_PRODUTOS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        const resultado = await resposta.json();
        if (!resposta.ok) throw new Error(resultado.erro || "Falha no cadastro");
        form.reset();
        mensagem.textContent = "Chapéu cadastrado com sucesso!";
        await listarProdutos(); // Atualiza a tela sem recarregar.
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = `Erro: ${erro.message}`;
    } finally {
        botao.disabled = false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");
    if (menuBtn && nav) menuBtn.addEventListener("click", () => {
        const aberto = nav.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(aberto));
        menuBtn.setAttribute("aria-label", aberto ? "Fechar menu de navegacao" : "Abrir menu de navegacao");
    });

    document.querySelectorAll(".filter").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
            button.classList.add("active");
            renderProducts(button.dataset.filter);
        });
    });
    if (document.getElementById("products")) listarProdutos();
    const formularioProduto = document.getElementById("produtoForm");
    if (formularioProduto) formularioProduto.addEventListener("submit", cadastrarProduto);
});


// Atividade 2 — consulta de CEP com fetch, JSON e atualização do DOM.
async function buscarCEP(cep) {
    const mensagem = document.getElementById("cepMensagem");
    const resultado = document.getElementById("cepResultado");
    const botao = document.getElementById("cepButton");

    // Limpa a consulta anterior para não mostrar endereço desatualizado.
    resultado.hidden = true;
    mensagem.textContent = "";
    mensagem.className = "cep-mensagem";

    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
        mensagem.textContent = "Digite um CEP válido com 8 números.";
        mensagem.classList.add("erro");
        return;
    }

    botao.disabled = true;
    mensagem.textContent = "Buscando endereço...";
    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        if (!resposta.ok) {
            throw new Error("Falha na consulta do CEP.");
        }
        const dados = await resposta.json();
        if (dados.erro) {
            mensagem.textContent = "CEP não encontrado. Confira os números e tente novamente.";
            mensagem.classList.add("erro");
            return;
        }
        document.getElementById("cepRua").textContent = dados.logradouro || "Não informado";
        document.getElementById("cepBairro").textContent = dados.bairro || "Não informado";
        document.getElementById("cepCidade").textContent = dados.localidade || "Não informado";
        document.getElementById("cepEstado").textContent = dados.uf || "Não informado";
        resultado.hidden = false;
        mensagem.textContent = "Consulta realizada com sucesso!";
        mensagem.classList.add("sucesso");
    } catch (erro) {
        mensagem.textContent = "Não foi possível consultar o CEP agora. Verifique a conexão e tente novamente.";
        mensagem.classList.add("erro");
        console.error("Erro ao buscar CEP:", erro);
    } finally {
        botao.disabled = false;
    }
}

// Executa a consulta sem recarregar a página.
document.addEventListener("DOMContentLoaded", () => {
    const formularioCEP = document.getElementById("cepForm");
    if (formularioCEP) {
        formularioCEP.addEventListener("submit", (evento) => {
            evento.preventDefault();
            buscarCEP(document.getElementById("cepInput").value);
        });
    }
});
