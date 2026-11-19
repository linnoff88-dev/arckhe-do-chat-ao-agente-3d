import * as T from '../vendor/three/three.module.js';
import { chegada, planta, mirante, vistaPorta } from './planta.js';

const raio = 0.18,
  celula = 0.21;
export function navegacao(obstaculos, aberta) {
  const folga = .45;
  const salaOeste = planta.oeste + .265 + folga, salaLeste = planta.leste - .24 - folga;
  const salaSul = planta.sul - .16 - folga, terracoNorte = -9.7 + .19 + folga;
  const terracoOeste = .18 + .17 + folga, terracoLeste = 5.97 - .17 - folga;
  const batente = .70 - folga;
  const frentePorta = planta.norte + .265 + folga, fundoPorta = planta.norte - .205 - folga;
  function livre(x, z) {
    if (z > salaSul || z < terracoNorte) return false;
    if (z < frentePorta && z > fundoPorta &&
        (!aberta() || Math.abs(x - planta.portaX) > batente)) return false;
    if (z <= planta.norte) {
      if (x < terracoOeste || x > terracoLeste) return false;
    } else if (x > salaLeste || x < salaOeste) return false;
    return !obstaculos.some(([x1, x2, z1, z2]) => x > x1 - raio && x < x2 + raio && z > z1 - raio && z < z2 + raio);
  }
  // Along a segment, walkability can only change where it crosses a rectangle edge.
  const bordasX = [salaOeste, salaLeste, terracoOeste, terracoLeste, planta.portaX - batente, planta.portaX + batente];
  const bordasZ = [salaSul, terracoNorte, planta.norte, frentePorta, fundoPorta];
  for (const [x1, x2, z1, z2] of obstaculos) {
    bordasX.push(x1 - raio, x2 + raio);
    bordasZ.push(z1 - raio, z2 + raio);
  }
  function segmento(a, b) {
    if (!livre(b.x, b.z)) return false;
    const dx = b.x - a.x,
      dz = b.z - a.z,
      cortes = [0, 1];
    if (dx)
      for (const x of bordasX) {
        const t = (x - a.x) / dx;
        if (t > 0 && t < 1) cortes.push(t);
      }
    if (dz)
      for (const z of bordasZ) {
        const t = (z - a.z) / dz;
        if (t > 0 && t < 1) cortes.push(t);
      }
    cortes.sort((u, v) => u - v);
    for (let i = 1; i < cortes.length; i++) {
      const t = (cortes[i - 1] + cortes[i]) / 2;
      if (!livre(a.x + dx * t, a.z + dz * t)) return false;
    }
    return true;
  }
  function rota(inicio, fim) {
    if (!livre(fim.x, fim.z)) return [];
    if (segmento(inicio, fim)) return [fim];
    const ix = Math.round(inicio.x / celula),
      iz = Math.round(inicio.z / celula);
    const no = (x, z, g, pai) => ({
      x: x * celula,
      z: z * celula,
      ix: x,
      iz: z,
      g,
      pai,
      f: g + Math.hypot(x * celula - fim.x, z * celula - fim.z)
    });
    const fila = [],
      custos = new Map(),
      chave = (x, z) => x + ',' + z;
    for (let x = ix - 1; x <= ix + 1; x++)
      for (let z = iz - 1; z <= iz + 1; z++) {
        const n = no(x, z, 0, null);
        if (segmento(inicio, n)) {
          fila.push(n);
          custos.set(chave(x, z), 0);
        }
      }
    while (fila.length) {
      fila.sort((a, b) => b.f - a.f);
      const atual = fila.pop();
      if (atual.g > custos.get(chave(atual.ix, atual.iz))) continue;
      if (Math.hypot(atual.x - fim.x, atual.z - fim.z) < celula * 2 && segmento(atual, fim)) {
        const trilha = [fim];
        for (let n = atual; n; n = n.pai) trilha.unshift(n);
        const limpa = [];
        let ancora = inicio;
        for (let i = 0; i < trilha.length; i++) {
          if (i === trilha.length - 1 || !segmento(ancora, trilha[i + 1])) {
            ancora = trilha[i];
            limpa.push(ancora);
          }
        }
        return limpa;
      }
      for (let dx = -1; dx <= 1; dx++)
        for (let dz = -1; dz <= 1; dz++) {
          if (!dx && !dz) continue;
          const x = atual.ix + dx,
            z = atual.iz + dz,
            g = atual.g + celula * Math.hypot(dx, dz),
            k = chave(x, z);
          if (g >= (custos.get(k) ?? Infinity)) continue;
          const vizinho = no(x, z, g, atual);
          if (!segmento(atual, vizinho)) continue;
          custos.set(k, g);
          fila.push(vizinho);
        }
    }
    return [];
  }
  function altura(x, z) {
    if (z <= -4.8) return planta.patamar;
    if (Math.abs(x - planta.portaX) > 0.86) return 0;
    return 0.17 * T.MathUtils.clamp(Math.ceil((-3.5 - z) / 0.32), 0, 4);
  }
  return { livre, rota, altura, frentePorta };
}

