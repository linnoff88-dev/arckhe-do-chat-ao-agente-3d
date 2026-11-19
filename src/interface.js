import { chegada, posicoes, planta as casa } from './planta.js';
import { aplicarGlossario, ativarGlossario } from './glossario.js';

export const controlesDeToque = () =>
  matchMedia('(any-pointer: coarse), (max-width: 620px), (max-width: 820px) and (max-height: 500px)').matches;

const $ = (id) => document.getElementById(id);
export const escapar = (valor) =>
  String(valor ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
const ico = (id) => `<svg class="icone" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const numero = (n) => String(n).padStart(2, '0');
function urlSegura(valor) {
  try {
    const u = new URL(valor);
    return u.protocol === 'https:' ? escapar(u.href) : '';
  } catch {
    return '';
  }
}
function link(url, rotulo) {
  return /* HTML */ `<a class="externo" href="${urlSegura(url)}" target="_blank" rel="noopener noreferrer"
    >${escapar(rotulo)} ${ico('fora')}</a
  >`;
}
function linha(texto) {
  // Tokenize raw text once so markup can never originate in the course data.
  return String(texto)
    .split(/(`[^`\n]+`|\*\*[^*]+\*\*|https:\/\/[^\s)<>]+)/g)
    .map((t) => {
      if (t.startsWith('`') && t.endsWith('`') && t.length > 1)
        return /* HTML */ `<code>${escapar(t.slice(1, -1))}</code>`;
      if (t.startsWith('**') && t.endsWith('**')) return /* HTML */ `<strong>${escapar(t.slice(2, -2))}</strong>`;
      if (t.startsWith('https://')) return link(t, t);
      return escapar(t);
    })
    .join('');
}
export function markdown(texto) {
  const linhas = String(texto).split(/\r?\n/),
    html = [];
  let i = 0;
  while (i < linhas.length) {
    const l = linhas[i++];
    if (!l.trim()) continue;
    if (/^```/.test(l)) {
      const codigo = [];
      while (i < linhas.length && !/^```/.test(linhas[i])) codigo.push(linhas[i++]);
      i++;
      html.push(
        `<div class="codigo"><button data-acao="copiar">Copiar código</button><pre tabindex="0"><code>${escapar(codigo.join('\n'))}</code></pre></div>`
      );
    } else if (/^\|/.test(l)) {
      const row = (s, tag) =>
        '<tr>' +
        s
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => `<${tag}>${linha(c.trim())}</${tag}>`)
          .join('') +
        '</tr>';
      const rows = [];
      if (i < linhas.length && /^\|[\s:|-]+\|$/.test(linhas[i])) i++;
      while (i < linhas.length && linhas[i].startsWith('|')) rows.push(row(linhas[i++], 'td'));
      html.push(
        '<p class="dica-tabela">Deslize a tabela para ver todas as colunas.</p><div class="rolar-tabela" tabindex="0" aria-label="Tabela do exercício com rolagem horizontal"><table><thead>' +
          row(l, 'th') +
          '</thead><tbody>' +
          rows.join('') +
          '</tbody></table></div>'
      );
    } else if (/^(\d+\. |[-*] )/.test(l)) {
      const ordenada = /^\d/.test(l),
        regra = ordenada ? /^\d+\. / : /^[-*] /,
        tag = ordenada ? 'ol' : 'ul',
        itens = [l];
      while (i < linhas.length && regra.test(linhas[i])) itens.push(linhas[i++]);
      html.push(`<${tag}>${itens.map((t) => '<li>' + linha(t.replace(regra, '')) + '</li>').join('')}</${tag}>`);
    } else if (l.startsWith('> ')) html.push('<blockquote>' + linha(l.slice(2)) + '</blockquote>');
    else html.push('<p>' + linha(l) + '</p>');
  }
  return html.join('');
}
function botao(acao, rotulo, op = {}) {
  return /* HTML */ `<button data-acao="${acao}" ${op.n ? `data-n="${op.n}"` : ''} class="${op.classe || ''}">
    ${op.icone ? ico(op.icone) : ''}${escapar(rotulo)}
  </button>`;
}

