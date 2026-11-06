
const gradeAnexos = document.getElementById("gradeAnexos");
const anexosUpload = document.getElementById("anexosUpload");
const botaoAnexar = document.querySelector(".botaoAnexar");

const cardAnexos = localStorage.getItem("cardAtual");

let bancoAnexos;


// =========================
// ABRIR BANCO DE DADOS
// =========================

function abrirBanco() {

    return new Promise((resolve, reject) => {

        const requisicao = indexedDB.open("OrganizaFacil", 1);

        requisicao.onupgradeneeded = function(event) {

            const banco = event.target.result;

            if (!banco.objectStoreNames.contains("anexos")) {

                const tabela = banco.createObjectStore("anexos", {
                    keyPath: "id"
                });

                tabela.createIndex("cardId", "cardId", {
                    unique: false
                });

            }

        };

        requisicao.onsuccess = function(event) {
            resolve(event.target.result);
        };

        requisicao.onerror = function() {
            reject(requisicao.error);
        };

    });

}


// =========================
// SALVAR ARQUIVO
// =========================

function salvarAnexo(arquivo) {

    return new Promise((resolve, reject) => {

        const transacao = bancoAnexos.transaction("anexos", "readwrite");

        const tabela = transacao.objectStore("anexos");

        const registro = {

            id: Date.now() + "_" + Math.random(),

            cardId: cardAnexos,

            nome: arquivo.name,

            tipo: arquivo.type,

            tamanho: arquivo.size,

            arquivo: arquivo

        };

        const requisicao = tabela.add(registro);

        requisicao.onsuccess = function() {
    resolve(registro);
};

        requisicao.onerror = function() {
            reject(requisicao.error);
        };

    });

}


// =========================
// CARREGAR ARQUIVOS
// =========================

function carregarAnexos() {

    return new Promise((resolve, reject) => {

        const transacao = bancoAnexos.transaction("anexos", "readonly");

        const tabela = transacao.objectStore("anexos");

        const indice = tabela.index("cardId");

        const requisicao = indice.getAll(cardAnexos);

        requisicao.onsuccess = function() {

            requisicao.result.forEach(registro => {
                mostrarAnexo(registro);
            });

            resolve();

        };

        requisicao.onerror = function() {
            reject(requisicao.error);
        };

    });

}


// =========================
// MOSTRAR ARQUIVO NA GRADE
// =========================

function mostrarAnexo(registro) {

    const item = document.createElement("div");
    item.className = "itemAnexo";

    // VISUAL DO ARQUIVO

    if (registro.tipo && registro.tipo.startsWith("image/")) {

        const imagem = document.createElement("img");

        imagem.className = "imagemAnexo";

        imagem.src = URL.createObjectURL(registro.arquivo);

        imagem.alt = registro.nome;

        item.appendChild(imagem);

    } else {

        const icone = document.createElement("div");

        icone.className = "iconeAnexo";

        const nome = registro.nome.toLowerCase();

        if (nome.endsWith(".pdf")) {
            icone.textContent = "📕";
        }
        else if (nome.endsWith(".doc") || nome.endsWith(".docx")) {
            icone.textContent = "📝";
        }
        else if (nome.endsWith(".xls") || nome.endsWith(".xlsx") || nome.endsWith(".csv")) {
            icone.textContent = "📊";
        }
        else if (nome.endsWith(".ppt") || nome.endsWith(".pptx")) {
            icone.textContent = "📽️";
        }
        else if (nome.endsWith(".zip") || nome.endsWith(".rar") || nome.endsWith(".7z")) {
            icone.textContent = "📦";
        }
        else if (nome.endsWith(".mp3") || nome.endsWith(".wav")) {
            icone.textContent = "🎵";
        }
        else if (nome.endsWith(".mp4") || nome.endsWith(".avi")) {
            icone.textContent = "🎬";
        }
        else {
            icone.textContent = "📄";
        }

        item.appendChild(icone);

    }

    // NOME DO ARQUIVO

    const nomeArquivo = document.createElement("div");

    nomeArquivo.className = "nomeAnexo";

    nomeArquivo.textContent = registro.nome;

    nomeArquivo.title = registro.nome;

    item.appendChild(nomeArquivo);

    // BOTÃO BAIXAR

    const baixar = document.createElement("button");

    baixar.textContent = "Baixar";

    baixar.type = "button";

    baixar.onclick = function() {

        const url = URL.createObjectURL(registro.arquivo);

        const link = document.createElement("a");

        link.href = url;

        link.download = registro.nome;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);

    };

    item.appendChild(baixar);

    const excluir = document.createElement("button");

excluir.textContent = "Excluir";

excluir.type = "button";

excluir.onclick = function() {
    excluirAnexo(registro.id, item);
};

item.appendChild(excluir);

    gradeAnexos.insertBefore(item, botaoAnexar);

}


// =========================
// ADICIONAR ARQUIVOS
// =========================

async function adicionarAnexos(arquivos) {

    for (const arquivo of arquivos) {

        try {

            const registroSalvo = await salvarAnexo(arquivo);

mostrarAnexo(registroSalvo);

        }
        catch(erro) {

            console.error("Erro ao salvar arquivo:", erro);

            alert("Não foi possível salvar o arquivo: " + arquivo.name);

        }

    }

}


// =========================
// SELECIONAR ARQUIVOS
// =========================

anexosUpload.addEventListener("change", function() {

    adicionarAnexos(this.files);

    this.value = "";

});


// =========================
// ARRASTAR ARQUIVOS
// =========================

gradeAnexos.addEventListener("dragover", function(event) {

    event.preventDefault();

    gradeAnexos.classList.add("arrastando");

});

gradeAnexos.addEventListener("dragleave", function(event) {

    if (!gradeAnexos.contains(event.relatedTarget)) {
        gradeAnexos.classList.remove("arrastando");
    }

});

gradeAnexos.addEventListener("drop", function(event) {

    event.preventDefault();

    gradeAnexos.classList.remove("arrastando");

    adicionarAnexos(event.dataTransfer.files);

});


// =========================
// INICIALIZAÇÃO
// =========================

async function iniciarAnexos() {

    if (!cardAnexos) {

        alert("Não foi possível identificar o card atual.");

        return;

    }

    try {

        bancoAnexos = await abrirBanco();

        await carregarAnexos();

    }
    catch(erro) {

        console.error("Erro ao carregar anexos:", erro);

        alert("Não foi possível carregar os anexos.");

    }

}

// =========================
// EXCLUIR ARQUIVO
// =========================

function excluirAnexo(id, item) {

    if (!confirm("Deseja realmente excluir este arquivo?")) {
        return;
    }

    const transacao = bancoAnexos.transaction("anexos", "readwrite");

    const tabela = transacao.objectStore("anexos");

    const requisicao = tabela.delete(id);

    requisicao.onsuccess = function() {

        item.remove();

    };

    requisicao.onerror = function() {

        alert("Não foi possível excluir o arquivo.");

    };

}

iniciarAnexos();
