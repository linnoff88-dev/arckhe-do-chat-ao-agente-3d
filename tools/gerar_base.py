#!/usr/bin/env python3
"""Gera conteudo/base.json direto de fonte/, sem modelo: cards da página, aulas, exercícios e vídeos.

A pasta fonte/ nêo faz parte do repositório público. A base já vem pronta em conteudo/base.json;
este script fica como registro de como ela foi gerada. ORIGEM_PAGINA completa os links internos da página."""
import html
import json
import os
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
FONTE = RAIZ / "fonte"
ORIGEM_PAGINA = os.environ.get("ORIGEM_PAGINA", "")
if not (FONTE / "do-chat-ao-agente.html").exists():
    sys.exit("fonte/ nêo está neste repositório. Use a base pronta em conteudo/base.json.")
PAGINA = (FONTE / "do-chat-ao-agente.html").read_text(encoding="utf-8")
SEQ = [
    (1, "terminal", "01-oswork.md", "seq1-oswork"),
    (2, "jarvis", "02-jarvis.md", "seq2-jarvis"),
    (3, "filas", "03-filas.md", "seq3-filas"),
    (4, "redes", "04-redes.md", "seq4-redes"),
]


def plano(x):
    return " ".join(html.unescape(re.sub(r"<[^>]+>", " ", x)).split())


def cards(trecho):
    saida = []
    for attrs, corpo in re.findall(r'(?is)<a\b([^>]*class="[^"]*card[^"]*"[^>]*)>(.*?)</a>', trecho):
        href = re.search(r'href="([^"]+)"', attrs).group(1)
        if href.startswith("/"):
            href = ORIGEM_PAGINA + href
        tag = re.search(r'(?is)<span class="tag">(.*?)</span>', corpo)
        h3 = re.search(r"(?is)<h3>(.*?)</h3>", corpo)
        p = re.search(r"(?is)<p>(.*?)</p>", corpo)
        saida.append({"tag": plano(tag.group(1)) if tag else "", "titulo": plano(h3.group(1)) if h3 else "",
                      "detalhe": plano(p.group(1)) if p else "", "url": href})
    return saida


def secao(id_, proximo):
    i = PAGINA.index(f'id="{id_}"')
    j = PAGINA.index(f'id="{proximo}"', i)
    return PAGINA[i:j]


def aulas(nome):
    pasta = FONTE / "cursos" / nome
    c = json.loads((pasta / "curso.json").read_text(encoding="utf-8"))
    base = c["url"].rstrip("/") + "/"
    lista = []
    for f in sorted((pasta / "aulas").glob("*.json")):
        a = json.loads(f.read_text(encoding="utf-8"))
        lista.append({"num": a["num"], "titulo": a["titulo"], "minutos": a["minutos"], "lead": a["lead"],
                      "objetivo": a["objetivo"], "aprende": [x["t"] for x in a.get("aprende", [])],
                      "url": f"{base}aulas/{a['slug']}/"})
    return {"nome": c["nome"], "sub": c["sub"], "url": c["url"], "aulas": lista}


def exercicios(arq, n):
    t = (FONTE / "exercicios" / arq).read_text(encoding="utf-8")
    partes = re.split(r"(?m)^## (E\d+)\. (.+?)(?: \((\d+) min\))?\s*$", t)
    saida = []
    for i in range(1, len(partes), 4):
        cod, titulo, minutos, corpo = partes[i:i + 4]
        corpo = re.split(r"(?m)^---\s*$", corpo)[0].strip()
        m = re.search(r"\*\*Pronto quando:\*\*\s*(.+?)\s*$", corpo, re.S)
        saida.append({"id": f"s{n}-{cod.lower()}", "titulo": titulo.strip(), "minutos": int(minutos) if minutos else None,
                      "passos_md": corpo[:m.start()].strip(), "pronto_quando": " ".join(m.group(1).split())})
    return saida


def video(chave, nome):
    c = json.loads((FONTE / "cursos" / nome / "curso.json").read_text(encoding="utf-8"))
    v = c["videos"].get(chave)
    geral = json.loads((FONTE / "videos.json").read_text(encoding="utf-8"))[chave]
    pagina = f"https://linnoff88-dev.github.io/
    titulo = v["titulo"] if v else None
    return {"chave": chave, "titulo": titulo, "duracao_s": geral["duration"], "mp4": geral["url"], "vtt": geral.get("vtt"), "pagina": pagina}


def principal():
    ordem = ["seq1", "seq2", "seq3", "seq4", "exercicios"]
    titulos_video = {"jornada-ia": "Do chat ao agente: a visêo geral", "seq1-oswork": "Do chat para o terminal",
                     "seq2-jarvis": "Crie o seu Jarvis", "seq3-filas": "Dez tarefas e vá dormir", "seq4-redes": "Redes no automático"}
    base = {"aviso": "Gerado por tools/gerar_base.py. Nêo edite.", "geral": aulas("geral"), "sequencias": []}
    v = video("jornada-ia", "geral")
    v["titulo"] = titulos_video["jornada-ia"]
    base["geral"]["video"] = v
    for k, (n, nome, arq, chave) in enumerate(SEQ):
        tr = secao(ordem[k], ordem[k + 1])
        h2 = re.search(r"(?is)<h2[^>]*>(.*?)</h2>", tr)
        ps = [plano(p) for p in re.findall(r"(?is)<p[^>]*>(.*?)</p>", tr.split("<div class=\"grid", 1)[0])]
        vid = {"seq1-oswork": "terminal", "seq2-jarvis": "jarvis", "seq3-filas": "filas", "seq4-redes": "redes"}[chave]
        vv = video(chave, "geral" if chave not in json.loads((FONTE / "cursos" / vid / "curso.json").read_text())["videos"] else vid)
        vv["titulo"] = titulos_video[chave]
        base["sequencias"].append({"numero": n, "id": nome, "titulo_pagina": plano(h2.group(1)), "textos_pagina": ps,
                                   "cards_pagina": cards(tr), "curso": aulas(nome), "exercicios": exercicios(arq, n), "video": vv})
    extras = PAGINA[PAGINA.index('id="videos"') if 'id="videos"' in PAGINA else 0:]
    base["links_pagina"] = sorted({(ORIGEM_PAGINA + u if u.startswith("/") else u)
                                   for u in re.findall(r'href="([^"#]+)"', PAGINA[PAGINA.index("<main"):])})
    (RAIZ / "conteudo/base.json").write_text(json.dumps(base, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    s = base["sequencias"]
    print("OK:", len(s), "sequências,", sum(len(x["curso"]["aulas"]) for x in s) + len(base["geral"]["aulas"]), "aulas,",
          sum(len(x["exercicios"]) for x in s), "exercícios,", sum(len(x["cards_pagina"]) for x in s), "cards")


if __name__ == "__main__":
    principal()
