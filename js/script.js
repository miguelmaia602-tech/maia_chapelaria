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

function getCategoryName(category) {
    return category === "chapeus" ? "Chapéu" : category;
}

function renderProducts(filter = "todos") {
    const area = document.getElementById("products");
    if (!area) return;
    const list = products.filter(p => p.categoria === "chapeus");
    area.innerHTML = "";
    list.forEach(product => {
        const card = document.createElement("article");
        card.className = "product history-product";
        card.innerHTML = `
            <div class="product-img">
                <img src="${product.imagem}" alt="${product.nome}">
                <span class="product-category">${getCategoryName(product.categoria)}</span>
            </div>
            <div class="product-info">
                <p class="product-brand">MAIA CHAPELARIA · ACERVO</p>
                <h3>${product.nome}</h3>
                <p>Modelo presente na galeria histórica do projeto.</p>
            </div>`;
        area.appendChild(card);
    });
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
    renderProducts();
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
