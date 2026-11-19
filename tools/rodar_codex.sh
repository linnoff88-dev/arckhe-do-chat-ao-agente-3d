#!/usr/bin/env bash
# Roda uma etapa no Codex pela assinatura (GPT-6.2 Astra, esforço alto) e guarda tudo em processo/rodadas/.
# Uso: tools/rodar_codex.sh processo/prompts/01-x.md [imagem-de-referencia ...]
set -uo pipefail
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
PROMPT="$RAIZ/${1:?informe o arquivo do prompt}"; shift
NOME="$(basename "$PROMPT" .md)"
SAIDA="$RAIZ/processo/rodadas/$NOME"
[ -e "$SAIDA" ] && SAIDA="$SAIDA-$(date +%H%M%S)"
mkdir -p "$SAIDA"
cp "$PROMPT" "$SAIDA/prompt.md"
IMAGENS=()
for f in "$@"; do IMAGENS+=(-i "$RAIZ/$f"); done
INICIO=$(date +%s)
date -Is > "$SAIDA/inicio.txt"
systemd-run --user --scope --quiet -p MemoryMax=8G \
  timeout 90m env -u OPENAI_API_KEY -u CODEX_API_KEY \
  codex exec --json --skip-git-repo-check \
    -m gpt-6.2-astra -c 'model_reasoning_effort="high"' \
    -s workspace-write -C "$RAIZ" \
    "${IMAGENS[@]}" -o "$SAIDA/resposta.md" - < "$PROMPT" \
  > "$SAIDA/eventos.jsonl" 2> "$SAIDA/erros.txt"
CODIGO=$?
echo $(( $(date +%s) - INICIO )) > "$SAIDA/segundos.txt"
echo "$CODIGO" > "$SAIDA/codigo.txt"
python3 "$RAIZ/tools/resumir_rodada.py" "$SAIDA"
exit "$CODIGO"
