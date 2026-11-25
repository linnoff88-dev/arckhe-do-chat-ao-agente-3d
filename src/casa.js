import * as T from '../vendor/three/three.module.js';
import { pbr, grupo, malha, bloco, haste, agruparEstaticos, uvMetrico } from './geometria.js';

import { planta } from './planta.js';

export function construirCasa(cena, materiais) {
  const raiz = grupo(cena),
    { pedra, concreto, piso } = materiais,
    madeira = materiais['madeira-forro'];
  const ferragem = pbr(0x252422, 0.45, 0.62);
  const viga = madeira.clone();
  viga.color.set(0x887665);
  const forro = madeira.clone();
  forro.color.set(0xcac4ac);
  forro.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>',
      '#include <map_fragment>\n float fibra = dot(sampledDiffuseColor.rgb, vec3(.213,.715,.072)); diffuseColor.rgb *= mix(.38, 1., smoothstep(.105,.31,fibra));');
  };
  const vidro = new T.MeshPhysicalMaterial({
    color: 0xc4d7db,
    roughness: 0.12,
    metalness: 0.25,
    transparent: true,
    opacity: 0.068,
    depthWrite: false,
    side: T.DoubleSide,
    envMapIntensity: 1.15
  });
  vidro.forceSinglePass = true;
  const parede = (x, y, z, w, h, d, mat = pedra) => bloco(raiz, mat, x, y, z, w, h, d, 0.014);
  const chao = bloco(raiz, piso, .9, -0.09, -.72, 10.48, 0.18, 8.42, 0.006);
  const pisos = [chao];
  // The west and north walls are built around real openings, with deep stone reveals.
  function janela(pai, x, l, yTopo = 2.88) {
    const h = yTopo - 0.84;
    bloco(pai, pedra, x, 0.38, 0, l, 0.76, 0.32);
    bloco(pai, pedra, x, 0.795, 0.035, l + 0.035, 0.09, 0.46);
    for (const px of [x - l / 2 + 0.025, x + l / 2 - 0.025, x])
      bloco(pai, ferragem, px, 0.84 + h / 2, 0, 0.032, h, 0.054, 0.004);
    for (const py of [0.86, yTopo - 0.02]) bloco(pai, ferragem, x, py, 0, l, 0.042, 0.061, 0.004);
    const painel = malha(pai, new T.PlaneGeometry(l - 0.05, h - 0.045), vidro, x, 0.84 + h / 2, 0.003);
    painel.castShadow = false;
    painel.receiveShadow = false;
  }
  const oeste = grupo(raiz, planta.oeste, 0, -.72, Math.PI / 2);
  for (const z of [-2.72, 0, 2.72]) janela(oeste, z, 2.42);
  for (const z of [-4.08, -1.36, 1.36, 4.08]) bloco(oeste, pedra, z, 1.54, 0, 0.3, 3.08, 0.34);
  bloco(oeste, concreto, 0, 3.05, 0, 8.4, 0.34, 0.36);

  const norte = grupo(raiz, 0, 0, -4.8);
  for (const [x, l] of [
    [-2.99, 2.08],
    [-.62, 2.08],
    [1.38, 1.40],
    [5.12, 1.40]
  ])
    janela(norte, x, l);
  for (const [x, w] of [
    [planta.oeste, 0.35],
    [-1.81, 0.29],
    [0.56, 0.29],
    [2.28, 0.40],
    [4.18, 0.48],
    [6, 0.36]
  ])
    bloco(norte, pedra, x, 1.55, 0, w, 3.1, 0.34);
  bloco(norte, pedra, planta.portaX, 3.03, 0, 1.52, 0.24, 0.34);
  bloco(norte, concreto, .9, 3.06, 0, 10.55, 0.35, 0.38);
  parede(.9, 1.55, planta.sul, 10.45, 3.1, 0.32);
  parede(6, 1.57, -.72, 0.32, 3.14, 8.46);
  parede(.9, 3.12, planta.sul, 10.45, 0.16, 0.34, concreto);
  const beiral = 3.16,
    declive = 0.285;
  function oitêo(z) {
    const s = new T.Shape();
    s.moveTo(planta.oeste, beiral);
    s.lineTo(6, beiral);
    s.lineTo(.9, beiral + 5.1 * declive);
    s.closePath();
    const g = new T.ExtrudeGeometry(s, { depth: 0.26, bevelEnabled: false });
    malha(raiz, g, pedra, 0, 0, z - 0.13);
  }
  oitêo(-4.8);
  oitêo(planta.sul);
  const telha = pbr(0x88492f, 0.89);
  for (const lado of [-1, 1]) {
    const ang = -lado * Math.atan(declive);
    const plano = grupo(raiz, .9 + lado * 2.73, beiral + (5.1 - 2.73) * declive, -.72);
    plano.rotation.z = ang;
    const ripas = bloco(plano, forro, 0, 0.055, -0.38, 5.75, 0.115, 10.28, 0.007);
    ripas.geometry = ripas.geometry.clone();
    const uv = ripas.geometry.attributes.uv;
    for (let j = 0; j < uv.count; j++) uv.setXY(j, uv.getY(j), 1.55 * uv.getX(j));
    bloco(plano, telha, 0, 0.15, -0.38, 5.84, 0.09, 10.38);
    for (let i = -5; i <= 4; i++) bloco(plano, viga, 0, -0.145, i * 0.992, 5.77, 0.32, 0.20, .028);
    bloco(plano, viga, lado * 2.85, -0.027, -0.38, 0.105, 0.25, 10.37);
    for (const z of [-5.52, 4.77]) bloco(plano, viga, 0, -0.036, z, 5.86, 0.26, 0.11);
    // Rounded clay channels follow the fall to the eave.
    for (let i = 0; i < 49; i++)
      haste(plano, telha, [-2.89, 0.195, -5.50 + i * 0.211], [2.89, 0.195, -5.50 + i * 0.211], 0.059, 0.065, 8);
    for (let i = 0; i < 15; i++) {
      const x = lado * (-2.89 + i * 0.396);
      haste(plano, telha, [x, 0.194, -5.56], [x + lado * 0.40, 0.194, -5.56], 0.084, 0.065, 12);
    }
  }
  for (const z of [-2.75, 2.12]) {
    parede(.9, 3.06, z, 10.34, 0.31, 0.23, concreto);
    for (const x of [-4.08, 5.88]) parede(x, 1.52, z, 0.24, 3.04, 0.27);
  }

  parede(3.08, .46, -7.25, 5.86, .36, 4.94);
  const soloTerraco = bloco(raiz, piso, 3.08, .66, -7.25, 5.86, .04, 4.94);
  pisos.push(soloTerraco);
  for (const x of [0.18, 5.97]) {
    parede(x, 1.125, -7.26, 0.24, 0.89, 4.98);
    parede(x, 1.6, -7.26, 0.34, 0.1, 5.03);
  }
  parede(3.08, 1.12, -9.7, 5.92, 0.88, 0.28);
  parede(3.08, 1.6, -9.7, 6.03, 0.1, 0.38);
  // A continuous woven runner drapes over the near and far faces of the parapet.
  const tecido = new T.PlaneGeometry(2.46, 1, 64, 35),
    p = tecido.attributes.position;
  const perfil = [
    [0.27, 1.09],
    [0.25, 1.49],
    [0.18, 1.64],
    [0.14, 1.67],
    [-0.14, 1.67],
    [-0.18, 1.64],
    [-0.23, 1.47],
    [-0.25, 1.24]
  ];
  for (let i = 0; i < p.count; i++) {
    const u = tecido.attributes.uv.getX(i),
      t = tecido.attributes.uv.getY(i) * (perfil.length - 1);
    const a = perfil[Math.floor(t)],
      b = perfil[Math.min(Math.ceil(t), perfil.length - 1)],
      f = t % 1;
    const queda = Math.min(1, Math.abs(t - 3.5) / 2.5);
    const dobra = Math.sin(u * 35 + .7 * Math.sin(u * 11));
    p.setXYZ(
      i,
      (u - 0.5) * 2.46,
      T.MathUtils.lerp(a[1], b[1], f) + Math.sin(u * 14) * 0.010 + dobra * queda * 0.014,
      -9.68 + T.MathUtils.lerp(a[0], b[0], f) + dobra * (0.011 + 0.032 * queda) * (t < 3.5 ? 1 : -1)
    );
  }
  tecido.computeVertexNormals();
  malha(raiz, tecido, materiais.kilim, 2.35, 0, 0);
  // Keep picking surfaces independent from the material batches.
  for (const m of pisos) m.userData.dinamico = true;
  raiz.updateWorldMatrix(true, true);
  raiz.traverse((m) => {
    // Adjacent walls and piers share the same courses, even across the rotated west wall.
    if (m.isMesh && m.material === pedra) {
      m.geometry.computeBoundingBox();
      const tamanho = m.geometry.boundingBox.getSize(new T.Vector3());
      const pilar = tamanho.y > 3 && Math.max(tamanho.x, tamanho.z) < .5;
      m.geometry = uvMetrico(m.geometry.clone(), m.matrixWorld, pilar);
    }
  });
  agruparEstaticos(raiz);
  const bosque = grupo(cena);
  const silhueta = new T.PlaneGeometry(2 / 3, 1);
  const arvores = [
    [-10.4, -5.9, -12.7, 8.5, 0], [7.9, -5.8, -16.8, 9.5, 1],
    [-10.8, -6.2, 2.1, 8.6, 2], [2.2, -6.5, -15.3, 8.8, 2],
    [-16.2, -8.9, -4.3, 12.2, 1], [-2.35, -5.85, -12.55, 7.95, 0]
  ].map(([x, base, z, h, especie]) => {
    const m = malha(bosque, silhueta, materiais.arvores[especie], x, base + h / 2, z);
    m.scale.setScalar(h);
    m.castShadow = m.receiveShadow = false;
    return m;
  });
  return {
    raiz, pisos, vidro,
    orientarArvores(camera) {
      for (const m of arvores) m.rotation.y = Math.atan2(camera.x - m.position.x, camera.z - m.position.z);
    }
  };
}
