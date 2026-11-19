import * as T from '../vendor/three/three.module.js';

export const pbr = (color, roughness = 0.64, metalness = 0) =>
  new T.MeshStandardMaterial({ color, roughness, metalness });
export function grupo(pai, x = 0, y = 0, z = 0, giro = 0) {
  const g = new T.Group();
  g.position.set(x, y, z);
  g.rotation.y = giro;
  pai.add(g);
  return g;
}
export function malha(pai, geometria, material, x = 0, y = 0, z = 0) {
  const obj = new T.Mesh(geometria, material);
  obj.position.set(x, y, z);
  obj.castShadow = !material.transparent;
  obj.receiveShadow = true;
  pai.add(obj);
  return obj;
}

// Coordinates on each broad face are in metres, including the end grain and reveals.
export function uvMetrico(g, matriz, pilar = false) {
  const { position: p, normal: n, uv } = g.attributes;
  const ponto = new T.Vector3(), normal = new T.Vector3();
  const rotacao = matriz && new T.Matrix3().getNormalMatrix(matriz);
  for (let i = 0; i < p.count; i++) {
    ponto.fromBufferAttribute(p, i);
    normal.fromBufferAttribute(n, i);
    if (matriz) {
      ponto.applyMatrix4(matriz);
      normal.applyNormalMatrix(rotacao);
    }
    const ax = Math.abs(normal.x), ay = Math.abs(normal.y), az = Math.abs(normal.z);
    if (ay >= ax && ay >= az) uv.setXY(i, ponto.x, -ponto.z);
    else if (pilar) uv.setXY(i, ponto.x + ponto.z, ponto.y);
    else uv.setXY(i, ax > az ? ponto.z : ponto.x, ponto.y);
  }
  return g;
}
const formas = new Map();
export function bloco(pai, mat, x, y, z, w, h, d, raio = 0.012) {
  const r = Math.min(raio, w * 0.22, h * 0.22, d * 0.22);
  const key = [w, h, d, r].join('/');
  if (!formas.has(key)) {
    let g;
    if (r === 0) g = new T.BoxGeometry(w, h, d);
    else {
      // Inset the profile so that the bevel ends exactly at the specified dimensions.
      const a = w / 2 - r,
        b = h / 2 - r,
        s = new T.Shape();
      s.moveTo(-a, -b);
      s.lineTo(a, -b);
      s.lineTo(a, b);
      s.lineTo(-a, b);
      s.closePath();
      g = new T.ExtrudeGeometry(s, {
        depth: d - 2 * r,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: r,
        bevelThickness: r,
        steps: 1
      });
      g.translate(0, 0, -d / 2 + r);
    }
    formas.set(key, uvMetrico(g));
  }
  return malha(pai, formas.get(key), mat, x, y, z);
}
export function cilindro(pai, mat, x, y, z, topo, base, h, lados = 24) {
  return malha(pai, new T.CylinderGeometry(topo, base, h, lados), mat, x, y, z);
}
const bola = new T.SphereGeometry(1, 16, 12);
export function oval(pai, mat, x, y, z, rx, ry, rz) {
  const m = malha(pai, bola, mat, x, y, z);
  m.scale.set(rx, ry, rz);
  return m;
}
export function haste(pai, mat, a, b, raio, base = raio, lados = 8) {
  const v = new T.Vector3(...a),
    delta = new T.Vector3(...b).sub(v);
  const meio = v.addScaledVector(delta, 0.5);
  const m = cilindro(pai, mat, meio.x, meio.y, meio.z, raio, base, delta.length(), lados);
  m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize());
  return m;
}
export function torneado(pai, mat, x, y, z, perfil, lados = 32) {
  return malha(
    pai,
    new T.LatheGeometry(
      perfil.map(([r, h]) => new T.Vector2(r, h)),
      lados
    ),
    mat,
    x,
    y,
    z
  );
}
export function fio(pai, mat, pontos, raio = 0.009, passos = 24) {
  const caminho = new T.CatmullRomCurve3(pontos.map((p) => new T.Vector3(...p)));
  return malha(pai, new T.TubeGeometry(caminho, passos, raio, 6, false), mat);
}

// Bake static meshes per material. Movable doors, screens and flames live in separate groups.
export function agruparEstaticos(raiz) {
  raiz.updateWorldMatrix(true, true);
  const inversa = raiz.matrixWorld.clone().invert(),
    lotes = new Map();
  raiz.traverse((m) => {
    if (!m.isMesh || m.material.transparent || m.userData.dinamico) return;
    if (!lotes.has(m.material)) lotes.set(m.material, []);
    lotes.get(m.material).push(m);
  });
  for (const [mat, lista] of lotes) {
    if (lista.length < 2) continue;
    const partes = lista.map((obj) => {
      const g = obj.geometry.index ? obj.geometry.toNonIndexed() : obj.geometry.clone();
      g.applyMatrix4(new T.Matrix4().multiplyMatrices(inversa, obj.matrixWorld));
      obj.removeFromParent();
      return g;
    });
    const g = new T.BufferGeometry();
    for (const nome of ['position', 'normal', 'uv']) {
      const attrs = partes.map((p) => p.attributes[nome]);
      if (!attrs.every(Boolean)) continue;
      const dados = new Float32Array(attrs.reduce((s, a) => s + a.array.length, 0));
      let offset = 0;
      for (const a of attrs) {
        dados.set(a.array, offset);
        offset += a.array.length;
      }
      g.setAttribute(nome, new T.BufferAttribute(dados, attrs[0].itemSize));
    }
    malha(raiz, g, mat);
  }
}

export function sombraContato(pai, x, y, z, largura, profundidade) {
  const material = new T.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {},
    vertexShader:
      'varying vec2 v; void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:
      'varying vec2 v; void main(){float d=length(v*2.-1.);gl_FragColor=vec4(.04,.022,.011,.28*(1.-smoothstep(.1,1.,d)));}'
  });
  const s = malha(pai, new T.PlaneGeometry(largura, profundidade), material, x, y + 0.003, z);
  s.rotation.x = -Math.PI / 2;
  s.renderOrder = 1;
}
