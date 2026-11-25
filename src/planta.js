// Metros no plano do piso. A parede norte e a passagem para o terraço sêo fixas.
export const planta = {
  oeste: -4.2, leste: 6, norte: -4.8, sul: 3.36,
  portaX: 3.2, larguraPorta: 1.48, patamar: 0.68
};
export const chegada = { x: 1.34, z: 1.43, olhar: [-1.48, 1.40, -3.76] };
export const vistaPorta = { x: 2.82, z: -0.94, olhar: [3.2, 1.51, -4.65] };
export const mirante = { x: 5.35, z: -7.85, olhar: [1.43, 1.66, -9.33] };

export const posicoes = [
  { x: -3.04, z: 2.62, visita: [-1.9, 1.35], olhar: [-2.94, 1.01, 2.755] },
  { x: -3.31, z: -1.68, visita: [-.95, -2], olhar: [-3.23, .997, -2.10] },
  { x: 1.58, z: 3.14, visita: [1.65, .20], olhar: [1.58, 1.64, 3.04] },
  { x: 5.41, z: -.62, visita: [3.62, -.57], olhar: [5.43, 1.38, -.62] }
];
