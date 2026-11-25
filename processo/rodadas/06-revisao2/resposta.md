Implementei as correções dos 19 itens da rodada 6. O validador confirmou **4 estações, 37 aulas e 23 exercícios**. Os 12 arquivos JavaScript passaram na checagem de sintaxe. `conteudo/base.json` e `src/planta.js` estêo sem diferenças no Git.

**Nêo verificado no navegador:** o enquadramento em 1366×768, 360×740 e 740×360, o toque em aparelho real, a reproduçêo dos arquivos remotos e a aparência dos materiais sob a luz da cena. As verificações de interaçêo abaixo usaram DOM simulado e a geometria real do Three.js.

### Correções por item

1. **Vídeo.** Abrir ou retomar um vídeo pausa os demais. O clique inicia a busca do VTT e cria uma faixa padrêo em português por `Blob`, sem `crossorigin` no vídeo. A falha da legenda deixa o MP4 tocar.
2. **Etiqueta.** O nome fica em uma linha. A posiçêo considera a largura real da etiqueta e o espaço entre os controles. Ao chegar a uma estaçêo, a indicaçêo da próxima fica só na barra inferior.
3. **Entrada em 740×360.** Texto e formulário passaram a ocupar duas colunas, com os dois botões juntos na coluna da direita.
4. **Toque.** Os controles móveis receberam altura mínima de 44 px, incluindo ações da barra, termos do glossário, links de aulas e materiais e “Como a casa foi feita”.
5. **Objetos.** De perto, clicar no notebook, celular, quadro ou telas abre o painel. De longe, inicia o deslocamento. O cursor indica os alvos clicáveis. O teste com raios do Three.js acertou os quatro objetos a partir das visitas definidas na planta.
6. **Porta.** Encostar pelo teclado informa quantas estações faltam. Manter a tecla pressionada produz um único aviso. Afastar-se permite um novo aviso no contato seguinte.
7. **Barra.** A chegada apresenta o tema sob “Nesta estaçêo”. Quando só o Terminal está pendente, aparece “Falta o Terminal”.
8. **Movimento.** A ajuda móvel explica as setas, o arraste para olhar e o toque no chêo ou numa estaçêo. No desktop, Q e E giram em sentidos opostos e Enter abre a estaçêo à frente.
9. **Cabeçalho.** No celular deitado, a barra superior passa a 46 px e conserva os controles de navegaçêo.
10. **Tabela.** Em telas estreitas, o exercício exibe “Deslize a tabela para ver todas as colunas”.
11. **Glossário.** As definições aparecem apenas no texto corrido. O primeiro Esc fecha a definiçêo e o segundo fecha o painel.
12. **Objetos e estados.** As quatro descrições acompanham o que aparece na cena. O notebook mostra “em espera” antes da conclusêo e depois exibe `cd`, `dir`, `git status` e `codex`.
13. **Redes.** Os reels citam o ARCKHÉ AI e o título da aula. O título do reel e o sol ocupam áreas distintas.
14. **Nomes.** A abertura e o mapa explicam a relaçêo entre estaçêo, sequência e degrau. Aulas e exercícios continuam usando o texto original.
15. **Ajuda dos exercícios.** Completei `s3-e2`, `s2-e3`, `s2-e5`, `s3-e5` e `s4-e3`, com os termos no glossário e cinco links conferidos na base. Para a fila no Windows, usei o caminho documentado no curso: abrir o cmd, entrar por SSH na VPS Linux e executar ali o bloco copiável com `git clone` e `cd jornada-agentes`.
16. **Pedra.** Gerei o arenito com `image_gen` a partir das duas fotos. O pedido descreveu uma amostra frontal de 2,4 m, com arenito cor de areia, fiadas irregulares, algumas pedras rosadas, argamassa cinza saliente e luz difusa. Refiz normal e rugosidade, retirei a recoloraçêo uniforme do shader e abri tanto a [textura final](../../../assets/ambiente/pedra.jpg) quanto a [repetiçêo 2 × 2](/tmp/r6-pedra-2x2.jpg).
17. **Piso.** Clareei o pigmento para marrom acobreado e aumentei a rugosidade para suavizar o reflexo.
18. **Forro e caibros.** Ajustei o lambri para mel e os caibros para castanho, preservando os veios, as réguas e as frestas.
19. **Lareira.** Modelei a boca aberta com fundo refratário, laterais e grelha. A coifa ganhou aro e emendas, e a chaminé recebeu chapa e anéis que refletem a luz das janelas.

### Saídas reais

`python3 tools/validar_conteudo.py` e conferência adicional dos links de ajuda:

```text
OK: 4 estações, 37 aulas, 23 exercícios, 15 links conferidos
OK: 5 de 5 links de ajuda conferidos nas aulas da base.
```

`node --check` por arquivo. O laço imprimiu `OK` após cada retorno com código zero:

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

`du -sm assets`:

```text
8	assets
```

Geraçêo dos mapas:

```text
pedra.jpg                      1024 x 1024    498495 bytes
pedra-normal.jpg               1024 x 1024    669767 bytes
pedra-rugosidade.jpg           1024 x 1024    241968 bytes
```

Ensaios locais de interaçêo:

```text
OK: clique no objeto abriu as quatro estações a partir das visitas da planta.
OK: clique distante no quadro pediu deslocamento até Filas.
OK: um aviso por contato com a porta; Q e E giraram em sentidos opostos.
OK: notebook em espera e concluído, porta fechada e passagem liberada.
DOM simulado: entrada, mapa, retorno do foco, ações das 4 estações e fecho OK.
Página sem 3D: progresso, 37 objetivos, 23 exercícios numerados, 11 ajudas e glossário OK.
Página do processo: 7 rodadas de dados.json renderizadas em DOM simulado.
Eventos de teclado no DOM: painel e campo protegidos; setas após fechar, WASD após Ir até lá e foco por Tab OK.
OK: rótulos sem glossário, Esc em duas etapas e “Falta o Terminal”.
OK: VTT após o clique, track PT com Blob, reproduçêo exclusiva e falha de legenda silenciosa (DOM simulado).
```