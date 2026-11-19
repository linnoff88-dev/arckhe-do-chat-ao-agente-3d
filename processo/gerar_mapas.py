"""Prepara os JPEGs a partir dos PNGs aprovados do image_gen.

Execute python3 processo/gerar_mapas.py com PASTA_CODEX definido ou passe
--originais DIR com os oito PNGs nomeados como os materiais (ou como no cache).
"""
import argparse
import os
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


SESSAO = "01a1edc5-ba03-7442-8a08-4d97e1dc24b8"
ORIGINAIS = {
    "vale-panorama": "exec-2248509b-8617-44f2-af74-01c99e44b116.png",
    "pedra": "exec-47d0520f-6ef5-4372-948c-7e0cd9d89699.png",
    "madeira-forro": "exec-184ba793-da9b-480b-8291-5808b0d241a0.png",
    "piso": "exec-982d6b65-582b-4933-9cf0-e9690954e9ad.png",
    "kilim": "exec-1b954dc4-a56f-4bb4-91e7-fdd4ba025bf7.png",
    "mosaico": "exec-9770c89e-875c-4a4d-9d21-460dfa7befd9.png",
    "concreto": "exec-bd26e88a-bec0-47c3-ab28-58ad204c109b.png",
    "tecido-taupe": "exec-da013021-8162-4f7f-8fd5-9c44c679eab5.png",
}

# (relevo por texel, rugosidade de base, variação de rugosidade)
MATERIAIS = {
    "pedra": (4.0, 0.84, 0.30),
    "madeira-forro": (1.9, 0.55, 0.27),
    "piso": (1.4, 0.36, 0.40),
    "concreto": (2.5, 0.87, 0.24),
}
# Recortes no PNG original de 1254 px. O lambri fecha no sulco.
# O kilim contém três medalhões por duas repetições verticais.
RECORTES = {"madeira-forro": (0, 39, 1254, 1251), "kilim": (366, 306, 1244, 1142)}


def suavizar(t):
    return t * t * (3 - 2 * t)


def costurar(rgb, eixo, largura):
    """Leva as duas margens ao mesmo valor, com peso zero no interior."""
    linhas = np.moveaxis(rgb, eixo, 0)
    inicio = linhas[:largura].copy()
    fim = linhas[-largura:][::-1].copy()
    peso = 0.5 * suavizar(np.linspace(1, 0, largura, dtype=np.float32))[:, None, None]
    ajuste = peso * (fim - inicio)
    linhas[:largura] = inicio + ajuste
    linhas[-largura:] = (fim - ajuste)[::-1]


def imagem(valores):
    return Image.fromarray(np.rint(np.clip(valores, 0, 255)).astype(np.uint8))


