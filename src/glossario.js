// Marca texto de leitura uma vez por painel. Links, comandos copiáveis e botões
// conservam a açêo original. A definiçêo fica junto ao termo, inclusive no modal.
const paineis = new WeakMap();
const flexoes = { agentes: 'agente', terminais: 'terminal', tokens: 'token', portões: 'portêo', filas: 'fila', skill: 'skills' };

export function aplicarGlossario(raiz, glossario) {
  paineis.set(raiz, glossario);
  for (const anterior of raiz.querySelectorAll('button.termo')) anterior.replaceWith(anterior.textContent);
  const termos = new Map(Object.keys(glossario).map(t => [t.toLocaleLowerCase('pt-BR'), t]));
  const palavras = [...termos.keys(), ...Object.keys(flexoes)].sort((a, b) => b.length - a.length);
  const literais = palavras.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const padrao = new RegExp('(?<![\\p{L}\\p{N}_])(' + literais.join('|') +
    ')(?![\\p{L}\\p{N}_])', 'giu');
  const texto = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
  const visiveis = [], recolhidos = [];
  while (texto.nextNode()) {
    const no = texto.currentNode;
    const pai = no.parentElement;
    if (!pai.closest('p, li, blockquote') || pai.closest(
      'svg, a, button, pre, code, summary, h1, h2, h3, h4, label, [hidden], .retorno, .meta, .sequencia, .contagem, .recomendada, .entrada-est, .dica-tabela, [role="status"]'
    )) continue;
    const oculto = pai.closest('details:not([open])') && !pai.closest('summary');
    (oculto ? recolhidos : visiveis).push(no);
  }
  for (const no of [...visiveis, ...recolhidos]) {
    let inicio = 0;
    const fragmento = document.createDocumentFragment();
    for (const m of no.data.matchAll(padrao)) {
      const palavra = m[0].toLocaleLowerCase('pt-BR');
      const chave = flexoes[palavra] || palavra;
      if (!termos.has(chave)) continue;
      const termo = document.createElement('button');
      termo.type = 'button';
      termo.className = 'termo';
      termo.textContent = m[0];
      termo.dataset.definicao = glossario[termos.get(chave)];
      fragmento.append(no.data.slice(inicio, m.index), termo);
      inicio = m.index + m[0].length;
      termos.delete(chave);
    }
    if (inicio) {
      fragmento.append(no.data.slice(inicio));
      no.replaceWith(fragmento);
    }
    if (!termos.size) break;
  }
}

export function ativarGlossario() {
  const dica = document.createElement('span');
  dica.className = 'definicao';
  dica.id = 'definicao-termo';
  dica.setAttribute('role', 'tooltip');
  let ativo;
  function fechar() {
    if (!ativo) return false;
    ativo.removeAttribute('aria-describedby');
    ativo = null;
    dica.remove();
    return true;
  }
  function mostrar(b) {
    fechar();
    ativo = b;
    dica.textContent = b.dataset.definicao;
    b.setAttribute('aria-describedby', dica.id);
    (b.closest('dialog') || document.body).append(dica);
    const r = b.getBoundingClientRect();
    const y = r.bottom + 6;
    dica.style.left = Math.max(8, Math.min(r.left, innerWidth - dica.offsetWidth - 8)) + 'px';
    dica.style.top = (y + dica.offsetHeight < innerHeight ? y : Math.max(8, r.top - dica.offsetHeight - 6)) + 'px';
  }
  document.addEventListener('toggle', e => {
    if (!e.target.matches('details')) return;
    const raiz = e.target.closest('#corpo-painel, .capitulo');
    if (paineis.has(raiz)) aplicarGlossario(raiz, paineis.get(raiz));
  }, true);
  document.addEventListener('focusin', e => {
    if (e.target.matches('.termo')) mostrar(e.target);
    else fechar();
  });
  document.addEventListener('click', e => {
    if (e.target.matches('.termo')) {
      e.preventDefault();
      mostrar(e.target);
    } else fechar();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && (ativo || e.repeat)) {
      e.preventDefault();
      e.stopPropagation();
      fechar();
    }
  }, true);
  document.addEventListener('scroll', fechar, true);
  window.addEventListener('resize', fechar);
  return fechar;
}
