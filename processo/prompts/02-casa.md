Rodada 2: construa a casa e o curso. O nível esperado é o de uma experiência web premiada, não de um protótipo.

Leia `AGENTS.md`, `processo/BRIEFING.md` (é o contrato: cumpra tudo), `conteudo/curso.json`, `conteudo/base.json`, `conteudo/roteiro.md`, o guia de design ARCKHÉ (seções 1 e 2) e as regras de texto. As fotos anexadas são o lugar a recriar. Texturas e panorama prontos estão em `assets/ambiente/`. Como referência de arquitetura de código e de interface, leia `index.html` e `src/` do projeto-modelo público `linnoff88-dev/imersao-jarvis-3d`. Melhore o que achar fraco lá; não copie o hangar nem o robô.

Crie:
- `index.html`: entrada, carregamento com progresso real, sala, mapa do curso, painel da estação e modo sem 3D.
- `src/estilo.css`: tokens em `:root`, sem cor solta fora deles.
- `src/dados.js`: junta `curso.json` e `base.json`, com erro legível se falhar.
- `src/progresso.js`: nome, exercícios marcados e estações concluídas, com `localStorage` em `try/catch`.
- `src/casa.js`: arquitetura da sala, janelas, vidro, forro, vigas, piso e terraço.
- `src/moveis.js`: mesa de vidro, cadeiras, lareira, lanternas, velas, abajur, vaso, mesa de mosaico e cadeiras de ferro. Geometria procedural cuidadosa, com chanfros e proporção real. Nada de caixas cruas.
- `src/estacoes.js`: os 4 objetos, com telas desenhadas em canvas, degraus e porta amarela.
- `src/luz.js`: sol, céu a partir do panorama, ambiente refletido (PMREM), progressão do entardecer e qualidade automática.
- `src/controles.js`: teclado, mouse, clique para ir, toque e colisão.
- `src/interface.js`: painéis, aulas, exercícios, vídeo sob clique, modo sem 3D e fecho. Renderize markdown dos exercícios com segurança, escapando HTML; preserve blocos de código com botão de copiar.
- `src/principal.js`: ligação de tudo e `window.__curso` conforme o briefing.

Sobre as imagens prontas:
- `assets/ambiente/vale-faixa.jpg` está sendo gerada por outro processo agora. É a vista nítida: faixa de 360 graus, mesma longitude do panorama, da elevação +24 até -36 graus, proporção 6:1. Use-a num cilindro distante, com o panorama como céu e como mapa de reflexo. Se o arquivo ainda não existir, o site precisa funcionar só com o panorama e passar a usar a faixa quando ela existir. Não altere nada em `assets/ambiente/` e não gere imagens.
- O sol do panorama está em cerca de 35% da largura. A direção da luz do sol precisa bater com ele.
- O forro `madeira-forro.jpg` está laranja demais em relação à foto: corrija com a cor do material para o tom de mel e caramelo da `sala-vazia.jpg`.

Exigências de qualidade:
- Enquadramento inicial reconhecível como `sala-vazia.jpg`: canto de janelões, viga de concreto, forro inclinado, lareira preta ao fundo e mesa de vidro em primeiro plano.
- Escala real em metros. Pé-direito, parapeito, mesa e cadeiras com medidas plausíveis. UV por metro, sem textura esticada e sem repetição evidente.
- O panorama aparece atrás dos vidros com profundidade convincente; o vidro reflete de leve.
- Sombras do sol entrando pelas janelas no piso e na mesa.
- Texto em telas 3D legível a 2 m; o conteúdo completo sempre existe no HTML.
- A sala com 0 feitas precisa estar bonita e claramente à espera. Cada conclusão precisa dar uma recompensa visível e breve, respeitando `prefers-reduced-motion`.
- Painéis de leitura confortáveis, com hierarquia clara, em 1440 px e 360 px.
- Vídeo: `<video controls preload="none">` com a `mp4` da base, carregado só depois do clique, com link para a página do vídeo como alternativa se falhar.

Verificação obrigatória antes de responder:
1. `python3 tools/validar_conteudo.py`
2. `node --check` em cada arquivo `.js` de `src/`
3. `du -sm assets`
4. Tente abrir por `python3 -m http.server` em navegador headless. Se a área isolada bloquear, escreva "não verificado no navegador" e diga o bloqueio.

Na resposta final, liste os arquivos, cole as saídas reais e diga o que não conseguiu verificar.
