Rodada 7: últimos ajustes antes de publicar. O revisor aprovou, com os pontos abaixo. Faça só isto, com mudanças pequenas, e preserve o resto. Sua área isolada não abre navegador.

Leia `AGENTS.md`, `src/` e `conteudo/curso.json`. Não edite `conteudo/base.json`. Não gere imagens.

1. **Honestidade na entrada (prioridade):** a fonte diz que é preciso "um computador, uma assinatura do Claude ou do ChatGPT". Mostre isso na tela de entrada, em uma linha curta junto de "curso grátis", e na abertura. Em `s3-e2`, deixe claro antes do exercício quando a fila caseira pede um servidor Linux ou VPS e o que a aula oferece como caminho.
2. **Caminhada:** depois de "Ir até lá", enquanto a pessoa anda, a barra mostra "Indo até Terminal" sem o botão "Abrir estação". O botão só aparece na chegada. Abrir o mapa ou um painel durante a caminhada não pode deixar a pessoa parada com a tela dizendo que chegou.
3. **Vão da porta aberta:** clicar em qualquer ponto do vão leva ao terraço, mesmo que o raio atinja a mureta ao fundo.
4. **Terraço:** reconheça o terraço assim que a pessoa passar pela porta, e mostre o fecho.
5. **Toque:** mensagens em dispositivo de toque dizem "Toque". O cursor de mão só aparece em piso alcançável.
6. **Celular deitado:** setas e barra ficam sobrepostas à cena com fundo translúcido, para a casa ocupar a tela. Em pé, deixe as setas menores e mais perto da borda, para cobrirem menos o objeto da estação.
7. **`ajuda_exercicios` da estação 1:** usando as aulas em `fonte/cursos/terminal/aulas/`, mostre os comandos em `s1-e1`; diga como criar os arquivos em `s1-e2` e `s1-e5`; explique em uma frase `git init`, `git add` e `git commit` em `s1-e4`, com link para a aula.
8. **Glossário:** inclua repositório, commit, script, `.env`, bot, ARCKHÉccbot, INTELECTO e OSWork, com explicação tirada das aulas ou da página.
9. **Vídeo com falha:** a mensagem e o link ficam visíveis junto do player, sem precisar rolar; esconda o player quebrado.
10. **Pedra:** reduza o laranja. Tom bege-areia levemente acinzentado, como `chale-porta-amarela.jpg`, sem perder a variação da textura. Nos pilares, alinhe as fiadas entre as faces quando for simples.
11. **Câmera:** mantenha distância mínima de 45 cm das paredes, para a tela não encher de textura borrada. Afaste o ponto inicial do quadro de Filas se ele estiver a menos de 1,5 m.
12. **Por onde começar:** cada item leva direto ao curso citado ou à estação, com rótulo claro.
13. **Página do processo:** troque tokens por tempo de cada rodada e o que ela fez, em linguagem simples.

## Verificação obrigatória
1. `python3 tools/validar_conteudo.py`
2. `node --check` em cada `.js` de `src/`

Cole as saídas reais e escreva "não verificado no navegador" para o que depende de captura.
