
/* ========================= */
/* PASTA ABERTA */
/* ========================= */

let pastaAberta =
null;


/* ========================= */
/* CARDS DE UMA PASTA */
/* ========================= */

function obterCardsDaPasta(numeroPasta){

  return JSON.parse(
    localStorage.getItem(
      "pastaCards" + numeroPasta
    )
  ) || [];

}


/* ========================= */
/* SALVAR CARDS DA PASTA */
/* ========================= */

function salvarPasta(
  numeroPasta,
  cards
){

  localStorage.setItem(
    "pastaCards" + numeroPasta,
    JSON.stringify(cards)
  );

}


/* ========================= */
/* PASTAS DENTRO DE UMA PASTA */
/* ========================= */

function obterPastasDaPasta(numeroPasta){

  return JSON.parse(
    localStorage.getItem(
      "subPastas" + numeroPasta
    )
  ) || [];

}


/* ========================= */
/* SALVAR SUBPASTAS */
/* ========================= */

function salvarPastasDaPasta(
  numeroPasta,
  pastas
){

  localStorage.setItem(
    "subPastas" + numeroPasta,
    JSON.stringify(pastas)
  );

}



/* ========================= */
/* ABRIR CARD */
/* ========================= */

function cardClick(numero){

  localStorage.setItem(
    "cardAtual",
    numero
  );

  window.location.href =
    "cardClicado.html";

}


/* ========================= */
/* QUANTIDADE */
/* ========================= */

let quantidadeCards =
Number(
  localStorage.getItem(
    "quantidadeCards"
  )
) || 0;


const area =
document.getElementById(
  "areaCards"
);


/* ========================= */
/* CARD SELECIONADO */
/* ========================= */

let divCardSelecionada =
null;


/* ========================= */
/* CARD SENDO ARRASTADO */
/* ========================= */

let cardArrastado =
null;


/* ========================= */
/* ORDEM DOS CARDS */
/* ========================= */

let ordemCards =
JSON.parse(
  localStorage.getItem(
    "ordemCards"
  )
) || [];


/* ========================= */
/* CORRIGIR ORDEM */
/* ========================= */

function corrigirOrdem(){



  if(ordemCards.length === 0){

    let cardsDentroDePastas = [];

    for(let chave in localStorage){

      if(chave.startsWith("pastaCards")){

        let cards =
          JSON.parse(
            localStorage.getItem(chave)
          ) || [];

        cardsDentroDePastas.push(...cards);

      }

    }

    for(let i = 0; i < quantidadeCards; i++){

      if(!cardsDentroDePastas.includes(i)){

        ordemCards.push(i);

      }

    }

  }




  let cardsDentroDePastas = [];

  for(let chave in localStorage){

    if(chave.startsWith("pastaCards")){

      let cards =
        JSON.parse(
          localStorage.getItem(chave)
        ) || [];

      cardsDentroDePastas.push(...cards);

    }

  }


  ordemCards =
    ordemCards.filter(
      numero =>
        !cardsDentroDePastas.includes(numero)
    );


  localStorage.setItem(
    "ordemCards",
    JSON.stringify(ordemCards)
  );

}


/* ========================= */
/* GERAR CARD */
/* ========================= */

function gerarCard(numero){

  const card =
  document.createElement(
    "div"
  );

  card.className =
  "divCard";

  card.dataset.numero = numero;
  card.dataset.tipo = "card";

  card.innerHTML = `

    <div class="lugarImagem">

      <img
        class="imagemCard"
      >

    </div>

    <div class="lugarTexto">

      <div class="lugarTextoPreview">

        <p></p>

      </div>

    </div>

  `;


  /* ========================= */
  /* IMAGEM */
  /* ========================= */

  const imagem =
  localStorage.getItem(
    "imagemCard" +
    numero
  );


  if(imagem){

    card
    .querySelector(
      ".imagemCard"
    )
    .src =
    imagem;

  }


  /* ========================= */
  /* TEXTO */
  /* ========================= */

  const resumo =
  localStorage.getItem(
    "resumoCard" +
    numero
  );


  if(resumo){

    card
    .querySelector(
      ".lugarTextoPreview p"
    )
    .innerHTML =
    resumo.replace(
      /\n/g,
      "<br>"
    );

  }


  /* ========================= */
  /* COR DO CARD */
  /* ========================= */

  const cor =
  localStorage.getItem(
    "corCard" +
    numero
  );


  if(cor){

    aplicarCorCard(
      card,
      cor
    );

  }


  /* ========================= */
  /* CLIQUE PARA ABRIR */
  /* ========================= */

  card.addEventListener(
    "click",
    function(){

      /*
      Se o card foi arrastado,
      não abre a página.
      */

      if(
        card.dataset.foiArrastado ===
        "true"
      ){

        card.dataset.foiArrastado =
        "false";

        return;

      }


      cardClick(
        numero
      );

    }
  );


  /* ========================= */
  /* ARRASTAR CARD */
  /* ========================= */

  configurarArrastar(
    card
  );


  area.appendChild(
    card
  );

}

