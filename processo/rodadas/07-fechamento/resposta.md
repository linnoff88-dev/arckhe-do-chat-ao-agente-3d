Apliquei os 13 ajustes da rodada 7. A entrada e a abertura agora informam que o curso é grátis e que os exercícios exigem computador e assinatura do Claude ou do ChatGPT. Em Filas, a ajuda explica quando usar um servidor Linux ou VPS e oferece a simulaçêo da aula para ensaiar no navegador.

Os testes com a geometria da casa confirmaram que **“Abrir estaçêo” aparece só na chegada**. Abrir e fechar o mapa ou um painel pausa e retoma a caminhada. O clique no vêo funcionou inclusive quando o raio atingiu a mureta ao fundo. A pé e na caminhada guiada, o fecho apareceu a menos de 10 cm da soleira. O ponto inicial ficou a **1,54 m** da área do quadro de Filas.

A página do processo mostra o tempo e o trabalho das oito rodadas já medidas. A descriçêo da rodada 7 aparecerá quando o orquestrador registrar sua duraçêo.

**Verificaçêo obrigatória**

```text
$ python3 tools/validar_conteudo.py
OK: 4 estações, 37 aulas, 23 exercícios, 15 links conferidos
```

`node --check` terminou com código zero em cada arquivo. O laço imprimiu uma confirmaçêo após cada sucesso.

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

**nêo verificado no navegador** — tom da pedra e alinhamento visual das fiadas, enquadramento da câmera, controles nas duas orientações do celular, toque em aparelho real e visibilidade do aviso de vídeo sem rolagem. O teste em DOM simulado confirmou que a falha oculta o player e exibe a mensagem e o link.