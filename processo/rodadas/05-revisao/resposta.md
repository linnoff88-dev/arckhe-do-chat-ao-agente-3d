Rodada 5 implementada. O validador passou com **4 estações, 37 aulas e 23 exercícios**. Os testes locais reproduziram os dois casos relatados pelo revisor: as setas funcionaram depois de fechar o painel, e WASD funcionou depois de “Ir até lá”.

**Resultado visual e interação em dispositivo real: não verificado no navegador.** Isso inclui as capturas em 360×740 e 740×360, o toque, a aparência dos materiais e a legibilidade das telas 3D.

### Uso

1. **Teclado.** WASD e setas respondem em toda a sala. Diálogos e campos de texto mantêm o teclado para si. Fechar o painel devolve o foco ao acionador, e a cena ganha contorno ao receber foco por Tab.
2. **Primeiro minuto.** A barra indica “Comece pelo Terminal” ou a próxima estação pendente, com “Ir até lá”. A recomendada recebe luz âmbar e rótulo HTML clicável, com indicação de direção quando sai do campo de visão. A visão geral continua acessível.
3. **Barra por estado.** Estação pendente oferece “Abrir estação”. Estação concluída prioriza “Ir para a próxima estação” e permite reabrir a atual. Com as quatro feitas, “Ir ao terraço” passa a ser a ação principal em qualquer estação.
4. **Conclusão.** A mensagem aparece uma vez, na barra da sala, no painel aberto ou junto ao exercício marcado na página.
5. **Celular.** Barra e setas ocupam áreas distintas. Em paisagem baixa, os controles têm uma faixa própria abaixo da cena. A barra compacta usa botões menores e até duas linhas de texto.
6. **Fechar painel.** O botão permanece no canto superior direito. Avisos ocupam outra linha.
7. **Mapa.** A planta usa as coordenadas da casa, mostra o vão da porta e o terraço, e marca “Você está aqui” pela posição da câmera. Na versão em página, acompanha o capítulo em leitura.
8. **Movimento.** A ajuda explica Enter para abrir a estação à frente. Cliques inalcançáveis recebem retorno curto, e a porta fechada informa quantas estações faltam.
9. **Terraço.** O fecho inclui `fecho.texto`, a pergunta e a chamada final. No celular, “Ler o fecho” abre o texto completo.
10. **Sem 3D.** O progresso geral de estações e exercícios fica visível no celular. As tabelas rolam dentro do próprio quadro e preservam as palavras.

### Texto e curso

11. **Entrada.** A chamada explica por que o trabalho para no chat, define agente e apresenta *Do chat ao agente* como curso grátis para aprender a delegar e conferir tarefas. Cada botão identifica a versão que abre.
12. **Exercícios.** Sete ajudas em `curso.json` esclarecem instalação, arquivos, guia e referências a outras atividades. Os quatro links de ajuda existem na base. A numeração visível segue E1, E2 e assim por diante.
13. **Glossário.** Os 13 termos pedidos têm definição por toque, clique e foco. A primeira ocorrência no texto visível recebe sublinhado, inclusive quando uma aula ou exercício é expandido.
14. **Objetivos.** Os 37 objetivos começam com maiúscula na exibição. O conteúdo literal permanece em `base.json`.
15. **Materiais.** Removi “INEMACCBOT com Promoavatar” da estação Filas.

### Ambiente e processo

16. **Pedra.** O material usa `pedra.jpg` com pigmento areia comum, rejunte cinza e variação suave ao longo da parede. A escala corresponde a blocos de aproximadamente 50 × 20 cm.
17. **Forro.** As réguas ganharam tom mel avermelhado e frestas mais escuras. Os caibros ficaram mais espessos, com textura de madeira e chanfro.
18. **Cadeiras.** Assentos e encostos ganharam espessura e uma costura que acompanha a superfície curva.
19. **Sala.** Largura e comprimento diminuíram 15%, para 10,2 × 8,16 m. A câmera inicial enquadra mesa, lareira, viga e porta. A simulação confirmou **30 rotas internas** com a porta fechada e **42 rotas** com o terraço liberado.
20. **Estações.** Na projeção desktop calculada, os objetos ocupam **52%** da altura no Terminal, **42%** em Jarvis, **50%** em Filas e **47%** em Redes. As três telas de Redes cresceram e cada uma apresenta gancho, fonte e benefício.
21. **Processo.** A página mostra os passos em texto e lê rodada, tempo e tokens de `dados.json`. O teste renderizou as seis rodadas registradas. Removi os links para briefing e roteiro.

### Saídas das verificações obrigatórias

`python3 tools/validar_conteudo.py`

```text
OK: 4 estações, 37 aulas, 23 exercícios, 15 links conferidos
```

`node --check` em cada arquivo de `src/`, com confirmação impressa após cada saída zero:

```text
OK src/casa.js
OK src/controles.js
OK src/dados.js
OK src/estacoes.js
OK src/geometria.js
OK src/glossario.js
OK src/interface.js
OK src/luz.js
OK src/moveis.js
OK src/planta.js
OK src/principal.js
OK src/progresso.js
```

`du -sm assets`

```text
10	assets
```