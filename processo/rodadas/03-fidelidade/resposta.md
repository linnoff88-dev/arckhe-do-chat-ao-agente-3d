Rodada 3 implementada. Os testes confirmaram que a porta e os quatro degraus têm linha de visão livre desde a entrada. As câmeras das estações ficaram entre **2,33 e 2,47 m** dos alvos. O conteúdo passou na validação e `assets/` ocupa **10 MiB** do limite de 25.

**Acabamento visual, legibilidade nas capturas e desempenho em Chromium — não verificado no navegador.**

### Mudanças por item

| Item | Alteração |
|---|---|
| 1. Forro | Lambri em mel claro, réguas no sentido da inclinação, caibros escuros e luz rebatida sob o telhado. |
| 2. Pedra | Arenito bege-areia com variação rosada e rejunte cinza. Os blocos têm cerca de 35 × 13,5 cm. As fiadas se alinham entre paredes, colunas, parapeitos e mureta. |
| 3. Piso | Cerâmica acobreada escura com reflexo suave que acompanha a posição da câmera e os caixilhos das janelas. |
| 4. Concreto | Vigas em cinza mais frio, com textura e rugosidade de concreto aparente. |
| 5. Luz | Mais luz ambiente na entrada e sombras de contato sob os móveis e junto às paredes. |
| 6. Vista | Reposicionei o cilindro do vale e elevei o horizonte em 8°, preservando a proporção angular da imagem. |
| 7. Pôr do sol | A luz aquece e o contraste aumenta com o progresso. A mata conserva detalhe nas sombras. |
| 8. Árvores | Duas araucárias e um pinheiro gerados com `image_gen`, recortados em Python e aplicados em planos que acompanham a câmera. Abri os três sobre fundo claro para conferir as bordas. |
| 9. Cadeiras de jantar | Assento macio, encosto alto arredondado, tecido taupe claro e pés escuros inclinados. O teste encontrou **zero triângulos com normal invertida** nos estofados. |
| 10. Mesa | Base branca única e escalonada, com o vidro chanfrado apoiado diretamente sobre ela e borda esverdeada. |
| 11. Poltrona e mesinha | Jarvis passou para outra janela. A lanterna ficou no parapeito e liberou a frente do celular. |
| 12. Terraço | Ferro branco esmaltado, arabescos mais finos e volutas no encosto. O kilim acompanha o topo e as duas faces da mureta, com dobras no caimento. |
| 13. Câmeras | Reenquadrei as quatro estações e ajustei o campo de visão em retrato. A geometria de cada estação coube no quadro no teste de projeção. |
| 14. Terminal | Tela escura com LED âmbar em espera. Ao concluir, aparecem `git init` e `git status`. |
| 15. Jarvis | Celular elevado no suporte. Ao concluir, a conversa sobre o relatório de vendas aparece na tela e também na interface para leitura à distância. |
| 16. Filas | Dez cartões com tarefas da fonte passam de “Na fila” para “Feito”. O quadro indica “Portão · aprovar antes de publicar”. Todos os cartões passaram no teste de visibilidade. |
| 17. Redes | Três telas pretas com LED em espera. Ao concluir, cada monitor alterna três reels locais, com temas de imóveis, agro e educação. |
| 18. Degraus e porta | A chegada enquadra a escada e a porta amarela de tábuas, com moldura, maçaneta preta e trava. Cada conclusão acende uma borda âmbar. |
| 19. Câmera do terraço | Vista levemente descendente sobre mesa, mureta e vale. O beiral entra pelo alto à esquerda e a folha aberta fica fora do primeiro plano. |
| 20. Fachada | A vista de retorno mostra a parede de pedra, a janela e a face externa da porta, com travessas e maçaneta. |
| 21. Logo | Apliquei `mix-blend-mode: screen` ao logo do cabeçalho. |
| 22. Entrada | “Entrar na casa” e “Fazer sem 3D” continuam com a mesma classe, altura e distribuição de largura. |

`window.__curso.verPorta()` posiciona a câmera diante da escada no modo 3D. `window.__curso.abrirEstacao(n)` abre diretamente o painel da estação de 1 a 4.

### Saídas reais

```text
$ python3 tools/validar_conteudo.py
OK: 4 estações, 37 aulas, 23 exercícios, 16 links conferidos

$ for f in src/*.js; do node --check "$f" || exit 1; echo "OK $f"; done
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

$ du -sm assets
10	assets
```

```text
13 mapas de materiais abertos.
araucaria-adulta.webp: 768 × 1152, RGBA, 262884 bytes
araucaria-jovem.webp: 768 × 1152, RGBA, 315004 bytes
pinheiro.webp: 768 × 1152, RGBA, 427044 bytes
```

```text
Rotas entre entrada, quatro estações e porta: 36/36. Terraço bloqueado com a porta fechada.
Estados 0–4, LEDs, dez cartões e liberação do terraço: OK.
Estação 1: 2.47 m até o alvo, 1/1 telas ou cartões visíveis.
Estação 2: 2.41 m até o alvo, 1/1 telas ou cartões visíveis.
Estação 3: 2.33 m até o alvo, 10/10 telas ou cartões visíveis.
Estação 4: 2.38 m até o alvo, 3/3 telas ou cartões visíveis.
Porta fechada e quatro degraus visíveis da entrada e de verPorta().
Estofados: 30232 triângulos com área, 0 com normal invertida.
GLSL do piso, céu, faixa, vegetação e partículas: compilação e ligação OK.
API em DOM simulado: verPorta(), quatro painéis, troca para sem 3D, 23 exercícios e limpar() OK.
```