import * as T from '../vendor/three/three.module.js';
import { grupo, malha, pbr, bloco, haste, cilindro, agruparEstaticos, sombraContato, uvMetrico } from './geometria.js';
import { cadeira, lanterna, vela } from './moveis.js';
import { comandosTerminal, conversaJarvis } from './dados.js';
import { planta, posicoes } from './planta.js';

const tinta = pbr(0x323130, 0.43, 0.51),
  aco = pbr(0x918f85, 0.33, 0.72),
  couro = pbr(0x755a43, 0.83);
const apagada = new T.MeshPhysicalMaterial({ color: 0x080a0a, roughness: 0.30, metalness: 0.08, clearcoat: 0.12 });
function canvasMaterial(w, h, desenhar) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  desenhar(ctx, w, h);
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  return new T.MeshBasicMaterial({ map: t, toneMapped: false });
}
function escrever(ctx, texto, x, y, px, cor, mono = false) {
  ctx.font = '600 ' + px + 'px ' + (mono ? 'monospace' : 'sans-serif');
  ctx.fillStyle = cor;
  ctx.fillText(texto, x, y);
}
const ambar = new T.MeshBasicMaterial({ color: 0xffb54d, toneMapped: false });
function tela(g, w, h, arte, estagio, standby = false) {
  bloco(g, tinta, 0, 0, 0, w + 0.018, h + 0.02, 0.016, 0.007);
  const m = malha(g, new T.PlaneGeometry(w, h), apagada, 0, 0, 0.009);
  m.userData.dinamico = true;
  m.castShadow = false;
  let led;
  if (standby) {
    led = malha(g, new T.CircleGeometry(.004, 12), ambar, w / 2 - .015, -h / 2 + .011, .010);
    led.userData.dinamico = true;
    led.castShadow = false;
  }
  estagio.telas.push({ m, acesa: arte, led });
}
function bancada(g, mat, w, d) {
  bloco(g, mat, 0, 0.769, 0, w, 0.065, d, 0.023);
  for (const lado of [-1, 1]) {
    for (const s of [-1, 1])
      haste(g, mat, [lado * (w * 0.45), 0.01, s * d * 0.43], [lado * w * 0.427, 0.747, s * d * 0.37], 0.043, 0.029);
    bloco(g, mat, lado * w * 0.429, 0.642, 0, 0.065, 0.16, d * 0.76);
  }
  bloco(g, mat, 0, 0.62, -d * 0.34, w * 0.85, 0.19, 0.046);
}
function terminal(g, mat, e) {
  bancada(g, mat, 1.84, 0.82);
  bloco(g, couro, 0.04, 0.807, 0.02, 0.79, 0.012, 0.49, 0.005);
  const pc = grupo(g, -0.09, 0.822, 0.01, -0.32);
  pc.scale.setScalar(1.32);
  bloco(pc, aco, 0, 0, 0, 0.454, 0.015, 0.299, 0.006);
  bloco(pc, tinta, 0, 0.008, -0.035, 0.402, 0.004, 0.132, 0.001);
  for (let r = 0; r < 5; r++)
    for (let i = 0; i < 14; i++) {
      bloco(pc, aco, (i - 6.5) * 0.027, 0.011, -0.087 + r * 0.026, 0.022, 0.004, 0.018, 0.001);
    }
  bloco(pc, tinta, 0, 0.009, 0.085, 0.125, 0.003, 0.067, 0.001);
  const charneira = grupo(pc, 0, 0.01, -0.143);
  charneira.rotation.x = -0.15;
  const tampa = grupo(charneira, 0, 0.145, 0);
  tela(
    tampa,
    0.432,
    0.267,
    canvasMaterial(768, 480, (c, w, h) => {
      c.fillStyle = '#141c1c';
      c.fillRect(0, 0, w, h);
      c.fillStyle = '#303c3b';
      c.fillRect(0, 0, w, 36);
      escrever(c, 'Terminal', 26, 27, 23, '#d6deda', true);
      comandosTerminal.forEach((linha, i) => {
        escrever(c, linha, 24, 103 + 65 * i, 49, linha.startsWith('>') ? '#fff0cb' : '#adcbb3', true);
      });

    }),
    e, true
  );
  e.telas[0].espera = canvasMaterial(768, 480, (c, w, h) => {
    c.fillStyle = '#0b0e0e';
    c.fillRect(0, 0, w, h);
    escrever(c, 'em espera', 32, h - 46, 48, '#848782');
  });
  cadeira(g, e.tecido, 0.68, 0.47, -0.3);
}
function jarvis(g, mat, e) {
  cadeira(g, e.tecido, -0.35, 0.02, 0.07, true);
  cilindro(g, tinta, 0.42, 0.044, 0, 0.173, 0.2, 0.06);
  haste(g, aco, [0.42, 0.052, 0], [0.42, 0.658, 0], 0.023);
  cilindro(g, mat, 0.42, 0.67, 0, 0.31, 0.31, 0.044, 44);
  bloco(g, aco, .42, .708, .025, .23, .030, .21, .012);
  haste(g, tinta, [.42, .718, -.035], [.42, .945, .052], .026);
  const suporte = grupo(g, .42, .997, .079, .11);
  suporte.rotation.x = -.39;
  bloco(suporte, tinta, 0, -.045, -.022, .123, .249, .035, .012);
  bloco(suporte, aco, 0, -.178, .005, .175, .021, .055, .007);
  tela(
    suporte,
    .168,
    .342,
    canvasMaterial(384, 768, (c, w, h) => {
      c.fillStyle = '#232421';
      c.fillRect(0, 0, w, h);
      escrever(c, 'Jarvis', 20, 106, 91, '#f9d57b');
      c.fillStyle = '#59503e';
      c.fillRect(57, 150, 314, 224);
      const [quando, dia] = conversaJarvis[0].split(' ');
      escrever(c, quando, 75, 239, 74, '#fff4dc');
      escrever(c, dia, 75, 328, 64, '#fff4dc');
      c.fillStyle = '#ebe2cc';
      c.fillRect(13, 404, 355, 289);
      const [tarefa, ...resto] = conversaJarvis[1].split(' ');
      escrever(c, tarefa, 29, 505, 74, '#292b26');
      escrever(c, resto.join(' '), 29, 604, 65, '#292b26');
    }),
    e
  );
}
function filas(g, mat, e) {
  // The occupied lane has room for two columns. Its ten cards travel together.
  const largura = 3.18, altura = 2.22, centro = 1.64, curso = .80;
  bloco(g, mat, 0, centro, 0, largura, altura, .092, .031);
  bloco(g, pbr(0x9b805c, .97), 0, centro, .053, 3.09, 2.13, .032);
  function faixa(texto, w, h, x, y, fundo, fonte) {
    const arte = canvasMaterial(Math.round(w * 490), Math.round(h * 490), (c, a, b) => {
      c.fillStyle = fundo;
      c.fillRect(0, 0, a, b);
      escrever(c, texto, 12, b * .76, fonte, '#fff1d5');
    });
    return malha(g, new T.PlaneGeometry(w, h), arte, x, y, .084);
  }
  faixa('Na fila', .70, .184, -1.16, 2.59, '#43392e', 61);
  const feito = faixa('Feito', .70, .184, 1.16, 2.59, '#43392e', 61);
  const divisor = bloco(g, mat, .78, 1.65, .081, .012, 1.65, .01, 0);
  faixa('Portão · aprovar antes de publicar', 3.01, .172, 0, .675, '#51412e', 49);
  const tarefas = [
    'Transcrever reunião', 'Dublar vídeo', 'Vídeo explicativo', 'Criar curso', 'Criar reel',
    'Transcrever vídeo', 'Dublar reel', 'Resumir reunião', 'Roteiro de reel', 'Post da semana'
  ];
  const fichas = grupo(g, 0, 0, .097);
  const papel = pbr(0xe4d4ab, .92);
  const atlas = canvasMaterial(1024, 900, (c, w, h) => {
    c.fillStyle = '#ecdbb5';
    c.fillRect(0, 0, w, h);
    tarefas.forEach((texto, i) => {
      const x = (i % 2) * 512, y = Math.floor(i / 2) * 180;
      c.fillStyle = '#302b25';
      c.font = '600 84px sans-serif';
      const palavras = texto.split(' ');
      const primeira = palavras.shift();
      c.fillText(primeira, x + 16, y + 79, 480);
      c.fillText(palavras.join(' '), x + 16, y + 163, 480);
    });
  });
  tarefas.forEach((_, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = -.956 + col * 1.115, y = 2.30 - row * .335;
    bloco(fichas, papel, x, y, 0, 1.073, .319, .009, .004);
    const geo = new T.PlaneGeometry(1.061, .309), uv = geo.attributes.uv;
    for (let j = 0; j < uv.count; j++) uv.setXY(j, (col + uv.getX(j)) / 2, (4 - row + uv.getY(j)) / 5);
    malha(fichas, geo, atlas, x, y, .005);
    cilindro(fichas, tinta, x, y + .151, .008, .009, .009, .012, 8).rotation.x = Math.PI / 2;
  });
  agruparEstaticos(fichas);
  fichas.traverse(m => { m.userData.dinamico = true; });
  divisor.userData.dinamico = feito.userData.dinamico = true;
  e.moverCartoes = (fracao) => {
    fichas.position.x = curso * fracao;
    divisor.position.x = .78 - 1.56 * fracao;
    feito.position.x = 1.16 - 1.56 * fracao;
  };
}
// Three editorial subjects from the course. Each channel cycles through the
// reach, authority and promotional reels of its own niche.
function quadroReel(c, nicho, formato, quadro) {
  const w = 432, h = 768;
  const paletas = [
    ['#293e48', '#7caca9', '#ecba89'], ['#283623', '#6c843d', '#e5c574'], ['#513037', '#dd885e', '#f3deb2']
  ];
  const [sombra, meio, claro] = paletas[nicho];
  const ceu = c.createLinearGradient(0, 0, w * .3, h * .68);
  ceu.addColorStop(0, sombra); ceu.addColorStop(1, meio);
  c.fillStyle = ceu; c.fillRect(0, 0, w, h);
  c.save();
  c.translate(216, 370);
  c.scale(1 + .13 * quadro, 1 + .13 * quadro);
  c.translate(-216 + formato * 24 - 20, -370);
  c.fillStyle = claro;
  if (nicho === 0) {
    // Sun falling across two architectural elevations.
    c.fillRect(38, 304, 224, 236); c.fillStyle = sombra; c.fillRect(262, 330, 94, 210);
    c.fillStyle = meio;
    for (let i = 0; i < 4; i++) c.fillRect(59 + 46 * i, 329, 26, 114);
    c.fillStyle = claro; c.fillRect(9, 292, 279, 13);
  } else if (nicho === 1) {
    c.beginPath(); c.arc(276, 313, 61, 0, Math.PI * 2); c.fill();
    for (let j = 0; j < 8; j++) {
      c.fillStyle = j % 2 ? meio : sombra;
      c.beginPath(); c.moveTo(-70, 363 + j * 20);
      c.bezierCurveTo(160, 244 + j * 18, 253, 487 + j * 9, 500, 319 + j * 18);
      c.lineTo(500, 632); c.lineTo(-70, 632); c.fill();
    }
  } else {
    c.translate(207, 372); c.rotate(-.16 + formato * .07);
    for (let i = 2; i >= 0; i--) {
      c.fillStyle = i === 0 ? claro : i === 1 ? meio : sombra;
      c.fillRect(-147 + i * 12, -96 + i * 22, 275, 188);
    }
    c.fillStyle = sombra; c.fillRect(-13, -94, 5, 184);
    for (let j = 0; j < 5; j++) c.fillRect(12, -61 + 22 * j, 85 - (j % 2) * 25, 4);
  }
  c.restore();
  const rodape = c.createLinearGradient(0, h * .57, 0, h);
  rodape.addColorStop(0, 'transparent'); rodape.addColorStop(1, sombra);
  c.fillStyle = rodape; c.fillRect(0, h * .57, w, h * .43);
  c.fillStyle = claro;
  for (let j = 0; j < 3; j++) c.fillRect(22 + j * 130, 27, 114, j === quadro ? 10 : 3);
  const exemplos = [
    ['Quem disse', 'isso?', 'A base com fonte', 'Ache o trecho'],
    ['De onde vem', 'o número?', 'Roteiro de 60 s', 'Confira a fala'],
    ['Já dá para', 'publicar?', 'Agenda com portão', 'Revise antes']
  ];
  const [linha1, linha2, fonte, beneficio] = exemplos[nicho];
  c.fillStyle = sombra;
  c.fillRect(0, 49, w, 146);
  escrever(c, linha1, 22, 114, 60, '#fff6e9');
  escrever(c, linha2, 22, 177, 60, '#fff6e9');
  c.fillStyle = sombra;
  c.fillRect(0, 440, w, h - 440);
  escrever(c, 'FONTE NA TELA', 22, 499, 38, claro);
  escrever(c, 'ARCKHÉ AI', 22, 552, 48, '#fff6e9');
  escrever(c, fonte, 22, 603, 40, '#fff6e9');
  escrever(c, 'BENEFÍCIO', 22, 666, 34, claro);
  escrever(c, beneficio, 22, 725, 48, '#fff6e9');
}

