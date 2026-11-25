import { chegada, mirante, planta } from './planta.js';
import { carregarCurso } from './dados.js';
import { criarProgresso } from './progresso.js';
import { controlesDeToque, criarInterface } from './interface.js';

async function criarMundo(ui, callbacks) {
  const [
    T,
    { construirCasa },
    { mobiliar },
    { instalarEstacoes },
    { carregarAmbiente, criarLuz },
    { navegacao, criarControles }
  ] = await Promise.all([
    import('../vendor/three/three.module.js'),
    import('./casa.js'),
    import('./moveis.js'),
    import('./estacoes.js'),
    import('./luz.js'),
    import('./controles.js')
  ]);
  const container = document.getElementById('cena'),
    reduzido = matchMedia('(prefers-reduced-motion: reduce)');
  const economico = matchMedia('(pointer: coarse), (max-width: 720px)').matches;
  const renderer = new T.WebGLRenderer({
    antialias: !economico,
    powerPreference: economico ? 'low-power' : 'high-performance'
  });
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  let dpr = Math.min(devicePixelRatio, economico ? 1.15 : 1.65, 2);
  renderer.setPixelRatio(dpr);
  renderer.info.autoReset = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', controlesDeToque()
    ? 'Sala em 3D. Toque no chêo para andar ou arraste para olhar.'
    : 'Sala em 3D. Use WASD ou as setas para caminhar. Arraste para olhar ou gire com Q e E.');
  container.replaceChildren(canvas);
  const cena = new T.Scene(),
    camera = new T.PerspectiveCamera(64, 1, 0.04, 225);
  let luz,
    postos,
    controle,
    aoMudarVisibilidade,
    ativo = false,
    destruido = false,
    perdeu = false;
  function perdeuContexto(e) {
    e.preventDefault();
    perdeu = true;
    callbacks.falha();
  }
  canvas.addEventListener('webglcontextlost', perdeuContexto);
  function dispor() {
    if (destruido) return;
    destruido = true;
    ativo = false;
    renderer.setAnimationLoop(null);
    if (aoMudarVisibilidade) document.removeEventListener('visibilitychange', aoMudarVisibilidade);
    controle?.dispor();
    luz?.dispor();
    canvas.removeEventListener('webglcontextlost', perdeuContexto);
    const materiais = new Set(),
      geos = new Set(),
      texturas = new Set();
    cena.traverse((o) => {
      if (o.geometry) geos.add(o.geometry);
      if (o.material) materiais.add(o.material);
    });
    if (postos) {
      materiais.add(postos.apagada);
      for (const e of postos.estacoes) {
        for (const { acesa, espera, reels = [] } of e.telas) {
          materiais.add(acesa);
          if (espera) materiais.add(espera);
          for (const reel of reels) materiais.add(reel);
        }
      }
    }
    for (const mat of materiais) {
      for (const v of Object.values(mat)) if (v?.isTexture) texturas.add(v);
      mat.dispose();
    }
    for (const geo of geos) geo.dispose();
    for (const tex of texturas) tex.dispose();
    cena.background?.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }
  try {
    const ambiente = await carregarAmbiente(ui.andamento, renderer);
    const casa = construirCasa(cena, ambiente.materiais),
      moveis = mobiliar(cena, ambiente.materiais);
    postos = instalarEstacoes(cena, ambiente.materiais);
    if (economico) {
      // Keep directional shadows for the buildings, door, upholstery and desks.
      // The furniture also has its own contact shadows.
      const arquitetura = new Set();
      casa.raiz.traverse(m => arquitetura.add(m));
      postos.dobradica.traverse(m => arquitetura.add(m));
      cena.traverse(m => {
        if (!m.isMesh || arquitetura.has(m)) return;
        m.castShadow &&= m.material === ambiente.materiais.tecido ||
          m.material.map === ambiente.materiais['madeira-forro'].map;
      });
    }
    const reflexo = ambiente.materiais.piso.userData.reflexo;
    reflexo.value = economico ? .65 : 1;
    luz = criarLuz(cena, renderer, ambiente.panorama, economico, ambiente.materiais.arvores);
    const obstaculos = moveis.obstaculos.concat(postos.estacoes.map((e) => e.caixa));
    const geo = navegacao(obstaculos, postos.passagem);
    let destinoNaLente = null;
    // Minimum width and height visible at each subject, in metres.
    const enquadramentos = [[1.12, 1.20], [.76, .85], [3.55, 4.38], [1.86, 1.55]];
    const marcador = document.getElementById('marcador');
    const ponto = new T.Vector3();
    const farol = new T.Mesh(new T.SphereGeometry(.042, 12, 8),
      new T.MeshBasicMaterial({ color: 0xffbf61, toneMapped: false }));
    farol.visible = false;
    cena.add(farol);
    const hud = document.querySelector('.hud-topo');
    const comandos = document.querySelector('.controles-sala');
    let recomendada = null;
    function orientarMarcador(w, h) {
      const e = recomendada;
      const perto = postos.estacoes.some(({ visita }) =>
        Math.hypot(camera.position.x - visita[0], camera.position.z - visita[1]) < 1.12);
      if (!e || pausa || callbacks.emEstacaoOuACaminho() || perto) {
        farol.visible = false;
        marcador.hidden = true;
        return;
      }
      farol.visible = true;
      ponto.copy(farol.position).applyMatrix4(camera.matrixWorldInverse);
      const atras = ponto.z >= -.04;
      const lado = Math.sign(ponto.x) || 1;
      ponto.applyMatrix4(camera.projectionMatrix);
      marcador.hidden = false;
      marcador.dataset.direcao = atras || Math.abs(ponto.x) > 1 ? (lado < 0 ? 'esquerda' : 'direita') : '';
      const margem = 8, metade = marcador.offsetWidth / 2;
      const topo = hud.offsetTop + hud.offsetHeight + margem;
      const base = Math.min(h, comandos.offsetTop) - margem - marcador.offsetHeight;
      if (base < topo || w < 2 * (margem + metade)) {
        marcador.hidden = true;
        return;
      }
      const x = T.MathUtils.clamp(atras ? (lado < 0 ? 0 : w) : (ponto.x + 1) * w / 2,
        margem + metade, w - margem - metade);
      const y = T.MathUtils.clamp(atras ? h * .42 : (1 - ponto.y) * h / 2 - marcador.offsetHeight, topo, base);
      marcador.style.transform = `translate(${Math.round(x - metade)}px, ${Math.round(y)}px)`;
    }
    controle = criarControles({
      camera,
      canvas,
      cena,
      geografia: geo,
      pisos: casa.pisos,
      postos,
      aoVisitar: callbacks.visitar,
      aoTerraco: callbacks.terraco,
      aoAbrir: callbacks.abrir,
      aoImpedir: callbacks.impedir,
      aoMover(p, n) {
        destinoNaLente = n ? postos.estacoes[n - 1] : null;
        callbacks.mover(n, p.z);
      },
      toque: document.getElementById('toque'),
      reduzido
    });
    let aoAbrirPorta = null,
      anterior = null,
      quadros = 0,
      segundos = 0,
      nivel = 0,
      fps = 0,
      sombraAte = 0,
      proximaSombra = 0,
      sombraPendente = false,
      pausa = false;
    function ajustarLente(dt) {
      const base = camera.aspect < .85 ? 75 : 63;
      let alvo = base;
      if (destinoNaLente) {
        const e = destinoNaLente, quadro = enquadramentos[postos.estacoes.indexOf(e)];
        if (quadro) {
          const [x, z] = e.visita, [ox, oy, oz] = e.olhar;
          const distancia = Math.hypot(ox - x, oy - 1.62, oz - z);
          const altura = Math.max(quadro[1], quadro[0] / camera.aspect);
          const perto = 1 - T.MathUtils.smoothstep(Math.hypot(camera.position.x - x, camera.position.z - z), .12, 1);
          alvo = T.MathUtils.lerp(base, T.MathUtils.radToDeg(2 * Math.atan(altura / (2 * distancia))), perto);
        } else alvo = Math.max(base, T.MathUtils.radToDeg(2 * Math.atan(.66 / camera.aspect)));
      }
      camera.fov = reduzido.matches || dt === 0 ? alvo : T.MathUtils.damp(camera.fov, alvo, 8, dt);
      camera.updateProjectionMatrix();
    }
    aoMudarVisibilidade = () => {
      anterior = null;
      segundos = quadros = 0;
    };
    document.addEventListener('visibilitychange', aoMudarVisibilidade);
    function medir(delta) {
      segundos += delta;
      quadros++;
      if (segundos < 3) return;
      const media = quadros / segundos;
      fps = Math.round(media);
      segundos = quadros = 0;
      if (media >= 28) return;
      if (nivel === 0) luz.reduzirSombra();
      else if (nivel >= 2) {
        if (dpr <= .7) return;
        dpr = Math.max(.7, dpr * .84);
        renderer.setPixelRatio(dpr);
      }
      nivel++;
    }
    let largura = 0, altura = 0;
    function desenhar(dt, tempo) {
      const w = container.clientWidth, h = container.clientHeight;
      if (!w || !h) return;
      if (w !== largura || h !== altura) {
        largura = w;
        altura = h;
        camera.aspect = w / h;
        renderer.setSize(w, h, false);
      }
      ajustarLente(dt);
      if (nivel >= 2) reflexo.value = Math.max(0, reflexo.value - dt / .9);
      if (tempo < sombraAte) renderer.shadowMap.needsUpdate = true;
      sombraPendente ||= renderer.shadowMap.needsUpdate;
      renderer.shadowMap.needsUpdate = sombraPendente && (!nivel || tempo >= proximaSombra);
      if (renderer.shadowMap.needsUpdate) {
        sombraPendente = false;
        proximaSombra = tempo + 200;
      }
      casa.orientarArvores(camera.position);
      renderer.info.reset();
      camera.updateMatrixWorld();
      orientarMarcador(w, h);
      renderer.render(cena, camera);
    }
    function quadro(tempo) {
      if (!ativo || document.hidden) return;
      const delta = anterior === null ? 0 : Math.max(0, (tempo - anterior) / 1000);
      anterior = tempo;
      if (delta) medir(delta);
      if (!pausa) controle.atualizar(delta, tempo);
      postos.animar(delta, reduzido.matches);
      luz.atualizar(delta, reduzido.matches, tempo / 1000);
      if (aoAbrirPorta && postos.passagem() && !pausa) {
        const cb = aoAbrirPorta;
        aoAbrirPorta = null;
        controle.terraco(cb);
      }
      desenhar(delta, tempo);
    }
    function mostrar(visivel) {
      ativo = visivel;
      aoMudarVisibilidade();
      controle.ativar(visivel);
      pausa = false;
      aoAbrirPorta = null;
      if (visivel) {
        canvas.focus({ preventScroll: true });
        renderer.shadowMap.needsUpdate = true;
        desenhar(0, performance.now());
      }
      renderer.setAnimationLoop(visivel ? quadro : null);
    }
    function sincronizar(feitas, inicial = false) {
      if (feitas.length < 4) aoAbrirPorta = null;
      const i = postos.estacoes.findIndex((_, i) => !feitas.includes(i + 1));
      recomendada = postos.estacoes[i];
      marcador.textContent = recomendada ? callbacks.nome(i + 1) : '';
      if (recomendada) {
        farol.position.set(...recomendada.olhar);
        farol.position.y += i === 2 ? 1.27 : .55;
        farol.userData.estacao = i + 1;
        marcador.dataset.n = i + 1;
        marcador.setAttribute('aria-label', 'Ir até ' + marcador.textContent + ', próxima estaçêo recomendada');
      }
      postos.progresso(feitas, moveis.chamas);
      luz.definir(feitas.length, inicial);
      if (inicial) postos.animar(0, true);
      sombraAte = performance.now() + 2000;
      renderer.shadowMap.needsUpdate = true;
    }
    // Compile even the empty-room materials before reporting the last loading unit.
    renderer.compile(cena, camera);
    if (perdeu) throw new Error('O contexto WebGL foi interrompido.');
    ambiente.terminar();
    return {
      mostrar,
      sincronizar,
      dispor,
      entrada(animar) {
        destinoNaLente = null;
        controle.entrada(animar);
        if (ativo) desenhar(0, performance.now());
      },
      verPorta() {
        aoAbrirPorta = null;
        destinoNaLente = null;
        controle.verPorta();
      },
      info() {
        return {
          drawCalls: renderer.info.render.calls,
          triangulos: renderer.info.render.triangles,
          texturas: renderer.info.memory.textures,
          qualidade: (economico ? 'celular' : 'desktop') + '-' + nivel,
          pixelRatio: renderer.getPixelRatio()
        };
      },
      posicao: () => camera.position,
      get fps() {
        return fps;
      },
      pausar(v) {
        pausa = v;
        controle.ativar(!v && ativo, true);
      },
      visitar(n, cb) {
        aoAbrirPorta = null;
        const e = postos.estacoes[n - 1];
        if (!controle.visitar(e, cb)) return false;
        destinoNaLente = e;
        return true;
      },
      terraco(cb) {
        destinoNaLente = mirante;
        if (postos.passagem()) return controle.terraco(cb);
        aoAbrirPorta = cb;
        return true;
      },
      get naPassagemOuTerraco() {
        return camera.position.z < geo.frentePorta;
      }
    };
  } catch (erro) {
    dispor();
    throw erro;
  }
}