def panorama(original):
    largura, altura = original.size
    # A linha média das cristas foi medida a y=409 no original de 887 px.
    # Reamostra céu e vale até a linha do equador, mantendo zênite e nadir.
    horizonte = round(altura * 409 / 887)
    altura = largura // 2
    meio = altura // 2
    borda = original.height
    saida = Image.new("RGB", (2 * altura, altura))
    for topo, base, y, h in [(0, horizonte, 0, meio), (horizonte, borda, meio, altura - meio)]:
        faixa = original.crop((0, topo, largura, base))
        saida.paste(faixa.resize((saida.width, h), Image.Resampling.LANCZOS), (0, y))
    rgb = np.array(saida, dtype=np.float32)
    costurar(rgb, 1, max(8, largura // 60))
    # Todos os meridianos convergem nos polos. A média só atua nos 2° finais.
    faixa_polar = max(2, altura // 90)
    peso = suavizar(np.linspace(1, 0, faixa_polar, dtype=np.float32))[:, None, None]
    for polo in (rgb[:faixa_polar], rgb[-faixa_polar:][::-1]):
        polo += (polo.mean(axis=1, keepdims=True) - polo) * peso
    return imagem(rgb)


def albedo(nome, base):
    # Preserve the photographic grain while separating pigment from the baked warm cast.
    tons = {"madeira-forro": (206, 154, 89),
            "piso": (99, 76, 62), "concreto": (151, 152, 150),
            "tecido-taupe": (193, 177, 159)}
    if nome not in tons:
        return base
    rgb = np.asarray(base, dtype=np.float32)
    rgb /= 255
    lum = rgb @ np.array([.3, .59, .11], dtype=np.float32)
    valor = (lum / lum.mean()) ** .85
    cor = np.asarray(tons[nome]) * valor[:, :, None]
    cor += 36 * (rgb - rgb.mean(axis=(0, 1)) * (lum / lum.mean())[:, :, None])
    return imagem(cor)


def textura(nome, original):
    if nome in RECORTES:
        original = original.crop(RECORTES[nome])
    rgb = np.array(original.resize((1024, 1024), Image.Resampling.LANCZOS), dtype=np.float32)
    # Bordas dos ladrilhos caem no rejunte. Uma faixa larga duplicaria suas cores.
    faixas = {"piso": (2, 2), "mosaico": (2, 2), "pedra": (9, 30),
              "madeira-forro": (2, 20), "kilim": (6, 10)}
    vertical, horizontal = faixas.get(nome, (14, 14))
    costurar(rgb, 0, vertical)
    costurar(rgb, 1, horizontal)
    return albedo(nome, imagem(rgb))


def desfoque_periodico(canal, raio):
    margem = int(np.ceil(4 * raio))
    borda = np.pad(canal, margem, mode="wrap")
    filtrada = Image.fromarray(borda).filter(ImageFilter.GaussianBlur(raio))
    return np.asarray(filtrada, dtype=np.float32)[margem:-margem, margem:-margem] / 255


def mapas(base, nome):
    forca, rugosidade, variacao = MATERIAIS[nome]
    cinza = np.asarray(base.convert("L"))
    altura = desfoque_periodico(cinza, 0.75)
    if nome == "pedra":
        # A argamassa cinza tem menos croma que o arenito e sobressai nas juntas.
        rgb = np.asarray(base, dtype=np.float32) / 255
        altura += .12 * np.clip((.18 - (rgb[:, :, 0] - rgb[:, :, 2])) / .13, 0, 1)
    # Derivadas centrais periódicas. +Y tangente aponta para cima em OpenGL.
    dx = (np.roll(altura, -1, 1) - np.roll(altura, 1, 1)) * forca
    dy = (np.roll(altura, -1, 0) - np.roll(altura, 1, 0)) * forca
    normais = np.stack((-dx, dy, np.ones_like(dx)), axis=-1)
    normais /= np.linalg.norm(normais, axis=-1, keepdims=True)
    detalhe = cinza.astype(np.float32) / 255 - desfoque_periodico(cinza, 7)
    rugosa = rugosidade + variacao * (altura.mean() - altura - detalhe)
    if nome == "piso":
        # O rejunte escuro e poroso tem rugosidade maior que a cerâmica.
        rugosa += 0.32 * np.clip((0.245 - altura) / 0.08, 0, 1)
    return imagem((normais + 1) * 127.5), imagem(rugosa * 255)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    cache = Path(os.environ.get("PASTA_CODEX", Path.home() / ".codex")) / "generated_images"
    parser.add_argument("--originais", type=Path)
    parser.add_argument("--destino", type=Path, default=Path(__file__).resolve().parents[1] / "assets/ambiente")
    parser.add_argument("--material", choices=ORIGINAIS, help="Gerar somente este material")
    args = parser.parse_args()
    args.destino.mkdir(exist_ok=True, parents=True)
    for nome, arquivo in ORIGINAIS.items():
        if args.material and nome != args.material:
            continue
        sessao = "01a1ee71-2dfa-7c90-a723-6d9becce54e1" if nome == "pedra" else SESSAO
        pasta = args.originais or cache / sessao
        origem = pasta / (nome + ".png")
        if not origem.is_file():
            origem = pasta / arquivo
        with Image.open(origem) as png:
            original = png.convert("RGB")
        base = panorama(original) if nome == "vale-panorama" else textura(nome, original)
        imagens = {nome: base}
        if nome in MATERIAIS:
            normal, rugosa = mapas(base, nome)
            imagens[nome + "-normal"] = normal
            imagens[nome + "-rugosidade"] = rugosa
        for chave, img in imagens.items():
            caminho = args.destino / (chave + ".jpg")
            img.save(caminho, quality=88, subsampling=0, optimize=True)
            print(f"{caminho.name:30} {img.width} x {img.height}  {caminho.stat().st_size:8} bytes")


if __name__ == "__main__":
    main()