/* ========================= */
/* APLICAR COR NO CARD INTEIRO */
/* ========================= */

function aplicarCorCard(
  card,
  cor
){

  /*
  Cor da divCard
  */

  card.style.backgroundColor =
  cor;


  /*
  Todos os elementos
  internos do card
  */

  const elementos =
  card.querySelectorAll(
    ".lugarImagem, .lugarTexto, .lugarTextoPreview"
  );


  elementos.forEach(
    elemento => {

      elemento.style.backgroundColor =
      cor;

    }
  );

}


/* ========================= */
/* BOTÕES DE CRIAÇÃO */
/* ========================= */

function gerarBotao(){

  const container =
  document.createElement("div");

  container.className =
  "containerBotoesCriar";


  /* ========================= */
  /* BOTÃO + */
  /* ========================= */

  const botao =
  document.createElement("div");

  botao.className =
  "botaoCriar";

  botao.innerHTML =
  "+";


  botao.onclick =
  () => {

    criarCardAtual();

  };


  /* ========================= */
  /* BOTÃO PASTA */
  /* ========================= */

  const botaoPasta =
  document.createElement("button");

  botaoPasta.className =
  "botaoPasta";

  botaoPasta.innerHTML =
  "📁";

  botaoPasta.title =
  "Criar pasta";


  botaoPasta.onclick =
  (event) => {

    event.stopPropagation();

    criarPastaAtual();

  };


  container.appendChild(botao);

  container.appendChild(botaoPasta);

  area.appendChild(container);

}


/* ========================= */
/* CRIAR CARD */
/* ========================= */

function criarCardAtual(){

    const novoNumero = quantidadeCards;

    /* Incrementa o identificador */
    quantidadeCards++;

    /* CARD DENTRO DE UMA PASTA */
    if(pastaAberta){

        let cardsDaPasta = obterCardsDaPasta(pastaAberta);

        cardsDaPasta.push(novoNumero);

        salvarPasta(pastaAberta, cardsDaPasta);

    }

    /* CARD NA TELA PRINCIPAL */
    else{

        ordemCards.push(novoNumero);

        localStorage.setItem(
            "ordemCards",
            JSON.stringify(ordemCards)
        );

    }

    localStorage.setItem(
        "quantidadeCards",
        quantidadeCards
    );

    renderizar();

}


/* ========================= */
/* CRIAR PASTA */
/* ========================= */

function criarPastaAtual(){

  let quantidadePastas =
  Number(
    localStorage.getItem(
      "quantidadePastas"
    )
  ) || 0;


  quantidadePastas++;

  const numeroPasta =
  quantidadePastas;


  localStorage.setItem(
    "quantidadePastas",
    quantidadePastas
  );


  /* Lista de cards da pasta */

  localStorage.setItem(
    "pastaCards" + numeroPasta,
    JSON.stringify([])
  );


  /* Nome padrão */

  localStorage.setItem(
    "nomePasta" + numeroPasta,
    "Nova pasta"
  );


  /* Se estiver dentro de outra pasta */

  if(pastaAberta){

    let itens =
    obterPastasDaPasta(
      pastaAberta
    );

    itens.push(numeroPasta);

    salvarPastasDaPasta(
      pastaAberta,
      itens
    );

  }

  else{

    let pastasPrincipais =
    JSON.parse(
      localStorage.getItem(
        "pastasPrincipais"
      )
    ) || [];


    pastasPrincipais.push(
      numeroPasta
    );


    localStorage.setItem(
      "pastasPrincipais",
      JSON.stringify(
        pastasPrincipais
      )
    );

  }


  renderizar();

}





/* ========================= */
/* RENDER */
/* ========================= */