async function iniciar() {
  const curso = await carregarCurso(),
    p = criarProgresso(curso.estacoes);
  let modo = 'entrada',
    atual = null,
    estacaoDestino = null,
    mundo = null,
    criando = null,
    pedido = 0,
    entradaSemAnimacao = -1,
    noTerraco = false,
    ultimas = p.feitas();
  const ui = criarInterface(curso, p, {
    entrar,
    irPara,
    irTerraco,
    rever,
    posicao: () => mundo?.posicao() || chegada,
    painel(v) {
      if (modo === '3d') mundo?.pausar(v);
    }
  });
  function situar(n, indoPara = null) {
    atual = n;
    estacaoDestino = indoPara;
    ui.situar(n, indoPara);
  }
  function trocar(novo) {
    modo = novo;
    ui.modo(novo);
  }
  function falha() {
    ++pedido;
    mundo?.dispor();
    mundo = null;
    trocar('sem-3d');
    if (atual) ui.focarLeitura(atual);
    ui.anunciar(curso.ui.alternativa_3d);
  }
  async function entrar(destino) {
    const turno = ++pedido;
    if (destino === 'sem-3d') {
      mundo?.mostrar(false);
      if (estacaoDestino) situar(null);
      trocar('sem-3d');
      if (atual) ui.focarLeitura(atual);
      return;
    }
    try {
      if (!mundo) {
        trocar('carga');
        ui.andamento(0, 1);
        criando ??= criarMundo(ui, {
          falha,
          visitar: irPara,
          emEstacaoOuACaminho: () => Boolean(atual || estacaoDestino),
          terraco: irTerraco,
          nome: n => curso.estacoes[n - 1].nome,
          abrir: n => ui.abrirEstacao(n),
          impedir(porta) {
            const gesto = controlesDeToque() ? 'Toque' : 'Clique';
            ui.anunciar(porta && p.feitas().length < 4 ? portaFechada() : `Nêo dá para chegar ali. ${gesto} no piso livre.`);
          },
          mover(n, z) {
            if (noTerraco && z >= planta.norte) {
              noTerraco = false;
              situar(null);
            }
            if (estacaoDestino || n !== atual) situar(n);
          }
        }).finally(() => {
          criando = null;
        });
        mundo = await criando;
      }
      if (turno !== pedido) return;
      trocar('3d');
      mundo.sincronizar(p.feitas(), true);
      mundo.entrada(entradaSemAnimacao !== turno);
      mundo.mostrar(true);
      noTerraco = false;
      if (atual) irPara(atual);
      else situar(null);
    } catch (erro) {
      if (turno === pedido) {
        console.warn('Casa 3D:', erro.message);
        falha();
      }
    }
  }
  function irPara(n) {
    if (!curso.estacoes.some((e) => e.numero === n)) return false;
    ui.fechar();
    noTerraco = false;
    if (modo === '3d') {
      mundo.pausar(false);
      situar(null, n);
      if (!mundo.visitar(n, () => situar(n))) {
        situar(null);
        return false;
      }
    } else {
      if (modo !== 'sem-3d') entrar('sem-3d');
      situar(n);
      ui.focarLeitura(n);
    }
    return true;
  }
  function portaFechada() {
    const faltam = 4 - p.feitas().length;
    return faltam === 1 ? 'Porta fechada. Falta uma estaçêo.' : `Porta fechada. Faltam ${faltam} estações.`;
  }
  function irTerraco(aPe = false) {
    if (p.feitas().length !== 4) {
      ui.anunciar(portaFechada());
      return false;
    }
    const chegar = () => {
      if (noTerraco && modo === '3d') return;
      noTerraco = true;
      situar(null);
      document.getElementById('local').textContent = 'Terraço';
      ui.finalizar();
    };
    if (modo === '3d' && !aPe) {
      ui.fechar();
      mundo.pausar(false);
      if (!noTerraco) situar(null);
      return mundo.terraco(chegar);
    } else chegar();
    return true;
  }
  function rever() {
    noTerraco = false;
    situar(null);
    if (modo === '3d') mundo.entrada(false);
  }
  p.eventos.addEventListener('change', () => {
    const feitas = p.feitas();
    const mudou = ultimas.length !== feitas.length || feitas.some((n) => !ultimas.includes(n));
    if (mudou) mundo?.sincronizar(feitas);
    if (feitas.length < 4 && (noTerraco || (ultimas.length === 4 && mundo?.naPassagemOuTerraco))) {
      ui.fechar();
      rever();
    }
    const novas = feitas.filter((n) => !ultimas.includes(n));
    ui.atualizar();
    if (novas.length) {
      const n = novas.at(-1),
        e = curso.estacoes[n - 1];
      const ordenada = feitas.every((f, i) => f === i + 1);
      const msg = ordenada
        ? e.fala_conclusao
        : curso.ui.conclusao_fora_de_ordem.replace('{nome}', e.nome).replace('{numero}', n);
      ui.recompensa(feitas.length === 4 ? 'Quatro estações concluídas. A porta abriu.' : msg, n);
    }
    ultimas = feitas;
  });
  function limpar() {
    entradaSemAnimacao = pedido;
    ui.fechar();
    p.limpar();
    document.getElementById('nome').value = '';
    mundo?.sincronizar([], true);
    rever();
    if (modo === 'sem-3d') ui.focarLeitura(0);
  }
  window.__curso = {
    info: () => mundo?.info() ?? {drawCalls: 0, triangulos: 0, texturas: 0, qualidade: 'sem-3d', pixelRatio: 0},
    estado: () => ({
      modo,
      estacaoAtual: atual,
      feitas: p.feitas().length,
      exerciciosFeitos: p.total,
      portaAberta: p.feitas().length === 4,
      terracoLiberado: p.feitas().length === 4,
      webgl: !!mundo,
      fps: modo === '3d' ? mundo?.fps || 0 : 0
    }),
    irPara,
    verPorta() {
      if (modo !== '3d') return false;
      ui.fechar();
      mundo.pausar(false);
      noTerraco = false;
      situar(null);
      mundo.verPorta();
      return true;
    },
    abrirEstacao(n) {
      if (!curso.estacoes.some((e) => e.numero === n)) return false;
      ui.abrirEstacao(n);
      return true;
    },
    marcarExercicio: (n, id) => p.marcar(n, id),
    marcarEstacao: (n) => p.completar(n),
    irTerraco: () => irTerraco(),
    limpar
  };
  ui.sincronizar();
}
iniciar().catch((erro) => {
  const caixa = document.getElementById('erro');
  caixa.hidden = false;
  caixa.querySelector('p').textContent = erro.message || 'O conteúdo do curso nêo carregou.';
  caixa.scrollIntoView();
});