export function criarInterface(curso, progresso, acoes) {
  const { estacoes, geral, abertura, fecho } = curso,
    painel = $('painel'),
    corpo = $('corpo-painel');
  const est = (n) => estacoes[n - 1];
  let modo = 'entrada',
    atual = null,
    destino = null,
    naVaranda = false,
    leitorCriado = false,
    painelTipo = '',
    timer,
    origemPainel = null,
    ultimasAcoes = '',
    retornoSala = '';
  const fecharDefinicao = ativarGlossario();
  function estadoEstacao(e) {
    const feitos = progresso.contar(e.numero);
    return feitos === e.exercicios.length ? 'Concluída' : feitos ? 'Em andamento' : 'A começar';
  }
  const contagem = (e) => `${progresso.contar(e.numero)} de ${e.exercicios.length} exercícios`;
  const recomendada = () => estacoes.find((e) => !progresso.feitas().includes(e.numero));
  const proximoTexto = () =>
    recomendada() ? `Próxima recomendada · ${recomendada().nome}` : 'Quatro estações concluídas';
  function anunciar(mensagem) {
    clearTimeout(timer);
    retornoSala = !painel.open && modo === '3d' ? mensagem : '';
    $('aviso').textContent = !painel.open && modo !== '3d' ? mensagem : '';
    $('aviso-painel').textContent = painel.open ? mensagem : '';
    dock();
    timer = setTimeout(() => {
      $('aviso').textContent = '';
      $('aviso-painel').textContent = '';
      retornoSala = '';
      dock();
    }, 4500);
  }
  function video(v, n) {
    const dur = Math.round(v.duracao_s);
    return /* HTML */ `<div class="video" data-video="${n}">
      <div class="video-convite">
        <div>
          <span class="meta"
            >${n ? 'Vídeo da estação' : 'Vídeo de abertura'} · ${Math.floor(dur / 60)} min ${dur % 60} s</span
          >
          <h3>${escapar(v.titulo)}</h3>
        </div>
        ${botao('video', 'Assistir ao vídeo', { n, icone: 'play' })}
      </div>
    </div>`;
  }
  function aulas(lista) {
    return /* HTML */ `<section class="grupo-leitura">
      <h3>Aulas <small>${numero(lista.length)}</small></h3>
      ${lista.map((a) => `<details data-aula><summary><span class="ordem">${numero(a.num)}</span><span>${escapar(a.titulo)}</span><small>${a.minutos} min</small></summary><div class="miolo"><h4>Resumo</h4><p>${linha(a.lead)}</p><h4>Objetivo</h4><p>${linha(a.objetivo.replace(/^\p{L}/u, c => c.toLocaleUpperCase('pt-BR')))}</p><h4>O que você aprende</h4><ul>${a.aprende.map((x) => '<li>' + linha(x) + '</li>').join('')}</ul>${link(a.url, 'Abrir aula completa')}</div></details>`).join('')}
    </section>`;
  }
  function ajuda(id) {
    const dica = curso.ajuda_exercicios[id];
    if (!dica) return '';
    const preparo = dica.codigo ? markdown(['```', dica.codigo, '```'].join('\n')) : '';
    return `<aside class="ajuda-exercicio"><strong>Antes de começar</strong><p>${linha(dica.antes)}</p>${preparo}${dica.link ? link(dica.link, dica.rotulo) : ''}</aside>`;
  }
  function exercicios(e) {
    return /* HTML */ `<section class="grupo-leitura">
      <h3>Exercícios <small>${numero(e.exercicios.length)}</small></h3>
      ${e.exercicios.map((x, i) => `<details data-exercicio="${escapar(x.id)}"><summary><span class="ordem">E${i + 1}</span><span>${escapar(x.titulo)}</span><small data-resumo-ex="${escapar(x.id)}">${x.minutos ? x.minutos + ' min' : ''}</small></summary><div class="miolo">${ajuda(x.id)}<h4>Passos</h4>${markdown(x.passos_md)}<div class="pronto"><h4>Pronto quando</h4><p>${linha(x.pronto_quando)}</p></div><button data-acao="marcar" data-n="${e.numero}" data-id="${escapar(x.id)}" aria-pressed="false">Marcar como feito</button></div></details>`).join('')}
    </section>`;
  }
  function tituloEst(e, painelAberto) {
    return /* HTML */ `<p class="sequencia">${ico(e.id)} Estação ${numero(e.numero)} · ${escapar(e.nome)}</p>
      <h2 ${painelAberto ? 'id="titulo-painel"' : `id="titulo-${e.id}"`} tabindex="-1">${escapar(e.titulo)}</h2>
      <p class="entrada-est"><strong>Nesta estação</strong> · ${escapar(e.fala_entrada)}</p>
      <p class="contagem" data-conta="${e.numero}">${contagem(e)}</p>`;
  }
  function conteudoEst(e, painelAberto = false) {
    return `${tituloEst(e, painelAberto)}<h3>Por que fazer esta estação?</h3><p>${escapar(e.por_que)}</p><h3>O que você vai conseguir fazer</h3><p>${escapar(e.ganho)}</p>${video(e.video, e.numero)}${aulas(e.aulas)}${exercicios(e)}<section class="grupo-leitura"><h3>Cursos e projetos</h3>${e.materiais.map((m) => `<article class="material"><span class="meta">${escapar(m.tipo)}</span><h4>${link(m.url, m.titulo)}</h4><p>${escapar(m.detalhe)}</p></article>`).join('')}</section><div class="retorno" role="status"></div><div class="acoes-finais">${botao('mapa', 'Voltar ao mapa', { icone: 'mapa' })}<button data-acao="terraco" data-final hidden>Ir ao terraço</button></div>`;
  }
  function geralHTML(noPainel) {
    return /* HTML */ `<h2 ${noPainel ? 'id="titulo-painel"' : 'id="geral-titulo"'} tabindex="-1">
        ${escapar(abertura.titulo)}
      </h2>
      <p class="intro-leitura">${escapar(abertura.texto)}</p><p>${escapar(abertura.requisito)}</p><p>${escapar(abertura.percurso)}</p>
      ${video(geral.video, 0)}${aulas(geral.aulas)}
      <div class="pronto">
        <h3>Antes de avançar</h3>
        <p>${escapar(abertura.sem_milagre)}</p>
      </div>
      <h3>Por onde começar?</h3>
      <div class="partidas">
        ${curso.por_onde_comecar.map((p) => `<div class="partida"><div><strong>${escapar(p.situacao)}</strong><p>${escapar(p.comece_por)}</p></div>${p.url ? link(p.url, p.rotulo) : botao('estacao', 'Abrir estação ' + est(p.estacao).nome, { n: p.estacao })}</div>`).join('')}
      </div>`;
  }
  function planta() {
    let ponto = acoes.posicao();
    if (modo !== '3d') {
      const capitulos = [...$('leitura').querySelectorAll('[data-estacao-sem3d]')];
      const capitulo = capitulos.filter(el => el.getBoundingClientRect().top < innerHeight / 2).at(-1);
      ponto = posicoes[Number(capitulo?.dataset.estacaoSem3d) - 1] || chegada;
    }
    const { oeste, leste, norte, sul, portaX, larguraPorta } = casa;
    const a = portaX - larguraPorta / 2, b = portaX + larguraPorta / 2;
    return `<figure class="mapa-casa"><svg class="planta" viewBox="-5 -10.3 12 14.5" role="img"
      aria-label="Planta da sala e do terraço. O losango indica onde você está.">
      <g class="paredes-mapa">
        <path d="M${a} ${norte} H${oeste} V${sul} H${leste} V${norte} H${b}
                 M.18 ${norte} V-9.7 H5.97 V${norte}"/>
        <path class="degraus-mapa" d="M${a} ${norte} v1.28 h${larguraPorta} v-1.28
           M${a} -4.48 H${b} M${a} -4.16 H${b} M${a} -3.84 H${b}"/>
        <rect x="-2.03" y="-.86" width="2.73" height="1.17" rx=".08"/>
        <circle cx="1.71" cy="-7.52" r=".52"/>
      </g>
      <text class="nome-terraco" x="3" y="-8.6" text-anchor="middle">Terraço</text>
      ${posicoes.map(({x,z},i) => `<g class="pin ${progresso.feitas().includes(i+1) ? 'aceso' : ''}" transform="translate(${x} ${z})"><circle r=".49"/><text text-anchor="middle" dy=".21">${i+1}</text></g>`).join('')}
      <path class="voce" transform="translate(${ponto.x} ${ponto.z})" d="M0 -.32 .24 0 0 .32 -.24 0Z"/>
      </svg><figcaption><i aria-hidden="true"></i> Você está aqui</figcaption></figure>`;
  }
  function mapaHTML(destaque) {
    return /* HTML */ `<h2 id="titulo-painel" tabindex="-1">Mapa do curso</h2>
      <p>
        ${progresso.nome ? escapar(progresso.nome) + ', ' : ''}${progresso.feitas().length} de 4 estações
        concluídas.
      </p>
      <p>${escapar(abertura.percurso)}</p>
      ${planta()}
      <p class="recomendada">${proximoTexto()}</p>
      <div class="lista-mapa">
        ${estacoes.map((e) => `<div class="linha-mapa ${destaque === e.numero ? 'destino' : ''}"><span class="ordem">${numero(e.numero)}</span><div><h3>${escapar(e.nome)}</h3><span>${estadoEstacao(e)} · ${contagem(e)}</span></div>${botao('ir', 'Ir até lá', { n: e.numero })}</div>`).join('')}
      </div>
      <div class="saida">
        <div>
          <h3>${recomendada() ? 'Porta fechada' : 'Porta aberta'}</h3>
          <p>${recomendada() ? curso.ui.como_abrir_porta : curso.ui.caminho_livre}</p>
        </div>
        ${recomendada() ? '' : botao('terraco', 'Ir ao terraço', { classe: 'forte' })}
      </div>
      ${botao('geral', 'Visão geral', { icone: 'livro' })}`;
  }
  function pausar(el) {
    el.querySelectorAll('video').forEach((v) => v.pause());
  }
  function pausarOutros(player) {
    for (const outro of document.querySelectorAll('video')) {
      if (outro !== player && !outro.paused) outro.pause();
    }
  }
  async function legendar(player, vtt) {
    if (!vtt) return;
    try {
      const resposta = await fetch(vtt);
      if (!resposta.ok) return;
      const texto = await resposta.text();
      if (!player.isConnected || !/^\uFEFF?WEBVTT(?:[ \t]|\r?\n|$)/.test(texto)) return;
      const track = document.createElement('track');
      track.kind = 'captions';
      track.label = 'Português';
      track.srclang = 'pt';
      track.default = true;
      track.src = URL.createObjectURL(new Blob([texto], { type: 'text/vtt' }));
      track.addEventListener('error', () => {
        URL.revokeObjectURL(track.src);
        track.remove();
      }, { once: true });
      player.append(track);
      track.track.mode = 'showing';
    } catch {
      // As legendas são opcionais e independentes da reprodução do MP4.
    }
  }
  function liberarVideosPainel() {
    pausar(corpo);
    for (const track of corpo.querySelectorAll('video track')) URL.revokeObjectURL(track.src);
  }
  function abrir(tipo, rotulo, html) {
    liberarVideosPainel();
    pausar($('leitura'));
    $('aviso-painel').textContent = '';
    retornoSala = '';
    fecharDefinicao();
    $('aviso').textContent = '';
    if (!painel.open) origemPainel = document.activeElement;
    painelTipo = tipo;
    $('rotulo-painel').textContent = rotulo;
    corpo.innerHTML = html;
    aplicarGlossario(corpo, curso.glossario);
    if (!painel.open) painel.showModal();
    painel.scrollTop = 0;
    corpo.querySelector('h2')?.focus({ preventScroll: true });
    acoes.painel(true);
    sincronizar();
  }
  function fechar() {
    if (!painel.open) return;
    fecharDefinicao();
    painel.close();
    liberarVideosPainel();
    corpo.replaceChildren();
    painelTipo = '';
    acoes.painel(false);
    let destino = origemPainel;
    if (!destino?.isConnected && destino?.dataset.acao) {
      destino = [...$('dock').querySelectorAll('button')].find(b => b.dataset.acao === destino.dataset.acao);
    }
    (destino?.isConnected && !destino.closest('[hidden]') ? destino : $('dock').querySelector('button'))?.focus({ preventScroll: true });
    origemPainel = null;
  }
  painel.addEventListener('cancel', e => { e.preventDefault(); if (!fecharDefinicao()) fechar(); });
  $('fechar').onclick = fechar;
  function mapa(n) {
    abrir('mapa', 'Seu percurso', mapaHTML(n));
  }
  function leitura() {
    if (leitorCriado) return;
    $('leitura').innerHTML = /* HTML */ `<div class="pagina-leitura">
      <aside class="sumario">
        <h2>Seu percurso</h2>
        <p data-global></p>
        ${botao('geral', 'Visão geral', { icone: 'livro' })}${estacoes.map((e) => botao('ir', e.nome, { n: e.numero, icone: e.id })).join('')}<button
          data-final
          data-acao="terraco"
          hidden
        >
          Ir ao terraço
        </button>
      </aside>
      <div class="caderno">
        <article id="geral" class="capitulo">${geralHTML(false)}</article>
        ${estacoes.map((e) => `<article id="ler-${e.numero}" class="capitulo" data-estacao-sem3d="${e.numero}">${conteudoEst(e)}</article>`).join('')}
      </div>
    </div>`;
    $('leitura').querySelectorAll('.capitulo').forEach(el => aplicarGlossario(el, curso.glossario));
    leitorCriado = true;
  }
  function focarLeitura(n) {
    fechar();
    const el = $(n ? 'ler-' + n : 'geral');
    el.scrollIntoView({ block: 'start' });
    el.querySelector('h2').focus({ preventScroll: true });
  }
  function geralAbrir() {
    if (modo === 'sem-3d') focarLeitura(0);
    else abrir('geral', 'Visão geral', geralHTML(true));
  }
  function dock() {
    if (modo !== '3d') return;
    const e = est(atual), proxima = recomendada();
    const concluida = e && progresso.feitas().includes(atual);
    const onde = naVaranda ? 'Terraço' : e?.nome || 'Sala · Casa na serra';
    $('local').textContent = onde;
    const feitas = progresso.feitas().length;
    const ultima = feitas === 3;
    const nomeFinal = ultima ? ['o Terminal', 'o Jarvis', 'a estação Filas', 'a estação Redes'][proxima.numero - 1] : '';
    const seguinteEstacao = proxima === e ? estacoes.find(posto => posto !== e && !progresso.feitas().includes(posto.numero)) : proxima;
    const percurso = ultima ? 'Falta ' + nomeFinal : seguinteEstacao ? 'Próxima estação · ' + seguinteEstacao.nome : '';
    const detalhe = naVaranda ? fecho.pergunta : e ? e.fala_entrada :
      !proxima ? 'Os quatro degraus estão acesos.' : ultima ? percurso :
      proxima.numero === 1 ? 'Comece pelo Terminal' : 'Continue em ' + proxima.nome;
    const meta = e ? 'Nesta estação' : `${feitas} de 4 estações`;
    let principal, secundario;
    if (destino) {
      principal = botao('geral', 'Visão geral');
    } else if (naVaranda) {
      principal = botao('fecho', 'Ler o fecho', { classe: 'forte' });
      secundario = botao('rever', 'Rever estações');
    } else if (!proxima) principal = botao('terraco', 'Ir ao terraço', { classe: 'forte' });
    else if (e && !concluida) principal = botao('estacao', 'Abrir estação', { n: atual, classe: 'forte' });
    else principal = botao('ir', e ? 'Ir para a próxima estação' : 'Ir até lá', { n: proxima.numero, classe: 'forte' });
    if (!naVaranda && e && (concluida || !proxima)) secundario = botao('estacao', 'Abrir estação', { n: atual });
    if (!destino && !naVaranda && !e) secundario = botao('geral', 'Visão geral');
    const dock = $('dock');
    dock.querySelector('.meta').textContent = naVaranda ? fecho.titulo : meta;
    const seguinte = dock.querySelector('.dock-proxima');
    seguinte.textContent = e && !naVaranda ? percurso : '';
    seguinte.hidden = !seguinte.textContent;
    const status = dock.querySelector('strong');
    const mensagem = retornoSala || (destino ? 'Indo até ' + est(destino).nome : detalhe);
    if (status.textContent !== mensagem) status.textContent = mensagem;
    const fechoLongo = dock.querySelector('.fecho-longo');
    fechoLongo.hidden = !naVaranda;
    if (naVaranda) fechoLongo.textContent = fecho.texto + ' ' + fecho.cta;
    const html = principal + (secundario || '');
    if (html !== ultimasAcoes) {
      const caixa = dock.querySelector('.dock-acoes');
      const foco = caixa.contains(document.activeElement) ? document.activeElement.dataset.acao : null;
      caixa.innerHTML = html;
      ultimasAcoes = html;
      if (foco) (caixa.querySelector(`[data-acao="${foco}"]`) || caixa.querySelector('button')).focus({ preventScroll: true });
    }
  }
  function sincronizar() {
    const feitas = progresso.feitas();
    $('leitura').querySelectorAll('[data-estacao-sem3d]').forEach(artigo => {
      if (!feitas.includes(Number(artigo.dataset.estacaoSem3d))) artigo.querySelector('.retorno').textContent = '';
    });
    document.querySelectorAll('[data-global]').forEach((el) => (el.textContent = `Progresso · ${feitas.length} de 4 estações concluídas · ${progresso.total} de ${totalEx} exercícios`));
    document.querySelectorAll('[data-conta]').forEach((el) => {
      const e = est(+el.dataset.conta);
      el.textContent = estadoEstacao(e) + ' · ' + contagem(e);
    });
    document.querySelectorAll('[data-final]').forEach((el) => (el.hidden = feitas.length !== 4));
    document.querySelectorAll('[data-acao="marcar"]').forEach((b) => {
      const marcado = progresso.tem(b.dataset.id);
      b.setAttribute('aria-pressed', String(marcado));
      b.textContent = marcado ? 'Desmarcar exercício' : 'Marcar como feito';
      const resumo = b.closest('details').querySelector('[data-resumo-ex]');
      const x = est(+b.dataset.n).exercicios.find((ex) => ex.id === b.dataset.id);
      resumo.textContent = marcado ? 'Feito' : x.minutos ? x.minutos + ' min' : '';
    });
    $('temporario').hidden = progresso.persistente;
    if (!progresso.persistente) {
      const pai = modo === '3d' ? document.querySelector('.hud-topo') : $('principal');
      if ($('temporario').parentElement !== pai) pai.append($('temporario'));
    }
    dock();
  }
  const totalAulas = estacoes.reduce((s, e) => s + e.aulas.length, geral.aulas.length);
  const totalEx = estacoes.reduce((s, e) => s + e.exercicios.length, 0);
  $('inventario').textContent = `4 estações · ${totalAulas} aulas · ${totalEx} exercícios`;
  $('indice-entrada').innerHTML = estacoes
    .map(
      (e) =>
        `<button data-acao="previa" data-n="${e.numero}"><span class="ordem">${numero(e.numero)}</span>${ico(e.id)}<strong>${escapar(e.nome)}</strong>${ico('seta')}</button>`
    )
    .join('');
  document.querySelector('.promessa').textContent = curso.chamada.por_que_importa;
  $('subtitulo').textContent = curso.subtitulo;
  $('requisito').textContent = abertura.requisito;
  $('nome').value = progresso.nome;
  $('acesso')
    .querySelectorAll('button')
    .forEach((b) => (b.disabled = false));
  $('acesso').onsubmit = (e) => {
    e.preventDefault();
    progresso.identificar($('nome').value);
    acoes.entrar(e.submitter?.value || '3d');
  };
  $('botao-mapa').onclick = e => { e.currentTarget.focus({ preventScroll: true }); mapa(); };
  $('botao-modo').onclick = () => acoes.entrar(modo === '3d' ? 'sem-3d' : '3d');
  document.addEventListener('click', async (ev) => {
    const b = ev.target.closest('button[data-acao]');
    if (!b) return;
    if (!painel.open) b.focus({ preventScroll: true });
    const acao = b.dataset.acao,
      n = Number(b.dataset.n) || 0;
    if (acao === 'mapa') mapa();
    else if (acao === 'geral') geralAbrir();
    else if (acao === 'fecho') abrirFecho();
    else if (acao === 'leitura') acoes.entrar('sem-3d');
    else if (acao === 'ir') {
      fechar();
      acoes.irPara(n);
    } else if (acao === 'estacao') abrir('estacao', est(n).nome, conteudoEst(est(n), true));
    else if (acao === 'previa')
      abrir(
        'previa',
        'Estação ' + numero(n),
        `<h2 id="titulo-painel" tabindex="-1">${est(n).nome}</h2><p>${escapar(est(n).objeto)}</p><h3>${escapar(est(n).titulo)}</h3><p>${escapar(est(n).ganho)}</p>${botao('iniciar-estacao', 'Fazer estação sem 3D', { n, classe: 'forte' })}`
      );
    else if (acao === 'iniciar-estacao') {
      progresso.identificar($('nome').value);
      fechar();
      await acoes.entrar('sem-3d');
      acoes.irPara(n);
    } else if (acao === 'ajuda')
      abrir(
        'ajuda',
        'Casa na serra',
        `<h2 id="titulo-painel" tabindex="-1">Como se mover</h2><p>${controlesDeToque()
          ? 'Use as setas na tela para andar. Arraste para olhar. Toque no chão ou numa estação para ir até lá. De perto, toque no objeto para abrir a estação.'
          : curso.ui.andar + ' Gire com Q e E ou arraste para olhar. ' + curso.ui.ir_por_clique + ' De perto, clique no objeto ou pressione Enter para abrir a estação.'}</p>${botao('mapa', 'Abrir mapa', { icone: 'mapa' })}`
      );
    else if (acao === 'terraco') {
      fechar();
      acoes.irTerraco();
    } else if (acao === 'rever') {
      fechar();
      acoes.rever();
      mapa();
    } else if (acao === 'marcar') progresso.marcar(n, b.dataset.id, !progresso.tem(b.dataset.id));
    else if (acao === 'copiar') {
      const code = b.nextElementSibling.querySelector('code');
      try {
        await navigator.clipboard.writeText(code.textContent);
        b.textContent = 'Código copiado';
        setTimeout(() => (b.textContent = 'Copiar código'), 1700);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(code);
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        b.textContent = 'Selecione o código e copie.';
      }
    } else if (acao === 'video') {
      pausarOutros(null);
      const slot = b.closest('[data-video]'),
        v = n ? est(n).video : geral.video;
      slot.innerHTML = /* HTML */ `<video
          controls
          preload="none"
          playsinline
          aria-label="${escapar(v.titulo)}"
        ></video>
        <p class="falha-video" role="status"></p>
        ${link(v.pagina, 'Abrir página do vídeo')}`;
      const player = slot.querySelector('video');
      player.addEventListener('error', () => {
        const tinhaFoco = document.activeElement === player;
        player.hidden = true;
        slot.querySelector('.falha-video').textContent = curso.ui.erro_video;
        if (tinhaFoco) {
          slot.querySelector('a').focus({ preventScroll: true });
          slot.scrollIntoView({ block: 'nearest' });
        }
      });
      player.addEventListener('play', () => { if (!player.paused) pausarOutros(player); });
      player.src = v.mp4;
      player.focus();
      player.play().catch(() => {});
      legendar(player, v.vtt);
    }
  });
  function modoUI(novo) {
    if (modo !== novo) {
      fechar();
      pausar($('leitura'));
    }
    retornoSala = '';
    modo = novo;
    document.body.dataset.modo = modo;
    const dentro = modo === '3d' || modo === 'sem-3d';
    for (const [id, visivel] of [
      ['entrada', modo === 'entrada'],
      ['carga', modo === 'carga'],
      ['sala', modo === '3d'],
      ['leitura', modo === 'sem-3d'],
      ['botao-mapa', dentro],
      ['botao-modo', dentro],
      ['ver-percurso', modo === 'entrada']
    ])
      $(id).hidden = !visivel;
    $('botao-modo').textContent = modo === '3d' ? 'Sem 3D' : 'Entrar na casa';
    if (modo === 'sem-3d') leitura();
    window.scrollTo(0, 0);
    sincronizar();
    if (modo === 'sem-3d') $('geral-titulo').focus({ preventScroll: true });
  }
  function finalizar() {
    naVaranda = modo === '3d';
    if (naVaranda) dock();
    else abrirFecho();
  }
  function abrirFecho() {
    abrir(
      'fecho',
      'Terraço',
      `<div class="fecho-vista" aria-hidden="true"></div><h2 id="titulo-painel" tabindex="-1">${escapar(fecho.titulo)}</h2><p>${escapar(fecho.texto)}</p><h3 class="pergunta">${escapar(fecho.pergunta)}</h3><p>${escapar(fecho.cta)}</p>${botao('rever', 'Rever as estações', { icone: 'mapa' })}`
    );
  }
  return {
    modo: modoUI,
    fechar,
    anunciar,
    sincronizar,
    mapa,
    finalizar,
    focarLeitura,
    get painelAberto() {
      return painel.open;
    },
    situar(n, indoPara = null) {
      destino = indoPara;
      retornoSala = '';
      naVaranda = false;
      atual = n;
      dock();
    },
    abrirEstacao(n) {
      abrir('estacao', est(n).nome, conteudoEst(est(n), true));
    },
    andamento(a, b) {
      const p = Math.round((100 * a) / b);
      $('medidor').value = p;
      $('percentual').textContent = p + '%';
    },
    atualizar() {
      if (painelTipo === 'mapa' && painel.open) {
        corpo.innerHTML = mapaHTML();
        aplicarGlossario(corpo, curso.glossario);
      }
      sincronizar();
    },
    recompensa(msg, n) {
      if (modo === 'sem-3d' && !painel.open) {
        const artigo = $('ler-' + n);
        const el = artigo?.querySelector('.retorno');
        if (el) {
          const botao = document.activeElement;
          if (artigo.contains(botao) && botao.matches('[data-acao="marcar"]')) botao.after(el);
          el.textContent = msg;
        }
      } else anunciar(msg);
    }
  };
}