function reel(nicho, formato) {
  // Three shots in one texture. Cuts and camera motion only change UVs at playback.
  const w = 252, h = 448;
  return canvasMaterial(3 * w, h, (c) => {
    for (let i = 0; i < 3; i++) {
      c.save();
      c.translate(i * w, 0);
      c.beginPath();
      c.rect(0, 0, w, h);
      c.clip();
      c.scale(w / 432, h / 768);
      quadroReel(c, nicho, formato, i);
      c.restore();
    }
  });
}
function redes(g, mat, e) {
  bancada(g, mat, 2.2, 0.77);
  for (let i = 0; i < 3; i++) {
    const monitor = grupo(g, (i - 1) * 0.56, 0.801, -0.06, (1 - i) * 0.13);
    bloco(monitor, tinta, 0, 0.017, 0, 0.276, 0.034, 0.208);
    haste(monitor, aco, [0, 0.03, -0.038], [0, 0.42, -0.06], 0.023);
    const moldura = grupo(monitor, 0, 0.59, -0.028);
    moldura.rotation.x = -0.034;
    const reels = [0, 1, 2].map((j) => reel(i, j));
    tela(moldura, .408, .737, reels[i], e, true);
    e.telas[i].reels = reels;
  }
}

export function instalarEstacoes(cena, materiais) {
  const madeira = materiais['madeira-forro'].clone();
  madeira.color.set(0x9a7c65);
  const config = [
    { giro: Math.PI, caixa: [-4.08, -2.02, 1.78, 3.21], montar: terminal },
    { giro: Math.PI / 2, caixa: [-3.79, -2.81, -2.46, -.89], montar: jarvis },
    { giro: Math.PI, caixa: [-.02, 3.18, 2.97, 3.34], montar: filas },
    { giro: -Math.PI / 2, caixa: [4.93, 5.99, -1.77, .53], montar: redes }
  ];
  const estacoes = config.map((tipo, i) => {
    const cfg = { ...tipo, ...posicoes[i] };
    const g = grupo(cena, cfg.x, 0, cfg.z, cfg.giro);
    const e = { ...cfg, grupo: g, telas: [], tecido: materiais.tecido, acesa: false };
    cfg.montar(g, madeira, e);
    const xx = [0.77, -1.11, 0, 0.94][i],
      yy = [0.807, .84, 1.7, 0.807][i],
      zz = i === 1 ? -.76 : -.14;
    e.chamas = [];
    if (i !== 2) {
      const escala = i === 1 ? 1.04 : .59;
      e.chamas.push(lanterna(g, xx, yy, zz, escala), vela(g, xx - .12, yy, zz + .14, .029, .078));
      sombraContato(g, 0, 0, 0, i === 1 ? 1.8 : 2.25, 1.12);
    }
    const luz = new T.PointLight(0xffc077, 0, 2.4, 2);
    luz.position.set(xx, yy + 0.23, i === 2 ? 0.25 : zz + .06);
    g.add(luz);
    e.luz = luz;
    agruparEstaticos(g);
    g.userData.estacao = i + 1;
    return e;
  });
  const x = planta.portaX,
    z = -4.8,
    degraus = [],
    aros = [];
  const dobradica = grupo(cena, x - 0.7, 0.68, z + 0.02),
    porta = pbr(0xf2b51a, 0.52),
    friso = pbr(0xb88215, 0.68);
  porta.normalMap = materiais['madeira-forro'].normalMap.clone();
  porta.normalMap.rotation = Math.PI / 2;
  porta.normalScale.setScalar(.25);
  bloco(dobradica, friso, 0.7, 1.115, 0, 1.4, 2.23, 0.06);
  for (let i = 0; i < 9; i++) bloco(dobradica, porta, 0.081 + i * 0.155, 1.115, 0.0, 0.15, 2.204, 0.077, 0.006);
  for (const yy of [0.12, 1.01, 2.13]) bloco(dobradica, porta, 0.7, yy, 0.032, 1.37, 0.125, 0.055);
  for (const xx of [.061, 1.339]) bloco(dobradica, porta, xx, 1.12, .043, .105, 2.21, .033, .006);
  // Outside face remains finished when seen from the terrace.
  for (const yy of [.13, 1.01, 2.13]) bloco(dobradica, porta, .70, yy, -.045, 1.37, .116, .035, .006);
  const preto = pbr(0x242321, .46, .32);
  for (const lado of [-1, 1]) {
    bloco(dobradica, preto, 1.232, 1.055, lado * .057, .083, .235, .050, .012);
    haste(dobradica, preto, [1.232, 1.095, lado * .072], [1.232, 1.095, lado * .123], .024, .024, 16);
    bloco(dobradica, preto, 1.162, 1.095, lado * .124, .188, .030, .035, .009);
  }
  agruparEstaticos(dobradica);
  const marco = grupo(cena, x, 0, z);
  marco.userData.passagem = true;
  dobradica.userData.passagem = true;
  for (const dx of [-0.765, 0.765]) bloco(marco, madeira, dx, 1.805, 0, 0.125, 2.27, 0.41);
  bloco(marco, madeira, 0, 2.99, 0, 1.66, 0.15, 0.42);
  // The bolt runs from the foot of the handle plate into the jamb.
  const trava = grupo(marco, .64, 1.65, .112);
  bloco(trava, aco, 0, 0, 0, .237, .023, .024);
  bloco(trava, preto, -.103, -.059, .008, .056, .057, .028, .007);
  const arco = malha(trava, new T.TorusGeometry(.021, .005, 8, 18, Math.PI), aco, -.103, -.031, .008);
  arco.castShadow = true;
  const laje = materiais.concreto.clone();
  laje.color.set(0xb4a68f);
  for (let i = 0; i < 4; i++) {
    const h = (i + 1) * 0.17,
      zz = z + 1.12 - i * 0.32;
    const contorno = bloco(marco, materiais.pedra, 0, (h - .035) / 2, zz - z, 1.69, h - .035, .35);
    contorno.updateWorldMatrix(true, false);
    contorno.geometry = uvMetrico(contorno.geometry.clone(), contorno.matrixWorld);
    const piso = bloco(marco, laje, 0, h - .0175, zz - z, 1.7, .035, .35);
    degraus.push(contorno, piso);
    const lamp = pbr(0x584637, 0.52, 0.44);
    const aro = bloco(marco, lamp, 0, h - 0.056, zz - z + 0.178, 1.48, 0.021, 0.012, 0.004);
    aros.push(aro);
  }
  bloco(marco, materiais.pedra, 0, 0.34, -0.085, 1.69, 0.68, 0.14);
  let abertas = false,
    abertura = 0;
  function progresso(feitas, chamas) {
    abertas = feitas.length === 4;
    trava.visible = !abertas;
    estacoes.forEach((e, i) => {
      e.acesa = feitas.includes(i + 1);
      e.luz.intensity = e.acesa ? 1.15 : 0;
      for (const { m, acesa, led, espera = apagada } of e.telas) {
        m.material = e.acesa ? acesa : espera;
        if (led) led.visible = !e.acesa;
      }
      for (const chama of [...e.chamas, ...chamas[i]]) chama.visible = e.acesa;
      const m = aros[i].material;
      m.color.set(e.acesa ? 0xffc45d : 0x584637);
      m.emissive.set(e.acesa ? 0xff952f : 0x000000);
      m.emissiveIntensity = 1.6;
    });
  }
  let tempoReels = 0, posicaoCartoes = 0;
  function animar(dt, reduzido) {
    const canal = estacoes[3];
    if (canal.acesa) {
      tempoReels = reduzido ? 0 : (tempoReels + dt) % 15;
      canal.telas.forEach(({ m, reels }, i) => {
        const fase = tempoReels / 5 + i;
        const trecho = (fase % 1) * 3;
        m.material = reels[Math.floor(fase) % 3];
        const escala = .99 - .045 * (trecho % 1);
        const margem = (1 - escala) / 2;
        m.material.map.repeat.set(escala / 3, escala);
        m.material.map.offset.set((Math.floor(trecho) + margem) / 3, margem);
      });
    } else tempoReels = 0;
    abertura = reduzido ? Number(abertas) : T.MathUtils.damp(abertura, Number(abertas), 3.6, dt);
    dobradica.rotation.y = abertura * 1.6;
    const quadro = estacoes[2], destino = Number(quadro.acesa);
    posicaoCartoes = reduzido ? destino : T.MathUtils.damp(posicaoCartoes, destino, 4, dt);
    quadro.moverCartoes(posicaoCartoes);
  }
  return { estacoes, degraus, dobradica, apagada, progresso, animar, passagem: () => abertas && abertura > 0.82 };
}
