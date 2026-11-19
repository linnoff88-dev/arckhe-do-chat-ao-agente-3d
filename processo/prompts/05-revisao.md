Rodada 5: corrija o que um revisor independente encontrou ao usar o curso como visitante leigo. Nota 6, reprovado. Preserve fluxo, API de teste, modo sem 3D, terraço, vista, araucárias e porta. Sua área isolada não abre navegador; eu testo depois.

Leia `AGENTS.md`, `processo/BRIEFING.md`, `src/`, `conteudo/curso.json`. Não edite `conteudo/base.json`: os exercícios e as aulas continuam literais. O que faltar para o leigo entra como camada própria em `curso.json`.

## Uso (mais importante)
1. **Teclado:** WASD e setas param depois de fechar um painel e depois de "Ir até lá". Faça o movimento funcionar em toda a sala sempre que nenhum painel ou diálogo estiver aberto e o foco não estiver num campo de texto. Ao fechar painel, devolva o foco ao botão que o abriu. Dê contorno visível à cena quando ela recebe foco por Tab, só nesse caso.
2. **Primeiro minuto:** ao entrar, a barra diz "Comece pelo Terminal" (ou a próxima estação recomendada) com o botão "Ir até lá". A visão geral continua acessível. A próxima estação recebe na cena um marcador discreto de luz âmbar, visível de longe, com rótulo HTML.
3. **Barra por estado:** diante de estação a fazer, "Abrir estação". Estação concluída: botão principal "Ir para a próxima estação" e "Abrir estação" secundário. Com as 4 feitas: "Ir ao terraço" em qualquer estação.
4. **Sem texto repetido:** o aviso flutuante não repete a barra. Mostre a mensagem de conclusão num lugar só, sem cobrir setas, botões ou o quadro de Filas.
5. **Celular:** a barra não pode cobrir as setas em nenhum estado, em 360x740 e em 740x360 (não pode passar da tela). Texto em até 2 linhas, botão menor.
6. **Botão fechar do painel:** sempre no canto, na mesma posição.
7. **Mapa:** corrija a planta (terraço no lugar certo, vão da porta aberto, nenhum traço solto) e marque "você está aqui".
8. **Como se mover:** inclua Enter para abrir a estação à frente. Clique em ponto inalcançável dá um retorno curto; com a porta fechada, explica quantas estações faltam.
9. **Terraço:** mostre também `fecho.texto`.
10. **Sem 3D no celular:** progresso geral visível na página. Tabelas sem quebrar palavras no meio: use rolagem horizontal só dentro da tabela ou layout empilhado.

## Texto e curso
11. **Entrada, teste da chamada:** em poucas linhas a tela precisa dizer o problema ("no chat, cada passo depende de você; quando fecha a janela, o trabalho para"), a promessa, o nome "Do chat ao agente", que é um **curso grátis**, e o que é um agente em uma frase simples. Explique que "Entrar na casa" abre o curso em 3D e que o outro botão abre a versão em página. Título sem hype.
12. **Ajuda ao leigo em `curso.json`:** crie `ajuda_exercicios`, com chave no id do exercício, com `antes` (frase curta) e, se houver, `link` e `rotulo`, usando só URLs que já existem em `conteudo/base.json`. Mostre acima do exercício, separado do texto original:
    - `s1-e1`: como abrir o terminal, apontando a aula 1 da sequência 1.
    - `s1-e3`: é preciso ter o agente instalado antes, apontando a aula de instalação.
    - `s3-e2`: o arquivo `ferramentas/fila-caseira.sh` fica no repositório `jornada-agentes`, com o link dele.
    - `s3-e3`: "o guia" é o guia do inemaccbot, com o link dele.
    - exercícios que citam "E1" ou "Sequência 1": diga a que exercício e estação isso corresponde na tela.
    Na tela, numere os exercícios como `E1`, `E2`... para os textos originais baterem.
13. **Glossário:** `glossario` em `curso.json` com explicações de uma frase, tiradas das aulas, para: agente, terminal, cmd, VPS, token, SSH, cron, timer do systemd, portão, fila, xviral, r7e, Skills. Na interface, a primeira ocorrência de cada termo em cada painel vira um termo sublinhado com explicação por toque, clique e foco de teclado, sem alterar o texto.
14. Objetivos das aulas com inicial maiúscula na exibição.
15. **Remova o material `INEMACCBOT com Promoavatar`** da estação 3: ele leva a uma página fora do escopo. O validador agora recusa esse link em materiais.

## Ambiente
16. **Pedra (mais importante do visual):** ainda parece tijolinho rosa e amarelo. Elimine a variação de cor por bloco e o mosaico de tons. Blocos largos de arenito claro cor de areia, cerca de 50 x 20 cm, rejunte cinza largo e visível, como nas duas fotos anexadas. Use `pedra.jpg` com repetição grande e uma variação geral muito suave, de baixa frequência.
17. **Forro:** mel mais profundo e levemente avermelhado, como `sala-vazia.jpg`, réguas estreitas com fresta escura. Caibros mais robustos, escuros, com textura de madeira e chanfro; não podem parecer faixas chapadas.
18. **Cadeiras:** assento e encosto com volume e costura sutil, para não parecerem blocos lisos.
19. **Aconchego e enquadramento inicial:** a sala parece grande e vazia. Reduza a largura e o comprimento em cerca de 15%, se colisão, rotas e estações continuarem corretas, e aproxime a câmera inicial do canto da foto: mesa em primeiro plano, janelões, viga e lareira.
20. **Estações:** enquadramento equilibrado. Hoje 1, 2 e 3 estão coladas e 4 está longe. O objeto principal deve ocupar cerca de metade da altura útil, com contexto em volta. Em Redes, telas maiores e cada uma mostrando de forma legível gancho, fonte na tela e benefício.

## Página do processo
21. `processo/index.html`: remova os links para `BRIEFING.md` e `roteiro.md`. Mostre as rodadas de `processo/dados.json` (rodada, tempo, tokens) e os passos em texto. Sem fotos de referência.

## Verificação obrigatória
1. `python3 tools/validar_conteudo.py`
2. `node --check` em cada `.js` de `src/`
3. `du -sm assets`

Na resposta final, liste por item o que mudou, cole as saídas reais e escreva "não verificado no navegador" para o que depende de captura.