function renderizar(){

  area.innerHTML = "";


  /* ========================= */
  /* DENTRO DE UMA PASTA */
  /* ========================= */

  if(pastaAberta){

    area.classList.add(
      "areaDentroPasta"
    );


    /* ========================= */
    /* CABEÇALHO */
    /* ========================= */

    const cabecalho =
    document.createElement("div");

    cabecalho.className =
    "cabecalhoPasta";


    const nome =
    localStorage.getItem(
      "nomePasta" + pastaAberta
    ) || "Pasta";


    cabecalho.innerHTML = `

      <button class="botaoVoltarPasta">
        ←
      </button>

      <h2>
        📁 ${nome}
      </h2>

    `;


    cabecalho
      .querySelector(
        ".botaoVoltarPasta"
      )
      .onclick = function(){

        pastaAberta = null;

        renderizar();

      };


    area.appendChild(
      cabecalho
    );


    /* ========================= */
    /* CARDS DA PASTA */
    /* ========================= */

    const cardsDaPasta =
    obterCardsDaPasta(
      pastaAberta
    );


    cardsDaPasta.forEach(
      numero => {

        gerarCard(
          numero
        );

      }
    );


    /* ========================= */
    /* SUBPASTAS */
    /* ========================= */

    const subPastas =
    obterPastasDaPasta(
      pastaAberta
    );


    subPastas.forEach(
      numeroPasta => {

        gerarPasta(
          numeroPasta
        );

      }
    );


    /* BOTÃO DE CRIAR */

    gerarBotao();

    return;

  }


  /* ========================= */
  /* TELA PRINCIPAL */
  /* ========================= */

  area.classList.remove(
    "areaDentroPasta"
  );


  corrigirOrdem();


  /* SOMENTE CARDS DA TELA PRINCIPAL */

  ordemCards.forEach(
    numero => {

      gerarCard(
        numero
      );

    }
  );


  /* SOMENTE PASTAS PRINCIPAIS */

  let pastasPrincipais =
  JSON.parse(
    localStorage.getItem(
      "pastasPrincipais"
    )
  ) || [];


  pastasPrincipais.forEach(
    numeroPasta => {

      gerarPasta(
        numeroPasta
      );

    }
  );


  gerarBotao();

}




/* ========================= */
/* INICIAR */
/* ========================= */

window.addEventListener(
  "load",
  renderizar
);


/* ========================= */
/* CONTEXT MENU */
/* ========================= */

const menu =
document.getElementById(
  "meuMenu"
);


/* ========================= */
/* ABRIR CONTEXT MENU */
/* ========================= */

document.addEventListener(
  "contextmenu",
  function(event){

    const elemento = event.target.closest(
      ".divCard"
    );

    if(!elemento){
      menu.style.display = "none";
      return;
    }

    const tipo = elemento.dataset.tipo;

    if(tipo !== "card" && tipo !== "pasta"){
      menu.style.display = "none";
      return;
    }

    event.preventDefault();

    divCardSelecionada = elemento;

    menu.style.display = "block";

    menu.style.left = event.clientX + "px";
    menu.style.top = event.clientY + "px";

  }
);


/* ========================= */
/* FECHAR MENU */
/* ========================= */

document.addEventListener(
  "click",
  function(event){

    if(
      !menu.contains(
        event.target
      )
    ){

      menu.style.display =
      "none";

    }

  }
);

/* ========================= */
/* DUPLICAR PASTA COMPLETA */
/* ========================= */

function duplicarPastaCompleta(numeroOriginal){

  let quantidadePastas = Number(
    localStorage.getItem("quantidadePastas")
  ) || 0;

  const novaPasta = ++quantidadePastas;

  localStorage.setItem("quantidadePastas", quantidadePastas);

  /* Copia nome e cor */

  localStorage.setItem(
    "nomePasta" + novaPasta,
    (localStorage.getItem("nomePasta" + numeroOriginal) || "Nova pasta") + " (cópia)"
  );

  const cor = localStorage.getItem("corPasta" + numeroOriginal);

  if(cor){
    localStorage.setItem("corPasta" + novaPasta, cor);
  }

  /* Copia os cards da pasta */

  const cardsOriginais = obterCardsDaPasta(numeroOriginal);

  const novosCards = [];

  cardsOriginais.forEach(numeroCard => {

    const novoNumero = quantidadeCards++;

    ["imagemCard", "resumoCard", "corCard"].forEach(chave => {

      const valor = localStorage.getItem(chave + numeroCard);

      if(valor !== null){
        localStorage.setItem(chave + novoNumero, valor);
      }

    });

    novosCards.push(novoNumero);

  });

  localStorage.setItem(
    "quantidadeCards",
    quantidadeCards
  );

  salvarPasta(novaPasta, novosCards);

  /* Copia as subpastas recursivamente */

  const subPastasOriginais = obterPastasDaPasta(numeroOriginal);

  const novasSubPastas = subPastasOriginais.map(
    numeroSubPasta => duplicarPastaCompleta(numeroSubPasta)
  );

  salvarPastasDaPasta(novaPasta, novasSubPastas);

  return novaPasta;

}
/* ========================= */
/* MUDAR COR */
/* ========================= */

