Implementei a casa 3D e o modo de leitura com o mesmo progresso. As quatro estações reúnem as **37 aulas e os 23 exercícios** da fonte. Cada estação concluída acende suas telas, velas e degrau. Com as quatro concluídas, a porta amarela abre o caminho ao terraço.

**Arquivos da rodada**

- [Entrada e sala](../../../index.html), [estilos](../../../src/estilo.css) e [página do processo](../../../processo/index.html).
- Dez módulos JavaScript em `src/`, listados na verificação abaixo.
- Fontes locais `assets/fontes/Inter.woff2`, `Sora.woff2` e `OFL.txt`.
- [FALHAS.md](../../../FALHAS.md), com a correção da rota que podia cortar a quina de um móvel.

**Saídas das verificações obrigatórias**

```text
$ python3 tools/validar_conteudo.py
OK: 4 estações, 37 aulas, 23 exercícios, 16 links conferidos

$ for f in src/*.js; do node --check "$f" || exit; echo "OK $f"; done
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
7	assets
```

**Testes funcionais locais** confirmaram a persistência do nome e das marcações, o retorno à leitura quando o WebGL falha e a criação do vídeo somente após o clique. Duas saídas observadas:

```text
Fecho: {"modo":"sem-3d","estacaoAtual":null,"feitas":4,"exerciciosFeitos":23,"portaAberta":true,"terracoLiberado":true,"webgl":false,"fps":0}
Geometria: 25 rotas internas e 5 rotas ao terraço sem atravessar colisores; porta fechada bloqueia a saída.
```

**não verificado no navegador.** A área isolada bloqueou o servidor HTTP local e a inicialização do Chromium headless. Trechos das saídas:

```text
PermissionError: [Errno 1] Operation not permitted
FATAL:content/browser/sandbox_host_linux.cc:41] Check failed: . shutdown: Operation not permitted (1)
```

Conferi o enquadramento da sala e do terraço por projeção local da geometria. Permanecem sem confirmação as capturas reais em 1440 e 360 px, o acabamento das sombras e reflexos no WebGL, a reprodução remota dos vídeos e a meta de 45 FPS.