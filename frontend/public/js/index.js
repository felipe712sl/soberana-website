/* ============================================================
   INDEX.JS — Lógica específica da landing page (index.html)
   Responsabilidades futuras (preenchidas nos próximos elementos):
   - Elemento 5: carregar produtos em destaque da API
   - Elemento 7: carregar depoimentos
   - Elemento 8: enviar formulário de contato
   
   Por enquanto: confirma que o JS está carregando corretamente.
   ============================================================ */

/* DOMContentLoaded dispara quando o HTML foi completamente
   lido e parseado — todos os elementos existem no DOM.
   Diferente de 'load' que espera imagens e CSS também.
   É o momento seguro para começar a manipular elementos. */
document.addEventListener("DOMContentLoaded", () => {
  /* console.log exibe mensagem informativa no DevTools (F12).
     Verde no console = JavaScript funcionando corretamente.
     Removeremos este log quando o site for para produção. */
  console.log("Soberana — página carregada ✅");
  inicializarCarrossel();
  /* Os próximos elementos vão adicionar chamadas aqui:
     carregarProdutosDestaque();
     carregarDepoimentos();
     inicializarFormulario();  */
  inicializarTituloDinamico();
  inicializarParceiros();
});

/* ── CARROSSEL ─────────────────────────────────────────────────
   Lógica de funcionamento:
   1. Buscamos a faixa e os slides do DOM
   2. Criamos as bolinhas indicadoras dinamicamente
   3. A função irPara(indice) move a faixa com translateX
   4. Os botões anterior/próximo chamam irPara()
   5. Auto-avanço a cada 5 segundos
   ─────────────────────────────────────────────────────────── */
function inicializarCarrossel() {
  /* Buscamos todos os elementos necessários */
  const faixa = document.getElementById("carrosselFaixa");
  const btnPrev = document.getElementById("carrosselPrev");
  const btnNext = document.getElementById("carrosselNext");
  const indicadores = document.getElementById("carrosselIndicadores");

  /* Se algum elemento não existir, saímos sem erro */
  if (!faixa || !btnPrev || !btnNext || !indicadores) return;

  /* querySelectorAll retorna todos os slides da faixa */
  const slides = faixa.querySelectorAll(".carrossel__slide");
  const total = slides.length;
  /* Índice do slide atual — começa no primeiro (0) */
  let atual = 0;
  /* Variável para o temporizador do auto-avanço.
     Guardamos para poder cancelar ao clicar nos botões. */
  let autoAvancar;

  /* ── CRIAR BOLINHAS ──
     Para cada slide, criamos um <button> indicador.
     O atributo data-indice guarda qual slide ele representa. */
  slides.forEach((_, i) => {
    const bolinha = document.createElement("button");
    bolinha.classList.add("carrossel__indicador");
    bolinha.setAttribute("aria-label", `Ir para foto ${i + 1}`);
    bolinha.setAttribute("data-indice", i);

    /* Clique na bolinha: vai para o slide correspondente */
    bolinha.addEventListener("click", () => {
      irPara(i);
      reiniciarAutoAvancar(); /* reseta o timer ao clicar */
    });

    indicadores.appendChild(bolinha);
  });

  /* ── IR PARA UM SLIDE ──
     Recebe o índice desejado e move a faixa.
     translateX(-N * 100%) move N slides para a esquerda. */
  function irPara(indice) {
    /* Garante que o índice nunca saia dos limites.
       Se passar do último, volta ao primeiro (loop). */
    atual = (indice + total) % total;
    /* Move a faixa: cada slide tem 100% de largura,
       então mover N slides = -N * 100% */
    faixa.style.transform = `translateX(-${atual * 100}%)`;

    /* Atualiza as bolinhas: remove .ativo de todas,
       adiciona apenas na bolinha do slide atual */
    indicadores.querySelectorAll(".carrossel__indicador").forEach((b, i) => {
      b.classList.toggle("ativo", i === atual);
    });
  }

  /* ── BOTÕES ── */
  btnPrev.addEventListener("click", () => {
    irPara(atual - 1);
    reiniciarAutoAvancar();
  });

  btnNext.addEventListener("click", () => {
    irPara(atual + 1);
    reiniciarAutoAvancar();
  });

  /* ── AUTO-AVANÇO ──
  Avança automaticamente a cada 5 segundos.
     setInterval executa a função repetidamente no intervalo dado.
     clearInterval cancela o timer — usado ao clicar nos botões 
     para evitar que o slide pule logo após a interação manual. */
  function iniciarAutoAvancar() {
    autoAvancar = setInterval(() => irPara(atual + 1), 5000);
  }

  /* Cancela o timer atual e inicia um novo.
     Evita que o auto-avanço "pule" logo após o usuário clicar. */
  function reiniciarAutoAvancar() {
    clearInterval(autoAvancar);
    iniciarAutoAvancar();
  }

  /* Inicializa no primeiro slide e começa o auto-avanço */
  irPara(0);
  iniciarAutoAvancar();
}

