"""Monta a vista circular com Pillow, NumPy e OpenCV.

    python3 processo/montar_faixa.py recortar DIRETORIO
    # Detalhe cada ref-N.png no image_gen, salvando como detalhe-N.png.
    python3 processo/montar_faixa.py montar DIRETORIO
"""

import argparse
from io import BytesIO
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


AMBIENTE = Path(__file__).resolve().parents[1] / "assets" / "ambiente"
LARGURA, ALTURA = 6480, 1080
PASSO = LARGURA // 6
MARGEM = PASSO // 8
TRECHO = PASSO + 2 * MARGEM


def referencia():
    with Image.open(AMBIENTE / "vale-panorama.jpg") as foto:
        w, h = foto.size
        # A margem periódica também alimenta o filtro Lanczos no meridiano zero.
        borda = 8
        periodica = Image.fromarray(np.pad(np.asarray(foto.convert("RGB")),
                                           ((0, 0), (borda, borda), (0, 0)), mode="wrap"))
        limites = (borda, h * (90 - 24) / 180, borda + w, h * (90 + 36) / 180)
        return np.asarray(periodica.resize((LARGURA, ALTURA), Image.Resampling.LANCZOS,
                                           box=limites))


def colunas(i):
    return (np.arange(TRECHO) + i * PASSO - MARGEM) % LARGURA


def recortar(pasta):
    pasta.mkdir(parents=True, exist_ok=True)
    base = referencia()
    for i in range(6):
        Image.fromarray(base[:, colunas(i)]).save(pasta / f"ref-{i+1}.png")


def registrar(base, detalhe):
    """Estima o deslocamento base → detalhe na escala das estruturas visíveis."""
    def luminancia(rgb):
        cinza = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
        menor = cv2.resize(cinza, (TRECHO // 2, ALTURA // 2), interpolation=cv2.INTER_AREA)
        return cv2.GaussianBlur(menor, (0, 0), 1.1)

    fluxo = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
    fluxo.setFinestScale(0)
    campo = fluxo.calc(luminancia(base), luminancia(detalhe), None)
    # Suavizar na escala das copas evita que o fluxo deforme folhas individuais.
    campo = cv2.GaussianBlur(np.clip(campo, -32, 32), (0, 0), 12)
    campo = 2 * cv2.resize(campo, (TRECHO, ALTURA))
    y, x = np.indices((ALTURA, TRECHO), dtype=np.float32)
    # Reduz a componente normal perto das bordas para nunca esticar a última linha.
    campo[:, :, 0] *= np.clip(np.minimum(x, TRECHO - 1 - x) / 72, 0, 1)
    campo[:, :, 1] *= np.clip(np.minimum(y, ALTURA - 1 - y) / 72, 0, 1)
    return cv2.remap(detalhe, x + campo[:, :, 0], y + campo[:, :, 1],
                     cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT_101)


def montar(pasta):
    base = referencia()
    saida = np.zeros(base.shape, dtype=np.float32)
    # As duas metades desta janela somam 1, inclusive na volta do último trecho.
    rampa = np.sin(np.pi / 2 * (np.arange(2 * MARGEM) + 0.5) / (2 * MARGEM)) ** 2
    peso = np.ones(TRECHO, dtype=np.float32)
    peso[:2 * MARGEM] = rampa
    peso[-2 * MARGEM:] = rampa[::-1]

    # O disco solar e o halo imediato ficam na posiçêo da fotografia aprovada.
    y, x = np.ogrid[:ALTURA, :LARGURA]
    distancia = np.hypot((x / LARGURA - 0.351) * LARGURA,
                         (y / ALTURA - 0.373) * ALTURA)
    ganho = np.clip((distancia - 65) / 95, 0, 1).astype(np.float32)
    ganho = ganho ** 2 * (3 - 2 * ganho)
    for i in range(6):
        cols = colunas(i)
        trecho = base[:, cols]
        with Image.open(pasta / f"detalhe-{i+1}.png") as foto:
            detalhe = np.asarray(foto.convert("RGB").resize((TRECHO, ALTURA),
                                                            Image.Resampling.LANCZOS))
        alinhado = registrar(trecho, detalhe).astype(np.float32)
        # A referência fornece iluminaçêo e cor locais. O trecho fornece textura.
        diferenca = alinhado - trecho
        textura = diferenca - cv2.GaussianBlur(diferenca, (0, 0), 8)
        corrigido = trecho + textura * ganho[:, cols, None]
        saida[:, cols] += corrigido * peso[None, :, None]

    jpeg = BytesIO()
    Image.fromarray(np.uint8(np.clip(saida.round(), 0, 255))).save(
        jpeg, format="JPEG", quality=85, optimize=True)
    if jpeg.tell() > 3_500_000:
        raise ValueError(f"JPEG excede o limite: {jpeg.tell()} bytes")
    destino = AMBIENTE / "vale-faixa.jpg"
    destino.write_bytes(jpeg.getvalue())
    print(f"{destino.name}: {LARGURA} x {ALTURA}, JPEG Q85, {destino.stat().st_size} bytes")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("acao", choices=["recortar", "montar"])
    parser.add_argument("pasta", type=Path)
    args = parser.parse_args()
    if args.acao == "recortar":
        recortar(args.pasta)
    else:
        montar(args.pasta)
