import * as T from '../vendor/three/three.module.js';
import {
  pbr,
  grupo,
  malha,
  bloco,
  cilindro,
  oval,
  haste,
  torneado,
  fio,
  agruparEstaticos,
  sombraContato
} from './geometria.js';

const ferro = pbr(0x282622, 0.57, 0.65),
  bronze = pbr(0x826242, 0.41, 0.61),
  pes = pbr(0x53392b, 0.53);
const costura = pbr(0x806858, .96);
const cera = pbr(0xdab17c, 0.68),
  linho = pbr(0xe8cfac, 0.93);
// Smooth, closed upholstery. Different powers round the lip and the corners
// independently; the front and back belong to the same sphere topology.
function almofada(pai, mat, largura, altura, fundo, y, z, encosto = false) {
  const geo = new T.SphereGeometry(1, 40, 24);
  const p = geo.attributes.position, normal = geo.attributes.normal, uv = geo.attributes.uv;
  const curva = (v, e) => Math.abs(v) < 1e-8 ? 0 : Math.sign(v) * Math.abs(v) ** e;
  function superficie(lon, lat) {
    const anel = curva(Math.cos(lat), encosto ? .39 : .53);
    const u = anel * curva(Math.cos(lon), .53), v = curva(Math.sin(lat), .54);
    const t = (1 + v) * .5;
    return new T.Vector3(
      u * largura * .5 * (encosto ? .82 + .18 * t : 1),
      v * altura * .5 - (encosto ? .032 * t * u * u : 0),
      anel * curva(Math.sin(lon), .53) * fundo * .5 + (encosto ? .065 * u * u - .084 * t : 0)
    );
  }
  for (let i = 0; i < p.count; i++) {
    const lon = (1 - uv.getX(i)) * Math.PI * 2 + Math.PI;
    const lat = (uv.getY(i) - .5) * Math.PI;
    const pos = superficie(lon, lat);
    const maxLat = Math.PI / 2 - .0001;
    const tangente = superficie(lon + .001, lat).sub(superficie(lon - .001, lat));
    const vertical = superficie(lon, Math.min(maxLat, lat + .001)).sub(superficie(lon, Math.max(-maxLat, lat - .001)));
    const n = Math.abs(lat) > maxLat ? new T.Vector3(0, Math.sign(lat), 0) : vertical.cross(tangente).normalize();
    p.setXYZ(i, pos.x, pos.y, pos.z);
    normal.setXYZ(i, n.x, n.y, n.z);
  }
  const corpo = malha(pai, geo, mat, 0, y, z);
  // O vivo acompanha a superfície nos dois lados do encosto e na borda do assento.
  const pontos = [];
  for (let i = 0; i < 64; i++) {
    const a = i / 64 * Math.PI * 2;
    if (encosto) {
      const lat = Math.asin(.97 * Math.sin(a));
      pontos.push(superficie(Math.cos(a) > 0 ? .23 : Math.PI - .23, lat));
    } else pontos.push(superficie(a, .24));
  }
  const curvaCostura = new T.CatmullRomCurve3(pontos, true);
  malha(corpo, new T.TubeGeometry(curvaCostura, 80, .0024, 5, true), costura);
}
export function cadeira(pai, mat, x, z, giro = 0, poltrona = false) {
  const g = grupo(pai, x, 0, z, giro),
    w = poltrona ? 0.78 : 0.48,
    d = poltrona ? 0.7 : 0.46;
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      haste(g, pes, [sx * w * 0.43, 0.018, sz * d * 0.47], [sx * w * 0.35, 0.43, sz * d * 0.36], 0.033, 0.021);
    }
  bloco(g, pes, 0, 0.405, 0, w * 0.91, 0.08, d * 0.88, 0.028);
  almofada(g, mat, w, 0.177, d, 0.477, 0.016);
  const h = poltrona ? 0.59 : 0.66;
  almofada(g, mat, w * 1.10, h, 0.168, 0.435 + h / 2, -d * 0.42, true);
  sombraContato(g, 0, 0, 0, w * 1.34, d * 1.34);
  if (poltrona)
    for (const s of [-1, 1]) {
      bloco(g, mat, s * (w / 2 - 0.04), 0.597, -0.005, 0.125, 0.251, d * 0.9, 0.045);
      oval(g, mat, s * (w / 2 - 0.04), 0.723, -0.023, 0.068, 0.052, d * 0.45);
    }
  return g;
}