export function criarControles({
  camera,
  canvas,
  cena,
  geografia,
  pisos,
  postos,
  aoVisitar,
  aoTerraco,
  aoMover,
  aoAbrir,
  aoImpedir,
  toque,
  reduzido
}) {
  camera.rotation.order = 'YXZ';
  const teclas = new Set(),
    veloc = new T.Vector2(),
    ray = new T.Raycaster(),
    coords = new T.Vector2();
  const mov = {
    w: [0, -1],
    arrowup: [0, -1],
    s: [0, 1],
    arrowdown: [0, 1],
    a: [-1, 0],
    arrowleft: [-1, 0],
    d: [1, 0],
    arrowright: [1, 0]
  };
  let trilha = [],
    inicioEntrada = null,
    fim = null,
    guiado = null,
    pointer,
    ativo = false,
    noTerraco = false;
  let encostouNaPorta = false;
  let mouse = null, ultimoHover = 0, hoverPendente = false;
  function soltarControles() {
    mouse = null;
    canvas.classList.remove('interativo');
    encostouNaPorta = false;
    teclas.clear();
    veloc.set(0, 0);
    pointer = null;
  }
  function parar() {
    soltarControles();
    inicioEntrada = null;
    trilha = [];
    fim = null;
    guiado = null;
  }
  function olhar(p) {
    camera.lookAt(...p);
    camera.rotation.z = 0;
  }
  function entrada(animar = true) {
    parar();
    camera.position.set(chegada.x, 1.62, chegada.z);
    olhar(chegada.olhar);
    if (animar && !reduzido.matches) {
      camera.position.x += 0.52;
      camera.position.z -= 0.20;
      olhar(chegada.olhar);
      inicioEntrada = performance.now();
    }
    noTerraco = false;
  }
  function ir(x, z, alvo, quandoChegar) {
    parar();
    const rota = geografia.rota(camera.position, { x, z });
    if (!rota.length) return false;
    fim = quandoChegar;
    guiado = alvo;
    if (reduzido.matches) {
      camera.position.set(x, 1.62 + geografia.altura(x, z), z);
      if (alvo) olhar(alvo);
      fim = null;
      guiado = null;
      quandoChegar?.();
    } else trilha = rota;
    return true;
  }
  const frente = new T.Vector3(), rumo = new T.Vector3();
  function estacaoAFrente() {
    camera.getWorldDirection(frente);
    let melhor = .70, numero = null;
    postos.estacoes.forEach((e, i) => {
      const p = camera.position;
      rumo.set(...e.olhar).sub(p);
      if (rumo.length() > 3.7 || (rumo.length() > 1.65 && Math.hypot(p.x - e.visita[0], p.z - e.visita[1]) > 1.2)) return;
      const alinhamento = frente.dot(rumo.normalize());
      if (alinhamento > melhor) {
        melhor = alinhamento;
        numero = i + 1;
      }
    });
    return numero;
  }
  function situarCamera() {
    aoMover(camera.position, estacaoAFrente());
  }
  function manual(k) {
    if (!ativo) return;
    inicioEntrada = null;
    trilha = [];
    guiado = null;
    fim = null;
    teclas.add(k);
    situarCamera();
  }
  const eventos = new AbortController();
  const opcoes = { signal: eventos.signal };
  let porTab = false;
  window.addEventListener('keydown', (e) => {
    porTab = e.key === 'Tab';
    if (!ativo || document.querySelector('dialog[open]') || e.defaultPrevented ||
        e.altKey || e.ctrlKey || e.metaKey || e.target.isContentEditable ||
        e.target.closest?.('input, textarea, select, [role="textbox"]')) return;
    const k = e.key.toLowerCase();
    if (Object.hasOwn(mov, k) || k === 'q' || k === 'e') {
      e.preventDefault();
      manual(k);
    } else if (k === 'enter' && !e.repeat &&
        !e.target.closest?.('button, a, summary, [role="button"]')) {
      const estacao = estacaoAFrente();
      if (estacao) aoAbrir(estacao);
    }
  }, opcoes);
  window.addEventListener('keyup', e => teclas.delete(e.key.toLowerCase()), opcoes);
  window.addEventListener('blur', () => { teclas.clear(); veloc.set(0, 0); }, opcoes);
  window.addEventListener('pointerdown', () => {
    porTab = false;
    canvas.classList.remove('foco-tab');
  }, { ...opcoes, capture: true });
  document.addEventListener('focusin', e => {
    canvas.classList.toggle('foco-tab', e.target === canvas && porTab);
    porTab = false;
    if (e.target.isContentEditable || e.target.closest?.('input, textarea, select, [role="textbox"]')) {
      teclas.clear();
      veloc.set(0, 0);
    }
  }, opcoes);
  for (const b of toque.querySelectorAll('[data-tecla]')) {
    const soltar = () => teclas.delete(b.dataset.tecla);
    b.onpointerdown = (e) => {
      e.preventDefault();
      b.setPointerCapture(e.pointerId);
      manual(b.dataset.tecla);
    };
    b.onlostpointercapture = soltar;
    b.onclick = (e) => {
      if (e.detail === 0) {
        manual(b.dataset.tecla);
        setTimeout(soltar, 200);
      }
    };
  }
  canvas.onpointerdown = (e) => {
    if (!ativo || pointer || e.button !== 0) return;
    canvas.focus();
    canvas.setPointerCapture(e.pointerId);
    pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, px: e.clientX, py: e.clientY, arrasta: false };
  };
  canvas.onpointermove = (e) => {
    if (!pointer && ativo && e.pointerType === 'mouse') {
      mouse = [e.clientX, e.clientY];
      hoverPendente = true;
      return;
    }
    if (!pointer || pointer.id !== e.pointerId) return;
    if (Math.hypot(e.clientX - pointer.x, e.clientY - pointer.y) > 4) pointer.arrasta = true;
    if (pointer.arrasta) {
      inicioEntrada = null;
      trilha = [];
      fim = null;
      guiado = null;
      camera.rotation.y -= (e.clientX - pointer.px) * 0.0032;
      camera.rotation.x = T.MathUtils.clamp(camera.rotation.x - (e.clientY - pointer.py) * 0.0032, -1.18, 1.18);
      situarCamera();
    }
    pointer.px = e.clientX;
    pointer.py = e.clientY;
  };
  canvas.onlostpointercapture = () => {
    pointer = null;
  };
  canvas.onpointerup = (e) => {
    if (!pointer || pointer.id !== e.pointerId) return;
    const arrasta = pointer.arrasta;
    pointer = null;
    if (arrasta) return;
    const alvo = apontar(e.clientX, e.clientY);
    if (alvo.estacao) {
      const posto = postos.estacoes[alvo.estacao - 1];
      const p = camera.position;
      if (Math.hypot(p.x - posto.visita[0], p.z - posto.visita[1]) <= 1.2 || alvo.hit.distance <= 1.65)
        aoAbrir(alvo.estacao);
      else if (!aoVisitar(alvo.estacao)) aoImpedir(false);
    } else if (alvo.porta) aoTerraco();
    else if (alvo.piso) {
      aoMover(camera.position, null);
      if (!ir(alvo.hit.point.x, alvo.hit.point.z, null, situarCamera)) aoImpedir(false);
    } else aoImpedir(false);
  };
  canvas.onpointerleave = () => {
    mouse = null;
    canvas.classList.remove('interativo');
  };
  function apontar(x, y) {
    const rect = canvas.getBoundingClientRect();
    coords.set(2 * (x - rect.left) / rect.width - 1, 1 - 2 * (y - rect.top) / rect.height);
    ray.setFromCamera(coords, camera);
    ray.far = 20;
    const hit = ray.intersectObjects(cena.children, true).find(({ object }) => {
      if (!object.isMesh || object.material.transparent) return false;
      for (let o = object; o; o = o.parent) if (!o.visible) return false;
      return true;
    });
    // A doorway is empty space. Compare its plane with the first solid hit.
    if (postos.passagem() && ray.ray.origin.z > planta.norte && ray.ray.direction.z < 0) {
      const distancia = (planta.norte - ray.ray.origin.z) / ray.ray.direction.z;
      if (distancia <= (hit?.distance ?? ray.far)) {
        const ponto = ray.ray.at(distancia, rumo);
        if (Math.abs(ponto.x - planta.portaX) <= planta.larguraPorta / 2 &&
            ponto.y >= planta.patamar && ponto.y <= 2.91) return { porta: true };
      }
    }
    for (let o = hit?.object; o; o = o.parent) {
      if (o.userData.estacao) return { hit, estacao: o.userData.estacao };
      if (o.userData.passagem) return { hit, porta: true };
    }
    return { hit, piso: hit && pisos.includes(hit.object) && geografia.livre(hit.point.x, hit.point.z) &&
      (hit.point.z > planta.norte || postos.passagem()) && geografia.rota(camera.position, hit.point).length > 0 };
  }
  function atualizar(delta, agora) {
    if (!ativo) return;
    const p = camera.position;
    if (mouse && !pointer && agora - ultimoHover >= 100 && (hoverPendente || trilha.length || teclas.size)) {
      const alvo = apontar(...mouse);
      canvas.classList.toggle('interativo', Boolean(alvo.estacao || alvo.porta || alvo.piso));
      ultimoHover = agora;
      hoverPendente = false;
    }
    if (inicioEntrada !== null) {
      const t = T.MathUtils.smoothstep(agora - inicioEntrada, 0, 750);
      p.set(chegada.x + .52 * (1 - t), 1.62, chegada.z - .20 * (1 - t));
      olhar(chegada.olhar);
      if (t === 1) inicioEntrada = null;
      return;
    }
    // Guided paths are collision-checked segments. Limit only free walking steps.
    const dt = trilha.length ? delta : Math.min(.065, delta);
    if (trilha.length) {
      let restante = 2.9 * dt;
      while (trilha.length && restante > 0) {
        const a = trilha[0],
          dx = a.x - p.x,
          dz = a.z - p.z,
          dist = Math.hypot(dx, dz),
          passo = Math.min(dist, restante);
        if (dist > 0.001) {
          p.x += (dx / dist) * passo;
          p.z += (dz / dist) * passo;
        }
        restante -= passo;
        if (dist <= passo + 0.0001) trilha.shift();
      }
      if (guiado) {
        const alvo = new T.Vector3(...guiado).sub(p);
        const yaw = Math.atan2(-alvo.x, -alvo.z),
          pitch = Math.atan2(alvo.y, Math.hypot(alvo.x, alvo.z));
        const f = 1 - Math.exp(-5 * dt);
        camera.rotation.y += Math.atan2(Math.sin(yaw - camera.rotation.y), Math.cos(yaw - camera.rotation.y)) * f;
        camera.rotation.x += (pitch - camera.rotation.x) * f;
      }
      if (!trilha.length) {
        if (guiado) olhar(guiado);
        const cb = fim;
        fim = null;
        guiado = null;
        cb?.();
      }
    } else {
      let x = 0,
        z = 0;
      for (const k of teclas) {
        if (k === 'q' || k === 'e') camera.rotation.y += (k === 'q' ? 1 : -1) * 1.6 * dt;
        else {
          x += mov[k][0];
          z += mov[k][1];
        }
      }
      const yaw = camera.rotation.y,
        ganho = 2.4 / Math.max(1, Math.hypot(x, z));
      veloc.x = T.MathUtils.damp(veloc.x, (x * Math.cos(yaw) + z * Math.sin(yaw)) * ganho, 13, dt);
      veloc.y = T.MathUtils.damp(veloc.y, (z * Math.cos(yaw) - x * Math.sin(yaw)) * ganho, 13, dt);
      if (geografia.livre(p.x + veloc.x * dt, p.z)) p.x += veloc.x * dt;
      const zAlvo = p.z + veloc.y * dt;
      if (geografia.livre(p.x, zAlvo)) p.z = zAlvo;
      else if (!encostouNaPorta && teclas.size && veloc.y < 0 && !postos.passagem() &&
          Math.abs(p.x - planta.portaX) < planta.larguraPorta / 2 && zAlvo <= geografia.frentePorta) {
        encostouNaPorta = true;
        aoImpedir(true);
      }
      if (p.z > geografia.frentePorta + .12 || Math.abs(p.x - planta.portaX) > planta.larguraPorta / 2)
        encostouNaPorta = false;
    }
    if (!trilha.length && (veloc.lengthSq() > 0.003 || teclas.has('q') || teclas.has('e'))) situarCamera();
    p.y = T.MathUtils.damp(p.y, 1.62 + geografia.altura(p.x, p.z), 16, dt);
    if (p.z < planta.norte && !noTerraco) {
      noTerraco = true;
      aoTerraco(true);
    }
    if (p.z >= planta.norte && noTerraco) {
      noTerraco = false;
      if (!guiado) situarCamera();
    }
  }
  entrada(false);
  return {
    entrada,
    dispor() { parar(); eventos.abort(); },
    ir,
    atualizar,
    parar,
    ativar(v, preservarRota = false) {
      ativo = v;
      if (!v && preservarRota) soltarControles();
      else if (!v) parar();
      else if (trilha.length) {
        trilha = geografia.rota(camera.position, trilha.at(-1));
        if (!trilha.length) {
          parar();
          situarCamera();
        }
      }
    },
    verPorta() {
      parar();
      noTerraco = false;
      camera.position.set(vistaPorta.x, 1.62, vistaPorta.z);
      olhar(vistaPorta.olhar);
    },
    visitar(e, cb) {
      return ir(...e.visita, e.olhar, cb);
    },
    terraco(cb) {
      return ir(mirante.x, mirante.z, mirante.olhar, cb);
    }
  };
}