function mudarCor(){

  if(!divCardSelecionada) return;

  const numero = Number(
    divCardSelecionada.dataset.numero
  );

  const tipo = divCardSelecionada.dataset.tipo;

  const chaveCor = tipo === "pasta"
    ? "corPasta" + numero
    : "corCard" + numero;

  const seletorCor = document.createElement("input");

  seletorCor.type = "color";

  seletorCor.value =
    localStorage.getItem(chaveCor) || "#ffffff";

  seletorCor.addEventListener("input", function(){

    aplicarCorCard(
      divCardSelecionada,
      seletorCor.value
    );

  });

  seletorCor.addEventListener("change", function(){

    localStorage.setItem(
      chaveCor,
      seletorCor.value
    );

  });

  seletorCor.click();

  menu.style.display = "none";

}


/* ========================= */
/* EXCLUIR CARD */
/* ========================= */

/* ========================= */
/* EXCLUIR CARD OU PASTA */
/* ========================= */

function acao3(){

  if(!divCardSelecionada) return;

  const numero = Number(
    divCardSelecionada.dataset.numero
  );

  const tipo = divCardSelecionada.dataset.tipo;

  /* ========================= */
  /* EXCLUIR CARD */
  /* ========================= */

  if(tipo === "card"){

    localStorage.removeItem("imagemCard" + numero);
    localStorage.removeItem("resumoCard" + numero);
    localStorage.removeItem("corCard" + numero);

    if(pastaAberta){

      let lista = obterCardsDaPasta(pastaAberta);

      lista = lista.filter(item => item !== numero);

      salvarPasta(pastaAberta, lista);

    } else {

      ordemCards = ordemCards.filter(item => item !== numero);

      localStorage.setItem(
        "ordemCards",
        JSON.stringify(ordemCards)
      );

    }

  }

  /* ========================= */
  /* EXCLUIR PASTA */
  /* ========================= */

  else if(tipo === "pasta"){

    excluirPastaCompleta(numero);

    if(pastaAberta){

      let lista = obterPastasDaPasta(pastaAberta);

      lista = lista.filter(item => item !== numero);

      salvarPastasDaPasta(pastaAberta, lista);

    } else {

      let lista = JSON.parse(
        localStorage.getItem("pastasPrincipais")
      ) || [];

      lista = lista.filter(item => item !== numero);

      localStorage.setItem(
        "pastasPrincipais",
        JSON.stringify(lista)
      );

    }

  }

  menu.style.display = "none";

  divCardSelecionada = null;

  renderizar();

}


/* ========================= */
/* EXCLUIR CONTEÚDO DA PASTA */
/* ========================= */

function excluirPastaCompleta(numeroPasta){

  /* Exclui os cards */

  const cards = obterCardsDaPasta(numeroPasta);

  cards.forEach(numeroCard => {

    localStorage.removeItem("imagemCard" + numeroCard);
    localStorage.removeItem("resumoCard" + numeroCard);
    localStorage.removeItem("corCard" + numeroCard);

  });

  /* Exclui as subpastas */

  const subPastas = obterPastasDaPasta(numeroPasta);

  subPastas.forEach(numeroSubPasta => {

    excluirPastaCompleta(numeroSubPasta);

  });

  /* Exclui os dados da pasta */

  localStorage.removeItem("pastaCards" + numeroPasta);
  localStorage.removeItem("subPastas" + numeroPasta);
  localStorage.removeItem("nomePasta" + numeroPasta);
  localStorage.removeItem("corPasta" + numeroPasta);

}

/* ========================= */
/* CONFIGURAR ARRASTAR */
/* ========================= */