export function vela(pai, x, y, z, raio = 0.043, altura = 0.13) {
  const g = grupo(pai, x, y, z);
  torneado(
    g,
    cera,
    0,
    0,
    0,
    [
      [0, 0],
      [raio * 0.94, 0],
      [raio, 0.009],
      [raio, altura - 0.009],
      [raio * 0.92, altura],
      [raio * 0.5, altura - 0.012],
      [0, altura - 0.013]
    ],
    18
  );
  cilindro(g, ferro, 0, altura, 0, 0.003, 0.003, 0.026, 7);
  const chama = oval(
    g,
    new T.MeshBasicMaterial({ color: 0xffd787 }),
    0,
    altura + 0.026,
    0,
    raio * 0.17,
    0.032,
    raio * 0.17
  );
  chama.userData.dinamico = true;
  chama.castShadow = false;
  chama.visible = false;
  return chama;
}
export function lanterna(pai, x, y, z, escala = 1) {
  const g = grupo(pai, x, y, z);
  g.scale.setScalar(escala);
  torneado(
    g,
    bronze,
    0,
    0,
    0,
    [
      [0, 0],
      [0.127, 0],
      [0.133, 0.024],
      [0.11, 0.052],
      [0.109, 0.072],
      [0, 0.072]
    ],
    8
  );
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4,
      b = ((k + 1) * Math.PI) / 4,
      at = (ang, h, r = 0.108) => [r * Math.cos(ang), h, r * Math.sin(ang)];
    haste(g, ferro, at(a, 0.06), at(a, 0.36), 0.008);
    for (const yy of [0.092, 0.26]) {
      fio(g, bronze, [at(a, yy), at((a + b) / 2, yy + 0.068, 0.101), at(b, yy)], 0.004, 8);
      haste(g, bronze, at(a, yy + 0.02), at(b, yy + 0.02), 0.004);
    }
  }
  torneado(
    g,
    ferro,
    0,
    0.35,
    0,
    [
      [0.123, 0],
      [0.129, 0.018],
      [0.095, 0.036],
      [0.083, 0.07],
      [0.052, 0.093],
      [0.044, 0.116],
      [0.023, 0.126],
      [0, 0.154]
    ],
    8
  );
  const aro = malha(g, new T.TorusGeometry(0.035, 0.005, 8, 18), bronze, 0, 0.517, 0);
  aro.rotation.y = 0.35;
  return vela(g, 0, 0.07, 0, 0.045, 0.12);
}

function lareira(pai) {
  const g = grupo(pai, -3.36, 0, -3.86, 0.7);
  bloco(g, ferro, 0, 0.09, 0, 1.02, 0.12, 0.64, 0.047);
  for (const x of [-0.41, 0.41]) for (const z of [-0.22, 0.22]) haste(g, ferro, [x, 0.1, z], [x, 0.32, z], 0.025);
  bloco(g, ferro, 0, 0.34, 0, 1.09, 0.11, 0.68, 0.045);
  const chapa = pbr(0x494641, .34, .69);
  const aco = pbr(0x716e65, .26, .82);
  const refratario = pbr(0x50453a, .95);
  bloco(g, refratario, 0, .68, -.32, 1.03, .58, .055);
  for (const lado of [-1, 1]) {
    bloco(g, chapa, lado * .49, .68, -.07, .045, .58, .49);
    bloco(g, aco, lado * .49, .68, .19, .052, .58, .038);
  }
  bloco(g, aco, 0, .415, .28, 1.02, .047, .075);
  for (const z of [-.19, .18]) haste(g, ferro, [-.41, .44, z], [.41, .44, z], .021);
  for (let i = -4; i <= 4; i++) haste(g, aco, [i * .087, .46, -.22], [i * .087, .46, .21], .013);
  for (let i = 0; i < 3; i++)
    haste(g, pes, [-.27, .53 + i * .024, -.14 + i * .085], [.26, .53, -.04 + i * .095], .046, .056, 9);

  // Rolled lip, folded seams and slip collars on the flue catch the window light.
  const coifa = torneado(g, chapa, 0, .95, 0,
    [[.61, 0], [.64, .035], [.61, .075], [.146, .72], [.146, .77]], 32);
  coifa.scale.z = .74;
  const aro = malha(g, new T.TorusGeometry(.627, .016, 8, 40), aco, 0, .988, 0);
  aro.rotation.x = Math.PI / 2;
  aro.scale.y = .74;
  for (let i = 0; i < 8; i++) {
    const x = Math.sin(i * Math.PI / 4), z = .74 * Math.cos(i * Math.PI / 4);
    haste(g, aco, [.611 * x, 1.025, .611 * z], [.148 * x, 1.67, .148 * z], .006);
  }
  cilindro(g, chapa, 0, 2.61, 0, .146, .146, 1.89, 32);
  for (const y of [1.7, 2.59, 3.42]) cilindro(g, aco, 0, y, 0, .153, .153, .034, 32);
}

