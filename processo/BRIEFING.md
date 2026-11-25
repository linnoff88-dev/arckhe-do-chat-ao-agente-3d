# Briefing: Do Chat ao Agente 3D

## O pedido
Refazer o modelo da Imersêo Jarvis 3D com o curso "Do chat ao agente", dentro do ambiente das fotos em `fonte/ambiente/`. Feito com Codex + GPT-6.2 Astra em esforço alto. Qualidade profissional. O conteúdo é o curso gratuito.

## CHAMADA
- `dor_ou_desejo`: desejo
- `quem`: você, que hoje pergunta, copia e cola no chat
- `nucleo`: agentes que trabalham por você enquanto você faz outra coisa, em quatro degraus
- `por_que_importa`: no chat você é o motorista o tempo todo; quando fecha a janela, o trabalho para
- `metodo`: "Do chat ao agente"
- `formato`: promessa

## A ideia
Você entra numa casa de pedra e madeira no alto da serra, no fim da tarde. A sala tem janelões para o vale. Em volta dela há **4 estações de trabalho**, uma por sequência. No fundo, **4 degraus de pedra sobem até uma porta amarela fechada**. Cada sequência concluída acende a sua estaçêo e um degrau. Com os 4 degraus acesos, a porta amarela abre e você sai para o terraço, de frente para o vale: saiu do chat, mudou de lugar. A frase da fonte é a espinha do evento: "A virada nêo é aprender um modelo novo: é mudar de lugar".

## O ambiente (fidelidade às fotos)
Olhe as fotos antes de modelar. Ele precisa ser reconhecível como aquele lugar:
- **Sala (`sala-vazia.jpg`):** paredes de blocos de arenito bege e rosado com rejunte cinza; forro inclinado de lambri de madeira mel com caibros escuros grossos; viga de concreto aparente cinza atravessando a sala; janelões de caixilho preto até um parapeito largo de pedra; piso escuro acobreado com brilho suave; mesa de vidro com bordas chanfradas sobre base branca; cadeiras estofadas cor taupe com pés de madeira escura; vaso escuro com flores; lareira preta cônica com chaminé alta; lanternas de metal rendado, abajur e velas sobre o parapeito.
- **Terraço (`chale-porta-amarela.jpg`, `terraco-vista.jpg`, `terraco-vale.jpg`):** porta amarela de tábuas com maçaneta preta; telhado de telha cerâmica com beiral de madeira; mesa redonda de mosaico colorido; cadeiras brancas de ferro trabalhado; mureta de pedra coberta por tapete kilim; araucárias e pinheiros perto da mureta.
- **Vale (`vale-aereo.jpg`, `vale-drone.jpg`, `lago-pasto.jpg`, `terraco-vale.jpg`):** serra coberta de mata, neblina leve nos fundos, luz baixa dourada.
- Fotos sêo referência. Nenhuma pessoa, nenhuma foto colada como parede e nenhum texto de pôster.

## As 4 estações (cada uma é um objeto real da sala)
1. **Terminal:** escrivaninha de madeira com notebook; a tela mostra um terminal real com comandos da sequência.
2. **Jarvis:** poltrona junto à janela com celular num suporte e a conversa do assistente na tela.
3. **Filas:** quadro na parede de pedra com 10 cartões de tarefa, que vêo de "na fila" a "feito".
4. **Redes:** bancada com três telas verticais de reels.

