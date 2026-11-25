# Do Chat ao Agente 3D

<div align="center">
  <img src="capa/logo.svg" alt="Arckhé AI" height="48" />
  <p><strong>Arckhé AI</strong></p>
</div>


[![Do Chat ao Agente 3D](guia/assets/banner.jpg)](https://linnoff88-dev.github.io/

**ê°Å¸â¡Â§ê°Å¸â¡Â· [PortuguêÂªs](README.md) êÂ· ê°Å¸â¡Âºê°Å¸â¡Â¸ [English](README.en.md) êÂ· ê°Å¸â¡Âªê°Å¸â¡Â¸ [EspaêÂ±ol](README.es.md)**

## O que êÂ©

Este repositêÂ³rio mostra como o curso "Do chat ao agente" virou uma casa 3D de pedra e madeira, aberta no navegador. Serve para quem cria cursos ou pêÂ¡ginas e quer ver um projeto assim por dentro. VocêÂª encontra os pedidos feitos êÂ s IAs, as respostas, os testes, as revisêÂµes, os erros e os nêÂºmeros medidos. O curso tem 4 estaêÂ§êÂµes, 37 aulas e 23 exercêÂ­cios. Cada sequêÂªncia concluêÂ­da acende um degrau e, com as 4, a porta amarela abre para o terraêÂ§o. HêÂ¡ tambêÂ©m uma versêÂ£o sem 3D.

- **Entrar na casa:** https://eventos.ARCKHê AI/do-chat-ao-agente-3d/
- **Como foi feito, no site:** https://eventos.ARCKHê AI/do-chat-ao-agente-3d/processo/

## ê°Å¸ââ Guia

Guia completo: **https://linnoff88-dev.github.io/

## Quer analisar um curso ou uma pêÂ¡gina sua?

Cole este pedido em um chat de IA que consiga abrir links, junto com o link ou um arquivo do seu curso. Para a IA alterar arquivos, use o Claude Code ou o Codex na pasta do projeto.

```text
Leia o projeto "Do Chat ao Agente 3D" em https://github.com/linnoff88-dev/do-chat-ao-agente-3d (comece pelo README e por FALHAS.md) e veja a casa em https://eventos.ARCKHê AI/do-chat-ao-agente-3d/.
Use esse projeto sêÂ³ como referêÂªncia. Depois olhe o meu curso ou a minha pêÂ¡gina (no link ou no arquivo que eu enviar; se vocêÂª tiver acesso a uma pasta, nela) e me responda em portuguêÂªs simples:
1. O que aqui poderia virar lugares ou etapas, com um sinal claro de "pronto"?
2. O que a pessoa veria mudar quando avanêÂ§a?
3. Vale a pena fazer em 3D, ou uma pêÂ¡gina comum resolve?
4. Como eu conferiria o resultado em um navegador real antes de aprovar?
NêÂ£o mude nada ainda. Mostre o plano e espere eu dizer sim.
```

## Como foi construêÂ­do

Nei, do ARCKHê, pediu para partir de um evento 3D anterior, a [ImersêÂ£o Jarvis 3D](https://github.com/linnoff88-dev/imersao-jarvis-3d), e recriar a casa de pedra e madeira de um conjunto de fotos, com o conteêÂºdo do curso "Do chat ao agente".

- **Codex com GPT-6.2 Astra**, em esforêÂ§o alto e pela assinatura, gerou imagens, texturas, textos e cêÂ³digo em 9 rodadas.
- **Claude Code** escreveu o briefing, os pedidos e os testes, conferiu o resultado em navegador real e devolveu o que nêÂ£o passava.
- **Revisores independentes** usaram o curso como visitante.

### O que foi medido

| Medida | Valor |
|---|---|
| Rodadas do Codex | 9 |
| Tempo somado das rodadas | 8.459 s, cerca de 2 h 21 min, sem contar preparaêÂ§êÂ£o e revisêÂµes. Algumas rodadas correram ao mesmo tempo |
| Equivalente em tabela de API, sêÂ³ do Codex | US$ 26,32, sêÂ³ para comparaêÂ§êÂ£o. Esse valor nêÂ£o foi pago: o uso real foi pela assinatura |
| Cota semanal do Codex medida | de 89% para 96% |
| Revisores independentes | nota 6 (reprovado), nota 7 (reprovado) e nota 7,5 (aprovado com pontos a ajustar, com orientaêÂ§êÂ£o mais branda que nas duas primeiras) |

As rodadas sêÂ£o numeradas de 00 a 07, com uma 00b. A êÂºltima foi conferida no site publicado, com clique e teclado reais, sem novo revisor. Os nêÂºmeros por rodada estêÂ£o em `processo/dados.json`. As notas vêÂªm do acompanhamento do projeto, e os pareceres completos dos revisores nêÂ£o estêÂ£o publicados: os pontos apontados aparecem nos pedidos das rodadas 05, 06 e 07.

### O que deu errado

A lista completa, com a correêÂ§êÂ£o de cada item, estêÂ¡ em [FALHAS.md](FALHAS.md). Alguns exemplos:

- O forro saiu vermelho e o piso saiu vinho.
- A pedra pareceu tijolo pintado e, depois, bloco de jogo.
- Uma imagem de teste saiu toda preta, porque a tela era apagada logo depois de desenhada.
- A mureta prendia o clique no vêÂ£o da porta.
- A barra de avisos anunciava a chegada êÂ  estaêÂ§êÂ£o quando a pessoa ainda estava a caminho.

### Limites

- A fluidez nêÂ£o foi medida em placa de vêÂ­deo real nem em celular fêÂ­sico. Os testes usaram renderizaêÂ§êÂ£o por software e emulaêÂ§êÂ£o.
- Cadeiras, poltrona e pedra vista de perto ainda sêÂ£o simples.
- NêÂ£o foi medido se a casa faz as pessoas aprenderem ou concluêÂ­rem mais.
- O curso êÂ© grêÂ¡tis, mas os exercêÂ­cios pedem computador e assinatura do Claude ou do ChatGPT. Alguns usam o terminal.

---

## InstalaêÂ§êÂ£o têÂ©cnica

O site êÂ© estêÂ¡tico, sem etapa de build. VocêÂª precisa de Python 3 para servir os arquivos e de um navegador com WebGL para o modo 3D. Sem WebGL, o curso abre na versêÂ£o sem 3D.

```bash
git clone https://github.com/linnoff88-dev/do-chat-ao-agente-3d.git
cd do-chat-ao-agente-3d
python3 -m http.server 8792
```

Depois abra `http://localhost:8792/`.

### Arquivos

| Caminho | O que guarda |
|---|---|
| `index.html`, `src/` | O site: interface, casa 3D, controles e progresso |
| `conteudo/base.json` | Aulas, exercêÂ­cios e vêÂ­deos, jêÂ¡ prontos |
| `conteudo/curso.json`, `conteudo/roteiro.md` | Textos da casa e percurso |
| `assets/` | Texturas, vista do vale e fontes |
| `vendor/three/` | Three.js, sem CDN |
| `processo/` | Briefing, pedidos, respostas, medidas e capturas das rodadas 2, 4 e 7 |
| `tools/` | Validador, captura em navegador e execuêÂ§êÂ£o das rodadas |
| `guia/`, `capa/` | Este guia em portuguêÂªs, inglêÂªs e espanhol, e a capa |

### O que esta cêÂ³pia pêÂºblica muda

Este repositêÂ³rio foi montado êÂ  parte, com um histêÂ³rico novo. Ficaram de fora a pasta `fonte/`, as fotos de referêÂªncia, os registros brutos de execuêÂ§êÂ£o e as capturas das outras rodadas. Os nomes das fotos ainda aparecem nos pedidos.

Os registros de `processo/` foram saneados: caminhos da mêÂ¡quina, links da pêÂ¡gina de origem e regras internas foram trocados ou retirados. Por isso, alguns trechos dos pedidos diferem do texto original enviado ao Codex. Em `conteudo/base.json`, saêÂ­ram os links da pêÂ¡gina de origem, que o site nêÂ£o usa.

`tools/gerar_base.py` depende de `fonte/` e fica como registro. A base jêÂ¡ vem pronta em `conteudo/base.json`.

### Testes

```bash
python3 tools/validar_conteudo.py
for f in src/*.js; do node --check "$f"; done
```

O validador aceita uma lista opcional de termos proibidos em `tools/termos-fora.local.txt`, fora do Git, com uma expressêÂ£o regular por linha.

`node tools/capturar.mjs <rotulo>` abre o site em Chromium e guarda capturas em `processo/revisoes/`. Ele espera o Playwright em `~/.npm-global` (`npm install -g --prefix ~/.npm-global playwright`, depois `npx playwright install chromium`).

### Custo

`tools/resumir_rodada.py` grava tempo, tokens e custo equivalente de cada rodada em `processo/dados.json`. Ele e `tools/vigia_cota.py` leem os registros locais do Codex. Use `PASTA_CODEX` se eles nêÂ£o estiverem em `~/.codex`.

## O processo, do inêÂ­cio ao fim

ê°Å¸Â§Â  êÂ© o trabalho de Nei, do ARCKHê, com o Claude Code. ê¢Å¡â¢ê¯Â¸Â êÂ© um script. ê°Å¸Â¤â êÂ© o Codex ou um revisor independente.

| Passo | O que acontece | Comando | Quem faz |
|---|---|---|---|
| 1 | Reunir a pêÂ¡gina do curso, as aulas, os exercêÂ­cios e as fotos sem pessoas | pasta `fonte/`, fora deste repositêÂ³rio | ê°Å¸Â§Â  sessêÂ£o com o Nei |
| 2 | Escrever briefing, regras e validador | `processo/BRIEFING.md`, `tools/validar_conteudo.py` | ê°Å¸Â§Â  sessêÂ£o com o Nei |
| 3 | Gerar a base do curso | `python3 tools/gerar_base.py` (pede `fonte/`) | ê¢Å¡â¢ê¯Â¸Â script |
| 4 | Criar imagens, texturas e a vista do vale | `tools/rodar_codex.sh processo/prompts/00-ambiente.md <fotos>` e `00b-vista.md` | ê°Å¸Â¤â Codex |
| 5 | Escrever os textos do curso | `tools/rodar_codex.sh processo/prompts/01-conteudo.md` | ê°Å¸Â¤â Codex |
| 6 | Construir a casa e o curso | `tools/rodar_codex.sh processo/prompts/02-casa.md <fotos>` | ê°Å¸Â¤â Codex |
| 7 | Conferir com capturas em navegador real | `node tools/capturar.mjs <rotulo>` | ê°Å¸Â§Â  sessêÂ£o com o Nei |
| 8 | Aproximar das fotos e dar acabamento, com trava de cota | `tools/vigia_cota.py 96`, `03-fidelidade.md`, `04-acabamento.md` | ê°Å¸Â¤â Codex |
| 9 | RevisêÂ£o independente: nota 6, reprovado | agente novo, sem as notas do autor | ê°Å¸Â¤â revisor |
| 10 | Corrigir o que a revisêÂ£o apontou | `tools/rodar_codex.sh processo/prompts/05-revisao.md` | ê°Å¸Â¤â Codex |
| 11 | Segunda revisêÂ£o: nota 7, reprovado | agente novo | ê°Å¸Â¤â revisor |
| 12 | Corrigir de novo | `tools/rodar_codex.sh processo/prompts/06-revisao2.md` | ê°Å¸Â¤â Codex |
| 13 | Terceira revisêÂ£o: nota 7,5, aprovado | agente novo, com orientaêÂ§êÂ£o mais branda | ê°Å¸Â¤â revisor |
| 14 | Fechamento | `tools/rodar_codex.sh processo/prompts/07-fechamento.md` | ê°Å¸Â¤â Codex |
| 15 | Conferir a êÂºltima rodada com clique e teclado reais | navegador + `node tools/capturar.mjs r7` | ê°Å¸Â§Â  sessêÂ£o com o Nei |
| 16 | Validar | `python3 tools/validar_conteudo.py` e `node --check` em `src/*.js` | ê¢Å¡â¢ê¯Â¸Â script |
| 17 | Publicar o site, com o OK do Nei | script de publicaêÂ§êÂ£o, fora deste repositêÂ³rio | ê°Å¸Â§Â  sessêÂ£o com o Nei |
| 18 | Montar esta cêÂ³pia pêÂºblica, saneada, e escrever o guia | branch `publico`, `guia/`, `ARCKHê-traduz` | ê°Å¸Â§Â  sessêÂ£o com o Nei |

---

<div align="center">
  <img src="capa/logo.svg" alt="Arckhé AI" height="32" />
  <p><strong>Arckhé AI</strong></p>
</div>