/* ── TÍTULO DINÂMICO ───────────────────────────────────────────
   Troca a palavra do hero a cada 2.5 segundos.
   Animação: a palavra atual sobe e some (saindo),
   a nova desce e aparece (entrando).
   ─────────────────────────────────────────────────────────── */
function inicializarTituloDinamico() {

  const elemento = document.getElementById('palavraDinamica');
  if (!elemento) return;

  const palavras = ['conforto.', 'economia.', 'tranquilidade.', 'tempo.'];
  let indice = 0;

  setInterval(() => {

    /* FASE 1: anima a saída da palavra atual */
    elemento.classList.add('saindo');

    /* Após 300ms (duração da transição CSS), troca o texto */
    setTimeout(() => {

      /* Avança para a próxima palavra — volta ao início ao terminar */
      indice = (indice + 1) % palavras.length;
      elemento.textContent = palavras[indice];

      /* Remove .saindo e adiciona .entrando para animar a entrada */
      elemento.classList.remove('saindo');
      elemento.classList.add('entrando');

      /* Um frame depois, remove .entrando — o CSS anima para o estado normal */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          elemento.classList.remove('entrando');
        });
      });

    }, 300); /* mesmo tempo da transition CSS */

  }, 2500); /* intervalo entre trocas — ajuste ao seu gosto */

}

/* ── PARCEIROS ─────────────────────────────────────────────────
   Mesmo padrão do carrossel de fotos — reutilizamos a lógica.
   Auto-avanço a cada 5 segundos, botões e indicadores.
   ─────────────────────────────────────────────────────────── */
function inicializarParceiros() {

  const faixa       = document.getElementById('parceirosFaixa');
  const btnPrev     = document.getElementById('parceirosPrev');
  const btnNext     = document.getElementById('parceirosNext');
  const indicadores = document.getElementById('parceirosIndicadores');

  if (!faixa || !btnPrev || !btnNext || !indicadores) return;

  const slides = faixa.querySelectorAll('.parceiros__slide');
  const total  = slides.length;
  let atual    = 0;
  let autoAvancar;

  /* Cria os indicadores dinamicamente */
  slides.forEach((_, i) => {
    const traço = document.createElement('button');
    traço.classList.add('parceiros__indicador');
    traço.setAttribute('aria-label', `Ver parceiro ${i + 1}`);
    traço.addEventListener('click', () => {
      irPara(i);
      reiniciarAutoAvancar();
    });
    indicadores.appendChild(traço);
  });

  function irPara(indice) {
    atual = (indice + total) % total;
    faixa.style.transform = `translateX(-${atual * 100}%)`;
    indicadores.querySelectorAll('.parceiros__indicador').forEach((t, i) => {
      t.classList.toggle('ativo', i === atual);
    });
  }

  btnPrev.addEventListener('click', () => { irPara(atual - 1); reiniciarAutoAvancar(); });
  btnNext.addEventListener('click', () => { irPara(atual + 1); reiniciarAutoAvancar(); });

  function iniciarAutoAvancar() {
    autoAvancar = setInterval(() => irPara(atual + 1), 5000);
  }

  function reiniciarAutoAvancar() {
    clearInterval(autoAvancar);
    iniciarAutoAvancar();
  }

  irPara(0);
  iniciarAutoAvancar();
}