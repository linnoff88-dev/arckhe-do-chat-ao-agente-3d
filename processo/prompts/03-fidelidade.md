Rodada 3: fidelidade às fotos e acabamento profissional.

A primeira versêo funciona, em Chromium real, sem erro de console. Mantenha o que funciona: fluxo, progresso, `window.__curso`, modo sem 3D, entrada e colisêo. As imagens anexadas mostram a referência (`sala-vazia`, `chale-porta-amarela`) e as capturas reais atuais. Sua área isolada nêo abre navegador; eu testo depois. Por isso calcule enquadramentos e proporções com cuidado.

Leia `AGENTS.md`, `processo/BRIEFING.md` e o código de `src/`.

## Corrija, nesta ordem de importância

**Materiais e luz da sala**
1. Forro: hoje está vermelho-escuro. Na foto é lambri cor de mel claro e dourado, luminoso, com caibros de madeira mais escura. Acerte cor, repetiçêo e direçêo das réguas (descendo a inclinaçêo), e dê luz rebatida ao forro.
2. Pedra: saturada e rosa demais, com blocos enormes. Na foto os blocos sêo bege-areia claros, com variaçêo rosada leve e rejunte cinza visível. Cada bloco tem cerca de 30 a 40 cm de comprimento por 12 a 15 cm de altura. Corrija escala e cor em paredes, colunas, parapeito e mureta. Sem repetiçêo evidente.
3. Piso: menos vermelho; escuro acobreado, semibrilhante, refletindo as janelas de forma suave, como na foto.
4. Concreto da viga: cinza mais frio, mantendo a leitura de concreto aparente.
5. Ambiente mais claro e arejado no começo, como a foto. Sombra e contato nos encontros entre parede, móvel e piso.

**Vista**
6. Pelas janelas a mata e as serras precisam ocupar boa parte do vidro, como na foto: morros verdes altos, céu na faixa de cima. Hoje o céu domina. Ajuste altura, distância e escala do cilindro da `vale-faixa.jpg`, sem distorcer.
7. Com 4 estações feitas, o vale fica lavado e branco. O pôr do sol deve deixar a cena mais quente e mais contrastada, com a mata ainda visível e as serras em silhueta dourada. Nêo use névoa que apague a paisagem.
8. As árvores atuais sêo pilhas de cones e parecem baratas. Use `image_gen` para criar 2 recortes de araucária e 1 de pinheiro, com fundo uniforme, remova o fundo com Python, e salve em `assets/ambiente/` como PNG ou WebP com alfa, até 700 KB cada, sem halo. Use em planos verticais cruzados ou billboards, junto à mureta e nas janelas, com tamanho crível.

**Móveis**
9. Cadeiras de jantar: hoje sêo marrom-escuras e quadradas, e a do primeiro plano tem a parte de cima rasgada. Refaça como na foto: estofado taupe claro, encosto alto com topo arredondado, assento macio, pés de madeira escura levemente inclinados. Geometria limpa, sem pontas ou faces quebradas.
10. Mesa: uma base branca única, escalonada, como na foto. Tire o disco sobre a base. Mantenha o vidro com borda esverdeada, chanfro e reflexo.
11. Poltrona e mesinha da estaçêo 2: a poltrona invade a estaçêo 1. Separe as estações. Afaste a lanterna do celular.
12. Cadeiras do terraço: brancas de verdade, ferro com arabescos mais finos e encosto em voluta. Kilim caindo sobre a mureta com volume leve.

**Estações**
13. A câmera de cada estaçêo hoje fica colada na parede. Enquadre a 2 a 2,5 m, com a estaçêo inteira, parte da sala e, quando possível, uma janela.
14. Terminal: em espera, tela escura com um pequeno LED âmbar. Concluída, terminal legível com comandos da sequência.
15. Jarvis: o celular precisa aparecer bem, em suporte, sem nada na frente. Concluída, conversa legível.
16. Filas: a lanterna cobre um cartêo; tire. Troque "Tarefa 01" por tarefas reais citadas na fonte: transcrever, dublar, vídeo explicativo, curso, reel, repetindo com variaçêo se precisar. Com 0 feitas, tudo "na fila". Concluída, os cartões passam para "feito" com um portêo indicado antes do que importa.
17. Redes: em espera, telas pretas com LED. Concluída, três reels diferentes em cada tela.

**Degraus, porta e terraço**
18. Os 4 degraus e a porta amarela precisam ser um foco visual da sala: visíveis na caminhada, em parede clara, com a porta igual à da foto (tábuas verticais amarelas, maçaneta preta, moldura). Com 0 feitas, leitura clara de fechada, com degraus apagados. Cada degrau acende com luz âmbar na borda.
19. Terraço: câmera olhando um pouco para baixo, com a mesa, a mureta e o vale ocupando o quadro; o beiral de madeira e as telhas aparecem no alto. A porta aberta nêo pode ocupar a lateral em primeiro plano.
20. A partir do terraço, a parede de pedra da casa, a janela e a porta amarela precisam existir quando a pessoa se vira.

**Interface**
21. O logo aparece como retângulo preto. Use o tratamento certo no cabeçalho, sem caixa visível: `mix-blend-mode: screen` ou recorte em CSS. Nêo edite `marca/`.
22. Os dois botões da entrada continuam com o mesmo peso.

## Adicione à API de teste
`window.__curso.verPorta()` posiciona a câmera para ver degraus e porta, e `window.__curso.abrirEstacao(n)` abre o painel da estaçêo.

## Verificaçêo obrigatória
1. `python3 tools/validar_conteudo.py`
2. `node --check` em cada `.js` de `src/`
3. `du -sm assets` (até 25)
4. Abra cada imagem nova gerada.

Na resposta final, liste o que mudou por item, cole as saídas reais e escreva "nêo verificado no navegador" para o que depende de captura.
