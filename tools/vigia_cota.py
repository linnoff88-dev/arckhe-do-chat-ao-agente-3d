#!/usr/bin/env python3
"""Vigia a cota semanal do Codex. Passou do teto: encerra as rodadas deste projeto e sai.
Uso: tools/vigia_cota.py [teto] [--uma-vez]. Saída 0 = rodadas acabaram abaixo do teto; 3 = teto atingido."""
import datetime as dt
import glob
import json
import os
import subprocess
import sys
import time
from pathlib import Path

RAIZ = str(Path(__file__).resolve().parent.parent)
BASE = os.environ.get("PASTA_CODEX") or os.path.expanduser("~/.codex")
args = [a for a in sys.argv[1:] if not a.startswith("--")]
TETO = float(args[0]) if args else 96.0
PADRAO = f"codex exec.*-C {RAIZ}"


def leitura():
    arqs = sorted(glob.glob(f"{BASE}/sessions/**/*.jsonl", recursive=True), key=os.path.getmtime, reverse=True)[:12]
    melhor = None
    for a in arqs:
        with open(a, "rb") as f:
            f.seek(0, 2)
            f.seek(max(0, f.tell() - 400000))
            linhas = f.read().decode("utf-8", "ignore").splitlines()
        for ln in reversed(linhas):
            if "rate_limits" not in ln:
                continue
            try:
                o = json.loads(ln)
            except ValueError:
                continue
            lim = (o.get("payload") or {}).get("rate_limits") or {}
            achou = False
            for j in (lim.get("primary"), lim.get("secondary")):
                if j and j.get("window_minutes") == 10080:
                    r = {"quando": o.get("timestamp", ""), "usado": j.get("used_percent"), "vira": j.get("resets_at")}
                    if melhor is None or r["quando"] > melhor["quando"]:
                        melhor = r
                    achou = True
            if achou:
                break
    return melhor


def rodando():
    return subprocess.run(["pgrep", "-f", PADRAO], capture_output=True, text=True).stdout.split()


def texto(r):
    vira = dt.datetime.fromtimestamp(r["vira"]).strftime("%d/%m %H:%M") if r and r.get("vira") else "?"
    return f"cota semanal {r['usado'] if r else '?'}% · vira {vira}"


if "--uma-vez" in sys.argv:
    print(texto(leitura()))
    sys.exit(0)
time.sleep(20)
while True:
    r = leitura()
    if r and r["usado"] is not None and r["usado"] > TETO:
        subprocess.run(["pkill", "-TERM", "-f", PADRAO])
        print(f"TETO ATINGIDO: {texto(r)}. Rodadas encerradas.")
        sys.exit(3)
    if not rodando():
        print(f"Rodadas encerradas abaixo do teto: {texto(r)}")
        sys.exit(0)
    time.sleep(45)
