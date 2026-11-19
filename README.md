# Do Chat ao Agente 3D

<div align="center">
  <img src="capa/logo.svg" alt="Arckhé AI" height="48" />
  <p><strong>Arckhé AI</strong></p>
</div>


[![Do Chat ao Agente 3D](guia/assets/banner.jpg)](https://inematds.github.io/do-chat-ao-agente-3d/guia/)

**ðŸ‡§ðŸ‡· [PortuguÃªs](README.md) Â· ðŸ‡ºðŸ‡¸ [English](README.en.md) Â· ðŸ‡ªðŸ‡¸ [EspaÃ±ol](README.es.md)**

## O que Ã©

Este repositÃ³rio mostra como o curso "Do chat ao agente" virou uma casa 3D de pedra e madeira, aberta no navegador. Serve para quem cria cursos ou pÃ¡ginas e quer ver um projeto assim por dentro. VocÃª encontra os pedidos feitos Ã s IAs, as respostas, os testes, as revisÃµes, os erros e os nÃºmeros medidos. O curso tem 4 estaÃ§Ãµes, 37 aulas e 23 exercÃ­cios. Cada sequÃªncia concluÃ­da acende um degrau e, com as 4, a porta amarela abre para o terraÃ§o. HÃ¡ tambÃ©m uma versÃ£o sem 3D.

- **Entrar na casa:** https://eventos.inema.club/do-chat-ao-agente-3d/
- **Como foi feito, no site:** https://eventos.inema.club/do-chat-ao-agente-3d/processo/

## ðŸ“– Guia

Guia completo: **https://inematds.github.io/do-chat-ao-agente-3d/guia/**

## Quer analisar um curso ou uma pÃ¡gina sua?

Cole este pedido em um chat de IA que consiga abrir links, junto com o link ou um arquivo do seu curso. Para a IA alterar arquivos, use o Claude Code ou o Codex na pasta do projeto.

```text
Leia o projeto "Do Chat ao Agente 3D" em https://github.com/inematds/do-chat-ao-agente-3d (comece pelo README e por FALHAS.md) e veja a casa em https://eventos.inema.club/do-chat-ao-agente-3d/.
Use esse projeto sÃ³ como referÃªncia. Depois olhe o meu curso ou a minha pÃ¡gina (no link ou no arquivo que eu enviar; se vocÃª tiver acesso a uma pasta, nela) e me responda em portuguÃªs simples:
1. O que aqui poderia virar lugares ou etapas, com um sinal claro de "pronto"?
2. O que a pessoa veria mudar quando avanÃ§a?
3. Vale a pena fazer em 3D, ou uma pÃ¡gina comum resolve?
4. Como eu conferiria o resultado em um navegador real antes de aprovar?
NÃ£o mude nada ainda. Mostre o plano e espere eu dizer sim.
```

## Como foi construÃ­do

Nei, do INEMA, pediu para partir de um evento 3D anterior, a [ImersÃ£o Jarvis 3D](https://github.com/inematds/imersao-jarvis-3d), e recriar a casa de pedra e madeira de um conjunto de fotos, com o conteÃºdo do curso "Do chat ao agente".

- **Codex com GPT-6.2 Astra**, em esforÃ§o alto e pela assinatura, gerou imagens, texturas, textos e cÃ³digo em 9 rodadas.
- **Claude Code** escreveu o briefing, os pedidos e os testes, conferiu o resultado em navegador real e devolveu o que nÃ£o passava.
- **Revisores independentes** usaram o curso como visitante.

### O que foi medido

| Medida | Valor |
|---|---|
| Rodadas do Codex | 9 |
| Tempo somado das rodadas | 8.459 s, cerca de 2 h 21 min, sem contar preparaÃ§Ã£o e revisÃµes. Algumas rodadas correram ao mesmo tempo |
| Equivalente em tabela de API, sÃ³ do Codex | US$ 26,32, sÃ³ para comparaÃ§Ã£o. Esse valor nÃ£o foi pago: o uso real foi pela assinatura |
| Cota semanal do Codex medida | de 89% para 96% |
| Revisores independentes | nota 6 (reprovado), nota 7 (reprovado) e nota 7,5 (aprovado com pontos a ajustar, com orientaÃ§Ã£o mais branda que nas duas primeiras) |

As rodadas sÃ£o numeradas de 00 a 07, com uma 00b. A Ãºltima foi conferida no site publicado, com clique e teclado reais, sem novo revisor. Os nÃºmeros por rodada estÃ£o em `processo/dados.json`. As notas vÃªm do acompanhamento do projeto, e os pareceres completos dos revisores nÃ£o estÃ£o publicados: os pontos apontados aparecem nos pedidos das rodadas 05, 06 e 07.

### O que deu errado

A lista completa, com a correÃ§Ã£o de cada item, estÃ¡ em [FALHAS.md](FALHAS.md). Alguns exemplos:

- O forro saiu vermelho e o piso saiu vinho.
- A pedra pareceu tijolo pintado e, depois, bloco de jogo.
- Uma imagem de teste saiu toda preta, porque a tela era apagada logo depois de desenhada.
- A mureta prendia o clique no vÃ£o da porta.
- A barra de avisos anunciava a chegada Ã  estaÃ§Ã£o quando a pessoa ainda estava a caminho.

### Limites

- A fluidez nÃ£o foi medida em placa de vÃ­deo real nem em celular fÃ­sico. Os testes usaram renderizaÃ§Ã£o por software e emulaÃ§Ã£o.
- Cadeiras, poltrona e pedra vista de perto ainda sÃ£o simples.
- NÃ£o foi medido se a casa faz as pessoas aprenderem ou concluÃ­rem mais.
- O curso Ã© grÃ¡tis, mas os exercÃ­cios pedem computador e assinatura do Claude ou do ChatGPT. Alguns usam o terminal.

---

## InstalaÃ§Ã£o tÃ©cnica

O site Ã© estÃ¡tico, sem etapa de build. VocÃª precisa de Python 3 para servir os arquivos e de um navegador com WebGL para o modo 3D. Sem WebGL, o curso abre na versÃ£o sem 3D.

```bash
git clone https://github.com/inematds/do-chat-ao-agente-3d.git
cd do-chat-ao-agente-3d
python3 -m http.server 8792
```

Depois abra `http://localhost:8792/`.

### Arquivos

| Caminho | O que guarda |
|---|---|
| `index.html`, `src/` | O site: interface, casa 3D, controles e progresso |
| `conteudo/base.json` | Aulas, exercÃ­cios e vÃ­deos, jÃ¡ prontos |
| `conteudo/curso.json`, `conteudo/roteiro.md` | Textos da casa e percurso |
| `assets/` | Texturas, vista do vale e fontes |
| `vendor/three/` | Three.js, sem CDN |
| `processo/` | Briefing, pedidos, respostas, medidas e capturas das rodadas 2, 4 e 7 |
| `tools/` | Validador, captura em navegador e execuÃ§Ã£o das rodadas |
| `guia/`, `capa/` | Este guia em portuguÃªs, inglÃªs e espanhol, e a capa |

### O que esta cÃ³pia pÃºblica muda

Este repositÃ³rio foi montado Ã  parte, com um histÃ³rico novo. Ficaram de fora a pasta `fonte/`, as fotos de referÃªncia, os registros brutos de execuÃ§Ã£o e as capturas das outras rodadas. Os nomes das fotos ainda aparecem nos pedidos.

Os registros de `processo/` foram saneados: caminhos da mÃ¡quina, links da pÃ¡gina de origem e regras internas foram trocados ou retirados. Por isso, alguns trechos dos pedidos diferem do texto original enviado ao Codex. Em `conteudo/base.json`, saÃ­ram os links da pÃ¡gina de origem, que o site nÃ£o usa.

`tools/gerar_base.py` depende de `fonte/` e fica como registro. A base jÃ¡ vem pronta em `conteudo/base.json`.

### Testes

```bash
python3 tools/validar_conteudo.py
for f in src/*.js; do node --check "$f"; done
```

O validador aceita uma lista opcional de termos proibidos em `tools/termos-fora.local.txt`, fora do Git, com uma expressÃ£o regular por linha.

`node tools/capturar.mjs <rotulo>` abre o site em Chromium e guarda capturas em `processo/revisoes/`. Ele espera o Playwright em `~/.npm-global` (`npm install -g --prefix ~/.npm-global playwright`, depois `npx playwright install chromium`).

### Custo

`tools/resumir_rodada.py` grava tempo, tokens e custo equivalente de cada rodada em `processo/dados.json`. Ele e `tools/vigia_cota.py` leem os registros locais do Codex. Use `PASTA_CODEX` se eles nÃ£o estiverem em `~/.codex`.

## O processo, do inÃ­cio ao fim

ðŸ§  Ã© o trabalho de Nei, do INEMA, com o Claude Code. âš™ï¸ Ã© um script. ðŸ¤– Ã© o Codex ou um revisor independente.

| Passo | O que acontece | Comando | Quem faz |
|---|---|---|---|
| 1 | Reunir a pÃ¡gina do curso, as aulas, os exercÃ­cios e as fotos sem pessoas | pasta `fonte/`, fora deste repositÃ³rio | ðŸ§  sessÃ£o com o Nei |
| 2 | Escrever briefing, regras e validador | `processo/BRIEFING.md`, `tools/validar_conteudo.py` | ðŸ§  sessÃ£o com o Nei |
| 3 | Gerar a base do curso | `python3 tools/gerar_base.py` (pede `fonte/`) | âš™ï¸ script |
| 4 | Criar imagens, texturas e a vista do vale | `tools/rodar_codex.sh processo/prompts/00-ambiente.md <fotos>` e `00b-vista.md` | ðŸ¤– Codex |
| 5 | Escrever os textos do curso | `tools/rodar_codex.sh processo/prompts/01-conteudo.md` | ðŸ¤– Codex |
| 6 | Construir a casa e o curso | `tools/rodar_codex.sh processo/prompts/02-casa.md <fotos>` | ðŸ¤– Codex |
| 7 | Conferir com capturas em navegador real | `node tools/capturar.mjs <rotulo>` | ðŸ§  sessÃ£o com o Nei |
| 8 | Aproximar das fotos e dar acabamento, com trava de cota | `tools/vigia_cota.py 96`, `03-fidelidade.md`, `04-acabamento.md` | ðŸ¤– Codex |
| 9 | RevisÃ£o independente: nota 6, reprovado | agente novo, sem as notas do autor | ðŸ¤– revisor |
| 10 | Corrigir o que a revisÃ£o apontou | `tools/rodar_codex.sh processo/prompts/05-revisao.md` | ðŸ¤– Codex |
| 11 | Segunda revisÃ£o: nota 7, reprovado | agente novo | ðŸ¤– revisor |
| 12 | Corrigir de novo | `tools/rodar_codex.sh processo/prompts/06-revisao2.md` | ðŸ¤– Codex |
| 13 | Terceira revisÃ£o: nota 7,5, aprovado | agente novo, com orientaÃ§Ã£o mais branda | ðŸ¤– revisor |
| 14 | Fechamento | `tools/rodar_codex.sh processo/prompts/07-fechamento.md` | ðŸ¤– Codex |
| 15 | Conferir a Ãºltima rodada com clique e teclado reais | navegador + `node tools/capturar.mjs r7` | ðŸ§  sessÃ£o com o Nei |
| 16 | Validar | `python3 tools/validar_conteudo.py` e `node --check` em `src/*.js` | âš™ï¸ script |
| 17 | Publicar o site, com o OK do Nei | script de publicaÃ§Ã£o, fora deste repositÃ³rio | ðŸ§  sessÃ£o com o Nei |
| 18 | Montar esta cÃ³pia pÃºblica, saneada, e escrever o guia | branch `publico`, `guia/`, `inema-traduz` | ðŸ§  sessÃ£o com o Nei |

---

<div align="center">
  <img src="capa/logo.svg" alt="Arckhé AI" height="32" />
  <p><strong>Arckhé AI</strong></p>
</div>