## O curso (o que precisa existir)
1. **Entrada:** chamada, nome opcional e dois botões do mesmo peso: "Entrar na casa" e "Fazer sem 3D".
2. **Abertura:** a visêo geral do curso e o vídeo geral, com a pergunta "por onde começar" (4 pontos de partida da fonte).
3. **Sala 3D em Three.js (`vendor/three/three.module.js`):** caminhar, olhar e ir até as estações.
4. **Movimento:** WASD e setas; arrastar gira a câmera no sentido natural; clique no chêo ou na estaçêo leva até lá; no toque, controle na tela. Colisêo com paredes, móveis e janelas.
5. **Mapa do curso:** as 4 estações, progresso em texto ("2 de 6 exercícios") e "Ir até lá".
6. **Painel da estaçêo:** por que ela importa, vídeo, aulas, exercícios, cursos e materiais. Vídeo só carrega depois do clique.
7. **Aulas:** todas as aulas de `base.json`, com título, duraçêo, resumo, objetivo, o que aprende e link para a aula completa.
8. **Exercícios:** os 23, com passos completos e "pronto quando" em destaque. A pessoa marca cada um. A estaçêo fica concluída quando todos estiverem marcados.
9. **Ordem:** a fonte diz que quem pula a sequência 1 empaca. Mostre a próxima recomendada, sem bloquear quem já sabe.
10. **Final:** porta abre, caminho até o terraço, pergunta de verdade + "grátis no ARCKHÉ AI, direto na internet".
11. **Modo sem 3D:** mesmo curso e mesmo progresso em página comum. Abre sozinho se o WebGL falhar. Bom em 360 px.
12. **Progresso:** `localStorage` com `try/catch`; o site funciona sem ele.

## O que avança na tela
| Feitas | Estado da sala |
|---|---|
| 0 | Estações apagadas, telas desligadas, degraus escuros, porta amarela fechada e trancada visivelmente. A sala já é bonita, mas está claramente à espera. |
| 1 a 3 | A estaçêo concluída liga as telas, suas velas e lanternas acendem e um degrau ganha luz âmbar. O sol desce um pouco a cada conclusêo. |
| 4 | Pôr do sol, 4 degraus acesos, porta amarela abre com animaçêo e a passagem para o terraço libera. |

Conferir sempre com captura: 0 feitas nêo pode parecer concluído.

## Nêo pode
- Qualquer informaçêo que nêo seja do curso gratuito.
- Fingir ao vivo: sem contagem regressiva, "pessoas online", plateia, chat falso ou depoimento.
- Pessoas no ambiente. Robô, mascote ou personagem.
- Texto dentro do 3D que ninguém lê. O que importa também fica em HTML.
- Informaçêo só por cor. Verde só como estado "feito", sempre com rótulo.
- Neon azul, fonte de jogo, emoji no texto, letra de leitura menor que 14 px.

## Direçêo de arte
Fotorrealismo possível em tempo real: PBR, sombras suaves, tone mapping ACES, cor sRGB, reflexo do vale no vidro e no piso, ambient occlusion falso nos encontros, partículas discretas de poeira na luz do sol. Câmera na altura dos olhos, 1,62 m, movimento com inércia suave. Entrada com um travelling curto até a sala. Som: nenhum.

Interface: linha 2 do `DESIGN.md`. Fundo `#0c0c10`, cartêo `#16161e`, borda `#272730`, texto `#e9e9ee`, secundário `#9a9aa6`, acento `#FACC15`, letra de botêo `#1a1206`, raio 10 e 14 px, títulos Sora, corpo Inter, cor só por variável CSS. Logo em `marca/`: um só por tela.

## Acessibilidade e desempenho
Teclado em todo painel, foco visível, `aria-label`, `prefers-reduced-motion`, sem rolagem horizontal, `devicePixelRatio` até 2, níveis de qualidade automáticos (sombras e reflexos caem no celular), 45+ fps em desktop comum, texturas de até 2048 px, total de `assets/` até 25 MB, carregamento com progresso real.

## Arquivos esperados
`index.html`, `src/*.js`, `src/estilo.css`, `conteudo/curso.json`, `conteudo/roteiro.md`, `assets/ambiente/*`, `processo/index.html`.

Testes expõem `window.__curso` com `estado()` → `{modo, estacaoAtual, feitas, exerciciosFeitos, portaAberta, terracoLiberado, webgl, fps}`, `irPara(n)`, `marcarExercicio(n, id)`, `marcarEstacao(n)`, `irTerraco()`, `limpar()`.