function flores(pai, x, y, z) {
  const g = grupo(pai, x, y, z);
  torneado(
    g,
    pbr(0x3a322c, 0.29, 0.25),
    0,
    0,
    0,
    [
      [0, 0],
      [0.124, 0.008],
      [0.127, 0.036],
      [0.099, 0.28],
      [0.078, 0.344],
      [0.079, 0.357],
      [0.068, 0.358],
      [0.066, 0.33]
    ],
    36
  );
  const folha = pbr(0x4c5936, 0.84),
    petala = pbr(0xbd916e, 0.85),
    clara = pbr(0xe9cdb3, 0.83);
  for (let i = 0; i < 13; i++) {
    const a = i * 2.4,
      r = 0.07 + (i % 4) * 0.032,
      px = Math.cos(a) * r,
      pz = Math.sin(a) * r,
      h = 0.44 + ((i * 7) % 9) * 0.021;
    haste(g, folha, [0, 0.24, 0], [px, h, pz], 0.0025, 0.0045);
    const f = oval(g, folha, px * 0.72, h - 0.08, pz * 0.72, 0.025, 0.009, 0.061);
    f.rotation.set(0.45, a, 0.32);
    for (let j = 0; j < 5; j++) {
      const t = j * 1.2566;
      const p = oval(
        g,
        i % 3 ? clara : petala,
        px + Math.cos(t) * 0.018,
        h + 0.005,
        pz + Math.sin(t) * 0.018,
        0.022,
        0.014,
        0.024
      );
      p.rotation.z = 0.4 * Math.sin(t);
    }
  }
}

function cadeiraFerro(pai, x, z, giro, esmalte) {
  const g = grupo(pai, x, 0, z, giro);
  torneado(
    g,
    esmalte,
    0,
    0.44,
    0,
    [
      [0, -0.02],
      [0.19, -0.022],
      [0.221, -0.006],
      [0.222, 0.008],
      [0.204, 0.016],
      [0, 0.013]
    ],
    32
  );
  for (const s of [-1, 1])
    for (const t of [-1, 1]) {
      fio(
        g,
        esmalte,
        [
          [s * 0.215, 0.012, t * 0.21],
          [s * 0.17, 0.09, t * 0.164],
          [s * 0.131, 0.31, t * 0.13],
          [s * 0.14, 0.45, t * 0.14]
        ],
        0.012
      );
    }
  fio(
    g,
    esmalte,
    [
      [-0.17, 0.44, -0.12],
      [-0.221, 0.73, -0.19],
      [-0.168, 0.93, -0.24],
      [0, 1.01, -0.26],
      [0.168, 0.93, -0.24],
      [0.221, 0.73, -0.19],
      [0.17, 0.44, -0.12]
    ],
    0.010,
    42
  );
  for (let j = 0; j < 5; j++) {
    const a = (j - 2) * 0.48;
    const pts = [];
    for (let i = 0; i <= 38; i++) {
      const t = i / 38,
        angle = t * Math.PI * 2.27,
        r = 0.092 * (1 - t * 0.85);
      const u = Math.sin(angle) * r,
        v = t * 0.24 + Math.cos(angle) * r;
      pts.push([
        Math.sin(a) * 0.075 + u * Math.cos(a) + v * Math.sin(a),
        0.605 + v * Math.cos(a) - u * Math.sin(a),
        -0.184 - v * 0.21
      ]);
    }
    fio(g, esmalte, pts, 0.005, 35);
  }
  for (const lado of [-1, 1]) {
    const voluta = [[0, 1.005, -.26], [lado * .113, .96, -.25]];
    for (let i = 0; i <= 36; i++) {
      const a = i / 36 * Math.PI * 2.35, r = .075 * (1 - i / 46);
      voluta.push([lado * (.099 + Math.sin(a) * r), .887 + Math.cos(a) * r, -.235]);
    }
    fio(g, esmalte, voluta, .0055, 40);
  }
}
function terraco(pai, materiais) {
  const g = grupo(pai, 1.71, 0.68, -7.52),
    branco = pbr(0xfbfaf8, 0.38, 0.06);
  const tampo = cilindro(g, materiais.mosaico, 0, 0.746, 0, 0.52, 0.52, 0.034, 72);
  torneado(
    g,
    branco,
    0,
    0.716,
    0,
    [
      [0.505, 0],
      [0.53, 0.008],
      [0.535, 0.028],
      [0.526, 0.042],
      [0.518, 0.042]
    ],
    72
  );
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const pe = grupo(g, 0, 0, 0, a);
    fio(
      pe,
      branco,
      [
        [0.35, 0.016, 0],
        [0.32, 0.065, 0],
        [0.135, 0.29, 0],
        [0.16, 0.54, 0],
        [0.34, 0.714, 0]
      ],
      0.016
    );
    fio(
      pe,
      branco,
      [
        [0.13, 0.3, 0],
        [0.24, 0.39, 0],
        [0.29, 0.47, 0],
        [0.23, 0.52, 0],
        [0.2, 0.47, 0]
      ],
      0.009
    );
  }
  torneado(
    g,
    branco,
    0,
    0.315,
    0,
    [
      [0.19, 0],
      [0.204, 0.011],
      [0.198, 0.023],
      [0.19, 0.019]
    ],
    40
  );
  cadeiraFerro(g, -0.08, -0.85, 0.12, branco);
  cadeiraFerro(g, -0.76, 0.49, -0.98, branco);
  cadeiraFerro(g, 0.61, 0.5, 0.83, branco);
  tampo.receiveShadow = true;
}

