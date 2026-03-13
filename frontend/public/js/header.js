/* ============================================================
   HEADER.JS — Comportamento interativo do header
   Responsabilidades:
   1. Efeito frosted glass ao rolar a página
   2. Menu mobile: abrir, fechar, animar hambúrguer → X
   3. Marcar o link ativo com base na URL atual
   ============================================================ */


/* ── 1. EFEITO SCROLL ──────────────────────────────────────────
   Adiciona a classe .scrolled ao header quando o usuário
   rola mais de 20px. O CSS usa essa classe para aplicar
   o fundo fosco (backdrop-filter: blur).
   ─────────────────────────────────────────────────────────── */

/* document.getElementById('header') busca o elemento com id="header"
   no DOM (Document Object Model — a árvore de elementos da página).
   Guardamos em uma variável para não repetir a busca toda vez. */
const header = document.getElementById('header');

/* Verificamos se o header existe antes de usar.
   Se o arquivo header.js for carregado em uma página sem header,
   não vai dar erro — a condição simplesmente será falsa. */
if (header) {

  /* window.addEventListener escuta eventos na janela do browser.
     'scroll' dispara continuamente enquanto o usuário rola.
     A função flecha () => {} é executada a cada disparo. */
  window.addEventListener('scroll', () => {

    /* window.scrollY → quantos pixels o usuário rolou verticalmente.
       classList.toggle(classe, condicao):
       - Se condicao for TRUE  → adiciona a classe
       - Se condicao for FALSE → remove a classe
       Resultado: .scrolled aparece após 20px de scroll e some ao voltar ao topo. */
    header.classList.toggle('scrolled', window.scrollY > 20);

  /* { passive: true } → promessa ao browser de que não vamos chamar
     preventDefault() dentro deste evento. Isso permite que o browser
     otimize a performance da rolagem. Sempre use em scroll e touch. */
  }, { passive: true });

}


/* ── 2. MENU MOBILE ────────────────────────────────────────────
   Controla abertura e fechamento do menu em telas pequenas.
   Também anima o ícone hambúrguer → X via aria-expanded.
   ─────────────────────────────────────────────────────────── */

/* Buscamos os dois elementos que vamos manipular */
const menuBtn = document.getElementById('menuBtn'); /* botão hambúrguer */
const nav     = document.getElementById('nav');     /* a navegação */

/* Só executamos se ambos existirem na página */
if (menuBtn && nav) {

  /* Ao clicar no botão hambúrguer */
  menuBtn.addEventListener('click', () => {

    /* classList.toggle('aberto') alterna a classe:
       - Se não tem .aberto → adiciona e retorna TRUE
       - Se já tem .aberto  → remove e retorna FALSE
       O CSS usa .aberto para deslizar o menu para baixo (translateY). */
    const estaAberto = nav.classList.toggle('aberto');

    /* setAttribute atualiza o atributo aria-expanded no HTML.
       Leitores de tela anunciam "expandido" ou "recolhido"
       quando o usuário interage com o botão.
       O CSS também usa [aria-expanded="true"] para animar o X. */
    menuBtn.setAttribute('aria-expanded', estaAberto);

  });

  /* Fecha o menu ao clicar em qualquer link dentro da nav.
     querySelectorAll retorna todos os <a> dentro do nav.
     forEach itera sobre cada um adicionando o listener. */
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {

      /* Remove a classe que mantém o menu aberto */
      nav.classList.remove('aberto');

      /* Atualiza aria-expanded para false — menu fechado */
      menuBtn.setAttribute('aria-expanded', 'false');

    });
  });

  /* Fecha o menu ao clicar em qualquer lugar FORA do header.
     Este listener fica no document inteiro — captura todos os cliques. */
  document.addEventListener('click', (evento) => {

    /* evento.target → o elemento exato que foi clicado.
       header.contains(elemento) → retorna TRUE se o elemento
       está dentro do header (é filho/descendente dele).
       O ! inverte: TRUE se clicou FORA do header. */
    const clicouForaDoHeader = !header.contains(evento.target);

    if (clicouForaDoHeader) {
      nav.classList.remove('aberto');
      menuBtn.setAttribute('aria-expanded', 'false');
    }

  });

}


/* ── 3. LINK ATIVO ─────────────────────────────────────────────
   Marca automaticamente o link da página atual na navegação.
   O CSS usa aria-current="page" para mostrar o indicador visual.
   ─────────────────────────────────────────────────────────── */

/* window.location é um objeto com informações sobre a URL atual.
   .pathname retorna só o caminho, sem domínio nem porta.
   Ex: em "http://localhost:5500/catalogo" retorna "/catalogo"
   Ex: em "http://localhost:5500/"        retorna "/"          */
const paginaAtual = window.location.pathname;

/* Buscamos todos os links dentro da navegação */
document.querySelectorAll('.header__nav a').forEach(link => {

  /* getAttribute('href') pega o valor do atributo href do link.
     Comparamos com o caminho atual da URL. */
  const ehPaginaAtual = link.getAttribute('href') === paginaAtual;

  if (ehPaginaAtual) {
    /* setAttribute adiciona/atualiza um atributo HTML.
       aria-current="page" é o padrão de acessibilidade
       para indicar a página atual em uma navegação. */
    link.setAttribute('aria-current', 'page');
  } else {
    /* removeAttribute remove o atributo completamente do HTML.
       Garante que apenas um link tenha aria-current por vez. */
    link.removeAttribute('aria-current');
  }

});