# Do Chat ao Agente 3D

Curso "Do chat ao agente" em 3D: as 4 sequências viram 4 estações dentro de uma casa de pedra e madeira na serra.

Leia, nesta ordem: `README.md`, `processo/BRIEFING.md` e a tarefa da rodada.

## Regras
- O conteúdo do curso está em `conteudo/base.json` (aulas, exercícios e vídeos) e `conteudo/curso.json` (textos da casa). Não invente curso, link, número ou depoimento.
- A pasta `fonte/` não faz parte deste repositório. As fotos de referência nunca vão para o site nem para `assets/`.
- Não edite: `marca/`, `vendor/`, `processo/BRIEFING.md`, `processo/prompts/`, `processo/rodadas/`, `conteudo/base.json`.
- Sem `npm install`, sem CDN e sem download. Vídeos e links do curso só carregam no navegador do visitante, depois do clique.
- Sem chave de API e sem serviço externo.
- Só caminhos relativos: o site é servido em subpasta.
- Design: padrão ARCKHÉ, escuro com acento amarelo, títulos em Sora e texto em Inter.
- Só diga que terminou com a saída real dos testes. O que não conseguiu rodar, escreva como não verificado.

## Testes
- Conteúdo: `python3 tools/validar_conteudo.py`
- JavaScript: `node --check <arquivo>` em cada arquivo `.js` de `src/`