export function mobiliar(cena, materiais) {
  const raiz = grupo(cena),
    mesa = grupo(raiz, -.67, 0, -0.28);
  const creme = pbr(0xf4f1e9, 0.34),
    borda = pbr(0x58746a, 0.19, 0.38);
  bloco(mesa, creme, 0, .034, 0, 1.28, .066, .56, .015);
  bloco(mesa, creme, 0, .083, 0, 1.23, .036, .53, .009);
  bloco(mesa, creme, 0, .118, 0, 1.18, .036, .50, .009);
  bloco(mesa, creme, 0, .422, 0, 1.12, .58, .46, .024);
  bloco(mesa, creme, 0, .716, 0, 1.17, .024, .50, .008);
  const vidroMesa = new T.MeshPhysicalMaterial({
    color: 0xc5dfd8,
    metalness: 0.27,
    roughness: 0.075,
    clearcoat: 1,
    envMapIntensity: 1.08,
    transparent: true,
    opacity: 0.25,
    depthWrite: false
  });
  bloco(mesa, vidroMesa, 0, 0.744, 0, 2.73, 0.033, 1.17, 0.012);
  for (const z of [-0.583, 0.583]) bloco(mesa, borda, 0, 0.738, z, 2.69, 0.016, 0.007, 0.002);
  for (const x of [-1.357, 1.357]) bloco(mesa, borda, x, 0.738, 0, 0.008, 0.016, 1.14, 0.002);
  bloco(mesa, materiais.kilim, 0, 0.766, 0, 0.91, 0.009, 0.38, 0.002);
  flores(mesa, 0.015, 0.772, 0);
  for (const x of [-0.79, 0.64]) {
    cadeira(mesa, materiais.tecido, x, -0.81, 0.05);
    cadeira(mesa, materiais.tecido, x, 0.84, Math.PI + 0.03);
  }
  cadeira(mesa, materiais.tecido, -1.62, 0, Math.PI / 2 + 0.045);
  cadeira(mesa, materiais.tecido, 1.62, 0.06, -Math.PI / 2 + 0.08);
  sombraContato(raiz, -.67, 0, -0.28, 4.5, 2.8);
  lareira(raiz);
  const abajur = grupo(raiz, -4.07, 0.84, .67);
  torneado(
    abajur,
    bronze,
    0,
    0,
    0,
    [
      [0, 0],
      [0.132, 0.007],
      [0.135, 0.027],
      [0.067, 0.045],
      [0.055, 0.07],
      [0.068, 0.116],
      [0.05, 0.17],
      [0.022, 0.22],
      [0.019, 0.31],
      [0.04, 0.332]
    ],
    32
  );
  torneado(
    abajur,
    linho,
    0,
    0.324,
    0,
    [
      [0.168, 0],
      [0.172, 0.009],
      [0.104, 0.208],
      [0.101, 0.216],
      [0.095, 0.21],
      [0.16, 0.005]
    ],
    48
  );
  const chamas = [
    [lanterna(raiz, -3.8, 0.84, -4.72, 0.87), vela(raiz, -3.43, 0.84, -4.72)],
    [lanterna(raiz, -4.05, 0.84, -.60, 1.09), vela(raiz, -4.04, 0.84, -.90, 0.035, 0.11)],
    [lanterna(raiz, -0.12, 0.84, -4.7, 1.12), vela(raiz, -0.42, 0.84, -4.7, 0.053, 0.16)],
    [lanterna(raiz, 1.76, 0.84, -4.7, 0.91), vela(raiz, 1.47, 0.84, -4.71)]
  ];
  terraco(raiz, materiais);
  agruparEstaticos(raiz);
  return {
    chamas,
    obstaculos: [
      [-2.56, 1.24, -1.46, 0.94],
      [-4.19, -2.69, -4.65, -3.18],
      [0.74, 2.64, -8.61, -6.64],
      [-4.2, -3.92, -2.94, -2.56],
      [-4.2, -3.92, 1.93, 2.31],
      [5.72, 6, -2.94, -2.56],
      [5.72, 6, 1.93, 2.31]
    ]
  };
}
