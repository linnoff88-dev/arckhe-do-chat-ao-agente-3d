As 13 correções da rodada 4 foram aplicadas. O conteúdo passou na validaçêo, e os dez arquivos JavaScript passaram na checagem de sintaxe.

| Item | O que mudou |
|---|---|
| 1. Pedra | O arenito ganhou tons de areia, bege e mel, com alguns blocos rosados, relevo rústico e rejunte cinza médio. A escala média é de 43 × 17,5 cm nas paredes, colunas, parapeitos, muretas, contornos dos degraus e fachada do terraço. |
| 2. Estofados | Cadeiras e poltrona receberam taupe médio, trama de baixo contraste e relevo discreto. A repetiçêo da textura caiu de 2,2 para 0,85. |
| 3. Piso | O piso voltou ao cobre escuro quente, com os reflexos das janelas. |
| 4. Forro | O tom de mel perdeu um pouco de saturaçêo, e as réguas ficaram cerca de 24% mais estreitas. |
| 5. Maçaneta | A porta ganhou espelho vertical preto e alavanca horizontal conectada nas duas faces. O ferrolho parte da base do espelho e entra no batente. |
| 6. Rótulo inferior | As quatro estações concluídas mostram `Estaçêo NN · Concluída` e a `fala_conclusao` do curso. |
| 7. Estaçêo 2 | O celular ficou maior, em suporte inclinado e voltado para a câmera. Abajur e lanternas ficaram fora do eixo da conversa. |
| 8. Estaçêo 1 | O terminal mostra seis linhas com comandos Git, saída dos arquivos do exercício e cursor. O enquadramento aproxima a tela mantendo o ponto de visita a cerca de 2,4 m. |
| 9. Estaçêo 3 | O quadro passou a 3,18 × 2,22 m. Os dez cartões têm letras maiores em duas linhas. A faixa do portêo cabe no enquadramento de desktop e celular no teste de projeçêo. |
| 10. Foco | O foco do canvas aparece como um traço na placa do local. Os controles mantêm o contorno de teclado. |
| 11. Entrada e `limpar()` | O movimento de entrada dura 750 ms pelo relógio. `limpar()` desenha a sala imediatamente na posiçêo de chegada. As mudanças de resoluçêo acontecem antes do desenho do quadro. |
| 12. Desempenho | Os cartões compartilham uma textura e se movem em lote. A geometria de ferro do terraço também foi agrupada. `window.__curso.info()` expõe `drawCalls`, `triangulos`, `texturas`, `qualidade` e `pixelRatio`. |
| 13. Qualidade automática | A cada janela de três segundos com média abaixo de 28 fps, a qualidade desce uma etapa. Primeiro reduz as sombras, depois simplifica gradualmente o reflexo e, se necessário, reduz a resoluçêo. |

**Verificaçêo local da cena.** A simulaçêo a 1 fps passou com `limpar()` durante a carga e cinco segundos após entrar. A contagem geométrica das 16 combinações de progresso, incluindo sombras, fundo e paisagem, ficou dentro dos tetos pedidos.

| Perfil | Limite superior de chamadas | Limite superior de triângulos |
|---|---:|---:|
| Desktop | 211 de 350 | 275.480 de 700.000 |
| Celular | 155 de 175 | 196.386 de 350.000 |

**Acabamento sob a iluminaçêo final, legibilidade nas capturas, foco visual, captura após `limpar()` e desempenho real da GPU** — nêo verificado no navegador.

**Saídas das verificações obrigatórias**

```text
$ python3 tools/validar_conteudo.py
OK: 4 estações, 37 aulas, 23 exercícios, 16 links conferidos
```

O laço imprimiu `OK` após cada `node --check` retornar código 0.

```text
OK src/casa.js
OK src/controles.js
OK src/dados.js
OK src/estacoes.js
OK src/geometria.js
OK src/interface.js
OK src/luz.js
OK src/moveis.js
OK src/principal.js
OK src/progresso.js
```

```text
$ du -sm assets
10	assets
```