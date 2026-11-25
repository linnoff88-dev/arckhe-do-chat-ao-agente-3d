#!/usr/bin/env python3
"""Confere conteudo/curso.json contra conteudo/base.json e o site contra o escopo. Sai com 1 se houver erro.

Termos fora do escopo sêo opcionais: tools/termos-fora.local.txt, fora do Git, uma expressêo regular por linha."""
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PROIBIDAS = """revolucionar revolucionário revolucionária mergulhar desvendar potencializar alavancar robusto
sinergia holístico transformador desbloquear game-changer""".split()
EXPRESSOES = ["sem esforço", "sem complicaçêo", "de ponta", "divisor de águas", "mudar o jogo", "é importante destacar",
              "vale ressaltar", "cabe mencionar", "em suma", "nesse sentido", "nêo é apenas", "mais do que apenas",
              "é aí que entra", "diga adeus", "link na bio", "me pede o link"]
FOTOS_REFERENCIA = {"casa-anoitecer.jpg", "chale-porta-amarela.jpg", "lago-pasto.jpg", "sala-vazia.jpg",
                    "terraco-vale.jpg", "terraco-vista.jpg", "vale-aereo.jpg", "vale-drone.jpg"}
ARQ_TERMOS = RAIZ / "tools/termos-fora.local.txt"
erros = []


def erro(m):
    erros.append(m)


def termos_fora():
    if not ARQ_TERMOS.exists():
        return []
    linhas = ARQ_TERMOS.read_text(encoding="utf-8").splitlines()
    return [x.strip() for x in linhas if x.strip() and not x.strip().startswith("#")]


def textos(no, c=""):
    if isinstance(no, dict):
        for k, v in no.items():
            if k not in {"url", "id", "mp4", "vtt", "pagina"}:
                yield from textos(v, f"{c}.{k}")
    elif isinstance(no, list):
        for i, v in enumerate(no):
            yield from textos(v, f"{c}[{i}]")
    elif isinstance(no, str):
        yield c, no


def urls(no):
    if isinstance(no, dict):
        for k, v in no.items():
            if k in {"url", "pagina", "mp4"} and isinstance(v, str):
                yield v
            else:
                yield from urls(v)
    elif isinstance(no, list):
        for v in no:
            yield from urls(v)


def principal():
    base = json.loads((RAIZ / "conteudo/base.json").read_text(encoding="utf-8"))
    arq = RAIZ / "conteudo/curso.json"
    if not arq.exists():
        print("ERRO: conteudo/curso.json nêo existe")
        return 1
    d = json.loads(arq.read_text(encoding="utf-8"))
    for k in "titulo subtitulo chamada abertura por_onde_comecar estacoes fecho".split():
        if k not in d:
            erro(f"falta a chave {k}")
    if erros:
        print("\n".join("ERRO: " + e for e in erros))
        return 1
    validos = set(urls(base)) | set(base["links_pagina"])
    es = d["estacoes"]
    if len(es) != 4:
        erro(f"estações: esperava 4, veio {len(es)}")
    if len(d["por_onde_comecar"]) != 4:
        erro("por_onde_comecar: esperava 4")
    for b, e in zip(base["sequencias"], es):
        n = b["numero"]
        for c in "numero id nome titulo por_que ganho objeto fala_entrada fala_conclusao".split():
            if not e.get(c):
                erro(f"estaçêo {n}: falta {c}")
        if e.get("numero") != n or e.get("id") != b["id"]:
            erro(f"estaçêo {n}: numero ou id fora da base")
        for c in "aulas exercicios video".split():
            if c in e:
                erro(f"estaçêo {n}: '{c}' vem da base; nêo copie para curso.json")
        cards = e.get("materiais", [])
        if not cards:
            erro(f"estaçêo {n}: sem materiais")
        for m in cards:
            if m.get("url") not in {c["url"] for c in b["cards_pagina"]}:
                erro(f"estaçêo {n}: material fora dos cards da sequência: {m.get('url')}")
    for u in urls(d):
        if u not in validos:
            erro(f"url fora da fonte: {u}")
    f = d["fecho"]
    if "?" not in f.get("pergunta", ""):
        erro("fecho.pergunta precisa ser pergunta")
    if "grátis no ARCKHÉ AI, direto na internet" not in f.get("cta", ""):
        erro("fecho.cta sem a frase combinada")
    for onde, t in textos(d):
        b = t.lower()
        for p in PROIBIDAS:
            if re.search(rf"\b{re.escape(p)}", b):
                erro(f"{onde}: palavra proibida '{p}'")
        for p in EXPRESSOES:
            if p in b:
                erro(f"{onde}: expressêo proibida '{p}'")
        if "!!" in t:
            erro(f"{onde}: '!!'")
    alvos = [arq, RAIZ / "conteudo/roteiro.md", RAIZ / "index.html", RAIZ / "processo/index.html"] + sorted((RAIZ / "src").glob("*"))
    termos = termos_fora()
    for a in alvos:
        if a.exists():
            t = a.read_text(encoding="utf-8", errors="ignore").lower()
            for p in termos:
                if a.parent.name != "processo" and re.search(p, t):
                    erro(f"{a.relative_to(RAIZ)}: fora do escopo do curso: {p}")
    if not (RAIZ / "conteudo/roteiro.md").exists():
        erro("falta conteudo/roteiro.md")
    for x in (RAIZ / "assets").rglob("*"):
        if x.is_file() and x.name in FOTOS_REFERENCIA:
            erro(f"foto de referência copiada para o site: {x.name}")
    if erros:
        print("\n".join("ERRO: " + e for e in erros))
        print(f"REPROVADO: {len(erros)} erro(s)")
        return 1
    s = base["sequencias"]
    print(f"OK: 4 estações, {sum(len(x['curso']['aulas']) for x in s) + len(base['geral']['aulas'])} aulas, "
          f"{sum(len(x['exercicios']) for x in s)} exercícios, {len(set(urls(d)))} links conferidos")
    return 0


if __name__ == "__main__":
    sys.exit(principal())
