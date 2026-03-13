/* ============================================================
   UTILS.JS — Funções utilitárias compartilhadas
   Carregado antes de todos os outros scripts.
   Disponibiliza funções globais usadas em qualquer página:
   - formatarPreco()  → formata números como moeda brasileira
   - api()            → wrapper para chamadas fetch à API
   - toast()          → notificações visuais temporárias
   ============================================================ */


/* ── FORMATAR PREÇO ────────────────────────────────────────────
   Converte um número para o formato de moeda brasileira.
   Ex: 3500 → "R$ 3.500,00"
   ─────────────────────────────────────────────────────────── */
function formatarPreco(valor) {

  /* Se valor for null, undefined, 0 ou vazio → retorna "Consultar"
     O operador ! converte para booleano: !null = true, !0 = true */
  if (!valor) return 'Consultar';

  /* Intl.NumberFormat é a API nativa do JavaScript para formatação
     de números internacionalizada — sem biblioteca externa.
     'pt-BR' → formato brasileiro (ponto para milhar, vírgula para decimal)
     style: 'currency' → adiciona o símbolo da moeda
     currency: 'BRL'   → Real brasileiro (R$) */
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  /* .format(valor) executa a formatação e retorna a string */
  }).format(valor);

}


/* ── CHAMADA À API ─────────────────────────────────────────────
   Wrapper sobre o fetch nativo do browser.
   Centraliza: URL base, headers padrão e tratamento de erros.
   Uso: const dados = await api('/produtos?destaque=true')
   ─────────────────────────────────────────────────────────── */

/* async function → função assíncrona que pode usar await.
   endpoint → caminho da rota (ex: '/produtos', '/categorias/1')
   opcoes   → objeto opcional com method, body etc. Padrão: {} vazio */
async function api(endpoint, opcoes = {}) {

  /* try/catch: tenta executar o bloco, se der erro cai no catch */
  try {

    /* fetch faz a requisição HTTP.
       Template literal `...` permite inserir variáveis com ${}.
       Todas as chamadas usam /api como prefixo base.
       O spread ...opcoes mescla as opções extras passadas pelo chamador. */
    const resposta = await fetch(`/api${endpoint}`, {

      /* Header padrão: avisa o servidor que enviamos/esperamos JSON */
      headers: { 'Content-Type': 'application/json' },

      /* Spread operator: copia todas as propriedades de opcoes aqui.
         Se opcoes tiver headers próprio, sobrescreve o padrão acima.
         Se opcoes tiver method: 'POST' e body: '...', adiciona aqui. */
      ...opcoes

    });

    /* await pausa a função até a resposta chegar.
       .json() lê o corpo da resposta e converte de JSON para objeto JS.
       Também é assíncrono — precisamos de await. */
    const dados = await resposta.json();

    /* resposta.ok é true para status 200-299, false para 400-599.
       Se o servidor retornou erro (ex: 404, 500), lançamos exceção
       com a mensagem de erro que veio do backend. */
    if (!resposta.ok) throw new Error(dados.erro || 'Erro na requisição');

    /* Retorna os dados para quem chamou a função */
    return dados;

  } catch (err) {

    /* console.error exibe em vermelho no DevTools — para depuração.
       Template literal monta uma mensagem com o endpoint e o erro. */
    console.error(`Erro na API [${endpoint}]:`, err.message);

    /* throw relança o erro para que o código que chamou api()
       possa tratá-lo com seu próprio try/catch */
    throw err;

  }

}


/* ── TOAST (notificação temporária) ────────────────────────────
   Exibe uma mensagem flutuante no canto inferior direito
   que desaparece automaticamente após 3 segundos.
   Uso: toast('Produto salvo!') ou toast('Erro!', 'erro')
   ─────────────────────────────────────────────────────────── */

/* tipo pode ser: 'sucesso' (verde), 'erro' (vermelho) ou 'info' (azul)
   O valor padrão 'sucesso' é usado quando tipo não é informado. */
function toast(mensagem, tipo = 'sucesso') {

  /* createElement cria um novo elemento <div> na memória —
     ainda não está visível na página. */
  const el = document.createElement('div');

  /* textContent define o texto do elemento.
     Mais seguro que innerHTML: não interpreta HTML,
     prevenindo ataques XSS (injeção de código). */
  el.textContent = mensagem;

  /* cssText define vários estilos de uma vez como string.
     Equivale a definir element.style.propriedade um por um. */
  el.style.cssText = `
    position: fixed;      /* flutua sobre todo o conteúdo */
    bottom: 24px;         /* 24px acima da base da tela */
    right: 24px;          /* 24px da borda direita */
    z-index: 9999;        /* na frente de absolutamente tudo */
    padding: 14px 24px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    color: white;

    /* Operador ternário: condição ? valor_se_true : valor_se_false
       Escolhe a cor de fundo com base no tipo da mensagem */
    background: ${tipo === 'sucesso' ? '#38a169' : tipo === 'erro' ? '#e53e3e' : '#1565C0'};

    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: fadeInUp 0.3s ease; /* usa @keyframes do reset.css */
    transition: opacity 0.3s ease; /* anima o desaparecimento */
  `;

  /* appendChild adiciona o elemento ao final do <body>.
     Só agora ele aparece visualmente na página. */
  document.body.appendChild(el);

  /* setTimeout executa uma função após um delay em milissegundos.
     3000ms = 3 segundos — tempo que o toast fica visível. */
  setTimeout(() => {

    /* Inicia a animação de saída: opacity 0 = invisível.
       A transição CSS anima suavemente em 0.3s. */
    el.style.opacity = '0';

    /* Após 300ms (tempo da animação de saída), remove o elemento
       do DOM completamente — sem rastro no HTML. */
    setTimeout(() => el.remove(), 300);

  }, 3000);

}