function configurarArrastar(
  card
){

  let pressionado =
  false;

  let arrastando =
  false;

  let inicioX =
  0;

  let inicioY =
  0;


  /*
  Começou a pressionar
  */

  card.addEventListener(
    "pointerdown",
    function(event){

      /*
      Apenas botão esquerdo
      do mouse
      */

      if(
        event.pointerType === "mouse" &&
        event.button !== 0
      ){

        return;

      }


      pressionado =
      true;


      arrastando =
      false;


      inicioX =
      event.clientX;


      inicioY =
      event.clientY;


      card.setPointerCapture(
        event.pointerId
      );

    }
  );


  /*
  Movendo o mouse/dedo
  */

  card.addEventListener(
    "pointermove",
    function(event){

      if(
        !pressionado
      ){

        return;

      }


      const distanciaX =
      Math.abs(
        event.clientX -
        inicioX
      );


      const distanciaY =
      Math.abs(
        event.clientY -
        inicioY
      );


      /*
      Só considera arrasto
      depois de mover alguns pixels
      */

      if(
        distanciaX > 10 ||
        distanciaY > 10
      ){

        arrastando =
        true;


        card.dataset.foiArrastado =
        "true";


        card.classList.add(
          "cardArrastando"
        );


        /*
        Descobre qual card
        está embaixo do mouse
        */

        const elemento =
        document.elementFromPoint(
          event.clientX,
          event.clientY
        );


        const cardDestino =
        elemento
        ?.closest(
          ".divCard"
        );


        /*
        Se encontrou outro card
        */

        if(
          cardDestino &&
          cardDestino !== card
        ){

          trocarPosicaoCards(
            card,
            cardDestino
          );

        }

      }

    }
  );


  /*
  Soltou o mouse/dedo
  */

  card.addEventListener(
    "pointerup",
    function(event){

      pressionado =
      false;


      if(
        arrastando
      ){

        card.dataset.foiArrastado =
        "true";

      }


      card.classList.remove(
        "cardArrastando"
      );


      try{

        card.releasePointerCapture(
          event.pointerId
        );

      }
      catch(error){

      }

    }
  );


  /*
  Cancelamento
  */

  card.addEventListener(
    "pointercancel",
    function(){

      pressionado =
      false;


      arrastando =
      false;


      card.classList.remove(
        "cardArrastando"
      );

    }
  );

}
/* ========================= */
/* TROCAR POSIÇÃO DOS CARDS */
/* ========================= */

function trocarPosicaoCards(cardOrigem, cardDestino){

    /* Só permite trocar cards com cards */
    if(
        cardOrigem.dataset.tipo !== "card" ||
        cardDestino.dataset.tipo !== "card"
    ){
        return;
    }

    /* Seleciona somente os cards */
    const cards = Array.from(
        area.querySelectorAll('.divCard[data-tipo="card"]')
    );

    const indiceOrigem = cards.indexOf(cardOrigem);
    const indiceDestino = cards.indexOf(cardDestino);

    if(
        indiceOrigem === -1 ||
        indiceDestino === -1
    ){
        return;
    }

    /* Identifica a lista correta */
    let lista;

    if(pastaAberta){

        lista = obterCardsDaPasta(pastaAberta);

    } else {

        lista = ordemCards;

    }

    /* Troca os identificadores */
    const numeroTemporario = lista[indiceOrigem];

    lista[indiceOrigem] = lista[indiceDestino];

    lista[indiceDestino] = numeroTemporario;

    /* Salva a nova ordem */
    if(pastaAberta){

        salvarPasta(pastaAberta, lista);

    } else {

        localStorage.setItem(
            "ordemCards",
            JSON.stringify(ordemCards)
        );

    }

    /* Atualiza a posição visual */
    if(indiceOrigem < indiceDestino){

        cardDestino.after(cardOrigem);

    } else {

        cardDestino.before(cardOrigem);

    }

}



/* ========================= */
/* GERAR PASTA */
/* ========================= */

function gerarPasta(numeroPasta){

  const pasta =
  document.createElement("div");


  pasta.className =
  "divCard pastaCard";
  pasta.dataset.tipo = "pasta";
  pasta.dataset.numero = numeroPasta;

  pasta.innerHTML = `

    <div class="lugarImagem pastaImagem">

      <div class="iconePasta">
        📁
      </div>

    </div>

    <div class="lugarTexto">

      <div class="lugarTextoPreview">

        <p></p>

      </div>

    </div>

  `;


  /* ========================= */
  /* NOME */
/* ========================= */

  const nome =
  localStorage.getItem(
    "nomePasta" + numeroPasta
  ) || "Nova pasta";


  pasta
    .querySelector(
      ".lugarTextoPreview p"
    )
    .textContent =
    nome;


  /* ========================= */
  /* COR */
  /* ========================= */

  const cor =
  localStorage.getItem(
    "corPasta" + numeroPasta
  );

  if(cor){

    aplicarCorCard(
      pasta,
      cor
    );

  }


  /* ========================= */
  /* ABRIR */
/* ========================= */

  pasta.addEventListener(
    "click",
    function(){

      pastaAberta =
      numeroPasta;

      renderizar();

    }
  );


  area.appendChild(
    pasta
  );

}
