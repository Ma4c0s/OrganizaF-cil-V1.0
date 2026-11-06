/* IMAGEM */

const imagemUpload = document.getElementById("imagemUpload");
const previewImagem = document.getElementById("previewImagem");
const textoImagem = document.getElementById("textoImagem");

/* CAMPOS */

const tituloCard = document.getElementById("tituloCard");
const conteudoCard = document.getElementById("conteudoCard");
const tituloCardVisual = document.getElementById("tituloCardVisual");
const conteudoCardVisual = document.getElementById("conteudoCardVisual");
const resumoCard = document.getElementById("resumoCard");


/* CARD ATUAL */

const cardAtual = localStorage.getItem("cardAtual");

let alterado = false;


/* ========================= */
/* IMAGEM */
/* ========================= */


if (imagemUpload && previewImagem && textoImagem) {

    imagemUpload.addEventListener("change", function() {

        const arquivo = this.files[0];

        if (arquivo) {

            const leitor = new FileReader();

            leitor.onload = function(e) {

                previewImagem.src = e.target.result;
                previewImagem.style.display = "block";
                textoImagem.style.display = "none";

                localStorage.setItem(
                    "imagemCard" + cardAtual,
                    e.target.result
                );

            };

            leitor.readAsDataURL(arquivo);

        }

    });

}



/* ========================= */
/* CARREGAR DADOS */
/* ========================= */


window.addEventListener("load", () => {

    const tituloCardVisualSalvo = localStorage.getItem("tituloCardVisual" + cardAtual);
    const conteudoCardVisualSalvo = localStorage.getItem("conteudoCardVisual" + cardAtual);
    const tituloSalvo = localStorage.getItem("tituloCard" + cardAtual);
    const conteudoSalvo = localStorage.getItem("conteudoCard" + cardAtual);
    const resumoSalvo = localStorage.getItem("resumoCard" + cardAtual);
    const imagemSalva = localStorage.getItem("imagemCard" + cardAtual);

    if (tituloCard) {
        tituloCard.value = tituloSalvo || "";
    }

    if (conteudoCard) {
        conteudoCard.value = conteudoSalvo || "";
    }

    if (tituloCardVisual) {
    tituloCardVisual.value = tituloCardVisualSalvo || "";
}

if (conteudoCardVisual) {
    conteudoCardVisual.value = conteudoCardVisualSalvo || "";
}

    if (resumoCard) {
        resumoCard.value = resumoSalvo || "";
    }

    if (imagemUpload && previewImagem && textoImagem && imagemSalva) {
        previewImagem.src = imagemSalva;
        previewImagem.style.display = "block";
        textoImagem.style.display = "none";
    }

});



/* ========================= */
/* SALVAR */
/* ========================= */


function salvarCard(){

    if (tituloCardVisual) {
        localStorage.setItem("tituloCardVisual" + cardAtual, tituloCardVisual.value);
    }

    if (conteudoCard) {
        localStorage.setItem("conteudoCard" + cardAtual, conteudoCard.value);
    }

        if (tituloCard) {
        localStorage.setItem("tituloCard" + cardAtual, tituloCard.value);
    }

    if (conteudoCardVisual) {
        localStorage.setItem("conteudoCardVisual" + cardAtual, conteudoCardVisual.value);
    }

    if (resumoCard) {
        localStorage.setItem("resumoCard" + cardAtual, resumoCard.value);
    }

    alterado = false;

    alert("Card salvo com sucesso!");

}


/* ========================= */
/* DETECTAR ALTERAÇÕES */
/* ========================= */

if (tituloCardVisual) {
    tituloCardVisual.addEventListener("input", () => {
        alterado = true;
        localStorage.setItem("tituloCardVisual" + cardAtual, tituloCardVisual.value);
    });
}

if (conteudoCardVisual) {
    conteudoCardVisual.addEventListener("input", () => {
        alterado = true;
        localStorage.setItem("conteudoCardVisual" + cardAtual, conteudoCardVisual.value);
    });
}

if (tituloCard) {
    tituloCard.addEventListener("input", () => {
        alterado = true;
        localStorage.setItem("tituloCard" + cardAtual, tituloCard.value);
    });
}

if (conteudoCard) {
    conteudoCard.addEventListener("input", () => {
        alterado = true;
        localStorage.setItem("conteudoCard" + cardAtual, conteudoCard.value);
    });
}

if (resumoCard) {
    resumoCard.addEventListener("input", () => {
        alterado = true;
        localStorage.setItem("resumoCard" + cardAtual, resumoCard.value);
    });
}





/* ========================= */
/* AVISO AO SAIR */
/* ========================= */

window.addEventListener("beforeunload", function (e) {

    if (alterado) {
        e.preventDefault();
        e.returnValue = "";
    }

});




function imprimirPDF() {

    // Recuperar os dados da segunda página

    const titulo = localStorage.getItem("tituloCard" + cardAtual) || "";

    const conteudo = localStorage.getItem("conteudoCard" + cardAtual) || "";

    // Criar a segunda página para impressão

    const paginaTexto = document.createElement("div");

    paginaTexto.id = "paginaTextoImpressao";

    const tituloElemento = document.createElement("h1");

    tituloElemento.textContent = titulo;

    const conteudoElemento = document.createElement("p");

    conteudoElemento.textContent = conteudo;

    paginaTexto.appendChild(tituloElemento);

    paginaTexto.appendChild(conteudoElemento);

    document.body.appendChild(paginaTexto);

    // Imprimir

    window.print();

    // Remover a página temporária

    window.addEventListener("afterprint", function removerPagina() {

        paginaTexto.remove();

        window.removeEventListener("afterprint", removerPagina);

    });

}



console.log("Card atual:", cardAtual);
console.log("Resumo:", localStorage.getItem("resumoCard" + cardAtual));
console.log("Título:", localStorage.getItem("tituloCard" + cardAtual));
console.log("Conteúdo:", localStorage.getItem("conteudoCard" + cardAtual));
