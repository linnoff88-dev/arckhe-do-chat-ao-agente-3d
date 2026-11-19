import * as T from '../vendor/three/three.module.js';

const pasta = new URL('../assets/ambiente/', import.meta.url);
const familias = { pedra: [2.4, 2.4], 'madeira-forro': [3.8, 2.85], piso: [2.25, 2.25], concreto: [2.4, 2.4] };
const especies = ['araucaria-adulta', 'araucaria-jovem', 'pinheiro'];

// Soft rectangular window reflections on polished clay. The reflected ray meets
// the same sill, lintel and mullions as the mesh, including when the eye moves.
function acabamentoPiso(shader) {
  shader.uniforms.reflexoDetalhado = this.userData.reflexo;
  shader.vertexShader = 'varying vec3 pisoMundo;\n' + shader.vertexShader.replace(
    '#include <worldpos_vertex>', '#include <worldpos_vertex>\n pisoMundo = (modelMatrix * vec4(transformed, 1.)).xyz;'
  );
  shader.fragmentShader = `varying vec3 pisoMundo;
    uniform float reflexoDetalhado;
    float vidroRefletido(float x, float centro, float largura) {
      float d = abs(x - centro);
      return (1. - smoothstep(largura * .5 - .08, largura * .5 + .08, d)) * (.42 + .58 * smoothstep(0., .09, d));
    }
  ` + shader.fragmentShader.replace('#include <opaque_fragment>', `
    if (pisoMundo.y < .01 && pisoMundo.y > -.01) {
      vec2 p = pisoMundo.xz;
      float borda = min(5.1 - abs(p.x - .9), 4.08 - abs(p.y + .72));
      outgoingLight *= mix(.65, 1., smoothstep(.13, .43, borda));
      vec3 r = reflect(normalize(pisoMundo - cameraPosition), vec3(0., 1., 0.));
      vec2 direcao = mix(vec2(-1.), vec2(1.), step(vec2(0.), r.xz));
      vec2 paredes = (vec2(5.1,4.08) - direcao * (p - vec2(.9,-.72))) / max(abs(r.xz), vec2(.00001));
      bool oeste = paredes.x < paredes.y;
      vec3 encontro = pisoMundo + max(0., min(paredes.x, paredes.y)) * r;
      float vidro = 0.;
      float paredeComVidro = float(oeste ? r.x < 0. : r.z < 0.);
      if (reflexoDetalhado > .001 && oeste && r.x < 0.) {
        vidro = vidroRefletido(encontro.z, -3.44, 2.42) + vidroRefletido(encontro.z, -.72, 2.42) + vidroRefletido(encontro.z, 2., 2.42);
      } else if (reflexoDetalhado > .001 && !oeste && r.z < 0.) {
        vidro = vidroRefletido(encontro.x,-2.99,2.08) + vidroRefletido(encontro.x,-.62,2.08)
              + vidroRefletido(encontro.x,1.38,1.40) + vidroRefletido(encontro.x,5.12,1.40);
      }
      vidro = mix(.26 * paredeComVidro, vidro, reflexoDetalhado);
      float faixa = smoothstep(.72, .98, encontro.y) * (1. - smoothstep(2.76, 3., encontro.y));
      vec3 janela = mix(vec3(.13,.16,.11), vec3(.23,.24,.24), smoothstep(1.45,2.46,encontro.y));
      outgoingLight += janela * vidro * faixa * (1. - roughnessFactor) * pow(1. - clamp(r.y, 0., 1.), 2.);
    }
    #include <opaque_fragment>`);
}
export async function carregarAmbiente(progresso, renderer) {
  const nomes = Object.keys(familias)
    .flatMap((k) => [k, k + '-normal', k + '-rugosidade'])
    .concat(['tecido-taupe', 'mosaico', 'kilim', 'vale-panorama'], especies);
  const mapas = {},
    carregador = new T.TextureLoader();
  let prontos = 0;
  progresso(0, nomes.length + 1);
  await Promise.all(
    nomes.map(async (nome) => {
      const t = await carregador.loadAsync(new URL(nome + (especies.includes(nome) ? '.webp' : '.jpg'), pasta).href);
      if (!nome.endsWith('-normal') && !nome.endsWith('-rugosidade')) t.colorSpace = T.SRGBColorSpace;
      t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      if (!especies.includes(nome)) t.wrapS = T.RepeatWrapping;
      if (nome !== 'vale-panorama' && !especies.includes(nome)) t.wrapT = T.RepeatWrapping;
      mapas[nome] = t;
      progresso(++prontos, nomes.length + 1);
    })
  );
  const materiais = {};
  for (const [nome, metros] of Object.entries(familias)) {
    const [map, normalMap, roughnessMap] = [nome, nome + '-normal', nome + '-rugosidade'].map((k) => mapas[k]);
    for (const t of [map, normalMap, roughnessMap]) t.repeat.set(1 / metros[0], 1 / metros[1]);
    materiais[nome] = new T.MeshStandardMaterial({
      map,
      normalMap,
      roughnessMap,
      color: 0xffffff,
      roughness: nome === 'piso' ? 0.96 : 0.91,
      metalness: nome === 'piso' ? 0.055 : 0.015,
      normalScale: new T.Vector2(0.55, 0.55)
    });
  }
  materiais.pedra.normalScale.setScalar(.8);
  materiais.pedra.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
      #include <map_fragment>
      float luminancia = dot(diffuseColor.rgb, vec3(.2126, .7152, .0722));
      diffuseColor.rgb = mix(vec3(luminancia), diffuseColor.rgb, .52) * vec3(.96, 1., 1.04);`);
  };
  const trama = mapas['tecido-taupe'];
  trama.repeat.setScalar(.85);
  materiais.tecido = new T.MeshStandardMaterial({
    map: trama, color: 0xb19e92, roughness: .94, bumpMap: trama, bumpScale: .00016
  });
  materiais.tecido.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>',
      '#include <map_fragment>\n diffuseColor.rgb = mix(diffuse * vec3(.53,.44,.35), diffuseColor.rgb, .20);');
  };
  materiais.piso.color.set(0xffebc7);
  materiais.piso.userData.reflexo = { value: 1 };
  materiais.piso.onBeforeCompile = acabamentoPiso;
  materiais.arvores = especies.map((nome) => new T.MeshBasicMaterial({
    map: mapas[nome], alphaTest: 0.34, side: T.DoubleSide, alphaToCoverage: true, color: 0xe8ecd9
  }));
  materiais.mosaico = new T.MeshStandardMaterial({ map: mapas.mosaico, roughness: 0.34 });
  materiais.kilim = new T.MeshStandardMaterial({ map: mapas.kilim, roughness: 0.94, side: T.DoubleSide });
  return { materiais, panorama: mapas['vale-panorama'], terminar: () => progresso(++prontos, nomes.length + 1) };
}

export function criarLuz(cena, renderer, panorama, economico, arvores) {
  const sky = new T.Group();
  cena.add(sky);
  // Equirectangular convention shared by PMREM and the distant cylinder.
  const yaw = 1.02, raio = 82;
  const longitude = (0.35 - 0.5) * 2 * Math.PI;
  const horizonte = new T.Vector3(Math.cos(longitude), 0, Math.sin(longitude))
    .applyAxisAngle(new T.Vector3(0, 1, 0), yaw);
  const eixo = new T.Vector3().crossVectors(horizonte, new T.Vector3(0, 1, 0)).normalize();
  const rotacao = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), yaw);
  const entardecer = { value: 0 };
  function materialPaisagem(map, faixa) {
    const m = new T.MeshBasicMaterial({ map, side: T.DoubleSide, transparent: faixa, depthWrite: false, toneMapped: false });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.entardecer = entardecer;
      shader.fragmentShader = 'uniform float entardecer;\n' + shader.fragmentShader.replace('#include <map_fragment>', `
        #include <map_fragment>
        vec3 rgb = diffuseColor.rgb;
        float lum = dot(rgb, vec3(.2126, .7152, .0722));
        float croma = mix(.85, .56, smoothstep(.20, .62, lum));
        vec3 dia = pow(mix(vec3(lum), rgb, croma), vec3(.96)) * vec3(.89, 1.06, 1.19);
        vec3 tarde = pow(rgb, vec3(1.08)) * vec3(1.04, .94, .79);
        diffuseColor.rgb = mix(dia, tarde, entardecer);
        ${faixa ? 'diffuseColor.a *= smoothstep(0.,.065,vMapUv.y)*smoothstep(0.,.065,1.-vMapUv.y);' : ''}
      `);
    };
    m.customProgramCacheKey = () => 'paisagem-' + faixa;
    return m;
  }
  // The original panorama covers 360 × 180 degrees. Elevate its optical horizon
  // around the whole room. The detail strip below uses exactly the same sightlines.
  const alturaHorizonte = 1.62 + raio * Math.tan(T.MathUtils.degToRad(8));
  const globo = new T.SphereGeometry(1, 96, 64);
  const posCeu = globo.attributes.position, uvCeu = globo.attributes.uv;
  for (let j = 0; j < posCeu.count; j++) {
    const lon = (uvCeu.getX(j) - .5) * 2 * Math.PI, lat = (uvCeu.getY(j) - .5) * Math.PI;
    const r = raio * 1.45;
    // Shift the horizon by the same apparent angle as the cylinder at every latitude.
    posCeu.setXYZ(j, r * Math.cos(lat) * Math.cos(lon),
      1.62 + r * (Math.sin(lat) + (alturaHorizonte - 1.62) / raio * Math.cos(lat)), r * Math.cos(lat) * Math.sin(lon));
  }
  const mapaCeu = panorama.clone();
  mapaCeu.needsUpdate = true;
  const ceu = new T.Mesh(globo, materialPaisagem(mapaCeu, false));
  ceu.renderOrder = -20;
  sky.add(ceu);
  panorama.mapping = T.EquirectangularReflectionMapping;
  const pmrem = new T.PMREMGenerator(renderer);
  const ambiente = pmrem.fromEquirectangular(panorama);
  pmrem.dispose();
  cena.environment = ambiente.texture;
  cena.background = panorama;

  let cancelado = false,
    tentativa,
    atraso = 30000;

  // Each tile includes a pixel of its neighbours so interpolation stays continuous.
  async function faixa() {
    try {
      const r = await fetch(new URL('vale-faixa.jpg', pasta), { cache: 'no-cache' });
      if (!r.ok) throw new Error('Faixa indisponível');
      const img = await createImageBitmap(await r.blob());
      if (cancelado) {
        img.close();
        return;
      }
      const tiles = Math.ceil(img.width / 1900);
      for (let i = 0; i < tiles; i++) {
        const inicio = Math.floor((img.width * i) / tiles),
          fim = Math.floor((img.width * (i + 1)) / tiles);
        const largura = fim - inicio,
          borda = 2;
        const c = document.createElement('canvas');
        c.width = largura + 2 * borda;
        c.height = Math.min(2048, img.height);
        const ctx = c.getContext('2d');
        ctx.drawImage(img, inicio, 0, largura, img.height, borda, 0, largura, c.height);
        ctx.drawImage(img, (inicio - borda + img.width) % img.width, 0, borda, img.height, 0, 0, borda, c.height);
        ctx.drawImage(img, fim % img.width, 0, borda, img.height, largura + borda, 0, borda, c.height);
        const t = new T.CanvasTexture(c);
        t.colorSpace = T.SRGBColorSpace;
        const material = materialPaisagem(t, true);
        const geo = new T.PlaneGeometry(1, 1, 32, 12),
          { position, uv } = geo.attributes;
        for (let j = 0; j < position.count; j++) {
          const u = uv.getX(j),
            v = uv.getY(j),
            theta = ((inicio + largura * u) / img.width - 0.5) * Math.PI * 2;
          position.setXYZ(
            j,
            raio * Math.cos(theta),
            alturaHorizonte + raio * Math.tan(T.MathUtils.degToRad(-36 + 60 * v)),
            raio * Math.sin(theta)
          );
          uv.setX(j, (borda + u * largura) / c.width);
        }
        const tile = new T.Mesh(geo, material);
        tile.renderOrder = -10;
        sky.add(tile);
      }
      img.close();
    } catch {
      if (!cancelado) {
        tentativa = setTimeout(faixa, atraso);
        atraso = Math.min(240000, atraso * 2);
      }
    }
  }
  faixa();

  const hemi = new T.HemisphereLight(0xf0f5ff, 0xe3c9a6, 1.7);
  const sol = new T.DirectionalLight(0xffdfad, 3.1);
  sol.castShadow = true;
  sol.shadow.mapSize.setScalar(economico ? 1024 : 2048);
  Object.assign(sol.shadow.camera, { left: -11, right: 11, top: 9, bottom: -9, near: 0.5, far: 46 });
  sol.shadow.normalBias = 0.009;
  sol.shadow.bias = -0.00022;
  sol.shadow.camera.updateProjectionMatrix();
  const rebote = new T.DirectionalLight(0xffecd3, .65);
  rebote.position.set(-3, -5, -2);
  cena.add(hemi, sol, sol.target, rebote);
  const poeiraGeo = new T.BufferGeometry(),
    pos = [];
  for (let i = 0; i < 85; i++) {
    const f = (k) => (Math.sin((i + 1) * k) * 43758.54) % 1;
    pos.push(-2 + f(53) * 2.8, 1.55 + f(31) * 1.15, -1.8 + f(15) * 2.4);
  }
  poeiraGeo.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  const poeira = new T.Points(
    poeiraGeo,
    new T.PointsMaterial({ color: 0xffdb9c, size: 0.009, transparent: true, opacity: 0.33, depthWrite: false })
  );
  cena.add(poeira);
  const folhasDia = new T.Color(0xe8ecd9), folhasTarde = new T.Color(0xbda57c);
  let nivel = 0,
    alvo = 0;
  function atualizar(dt, reduzido, tempo) {
    const proximo = reduzido ? alvo : T.MathUtils.damp(nivel, alvo, 2.5, dt);
    if (Math.abs(nivel - proximo) > 0.00001 || dt === 0) {
      nivel = proximo;
      const fracao = nivel / 4,
        inclinacao = (1 - fracao) * 0.045;
      sky.quaternion.setFromAxisAngle(eixo, inclinacao).multiply(rotacao);
      // Three uses the negated Euler components for the environment sampling matrix.
      const inv = new T.Euler().setFromQuaternion(sky.quaternion.clone().invert());
      cena.backgroundRotation.set(-inv.x, -inv.y, -inv.z);
      cena.environmentRotation.copy(cena.backgroundRotation);
      sol.position.copy(horizonte).multiplyScalar(21);
      sol.position.y = 21 * Math.tan(0.16 + inclinacao * 2);
      sol.color.set(0xfff1dc).lerp(new T.Color(0xffac72), fracao);
      sol.intensity = 3.1 - 0.8 * fracao;
      hemi.intensity = 1.72 - 0.57 * fracao;
      cena.environmentIntensity = (economico ? 0.46 : 0.68) - 0.13 * fracao;
      cena.backgroundIntensity = 0.98 - 0.16 * fracao;
      entardecer.value = fracao;
      for (const m of arvores) m.color.lerpColors(folhasDia, folhasTarde, fracao);
      rebote.intensity = .68 - .26 * fracao;
      renderer.shadowMap.needsUpdate = true;
    }
    poeira.visible = !economico;
    if (!reduzido && !economico) poeira.position.y = Math.sin(tempo * 0.14) * 0.08;
  }
  atualizar(0, true, 0);
  return {
    atualizar,
    reduzirSombra() {
      const tamanho = economico ? 512 : 1024;
      sol.shadow.mapSize.setScalar(tamanho);
      sol.shadow.map?.setSize(tamanho, tamanho);
      renderer.shadowMap.needsUpdate = true;
    },
    definir(n, imediato = false) {
      alvo = n;
      if (imediato) atualizar(0, true, 0);
    },
    dispor() {
      cancelado = true;
      clearTimeout(tentativa);
      ambiente.dispose();
    }
  };
}
