Rodada 4: acabamento final. Corrija só o que está abaixo e preserve o resto. A rodada 3 acertou forro, vista, araucárias, terraço, degraus, porta e fluxo. As imagens anexadas mostram a referência e as capturas atuais. Sua área isolada não abre navegador; eu testo depois.

Leia `AGENTS.md`, `processo/BRIEFING.md` e `src/`.

## Corrija
1. **Pedra (prioridade).** Passou do ponto: agora está branco-acinzentada e parece tijolo pintado. Na `sala-vazia.jpg` e na `chale-porta-amarela.jpg` ela é arenito cor de areia quente, bege e mel, com alguns blocos rosados, rejunte cinza médio bem visível e superfície rústica. Blocos com cerca de 40 a 45 cm por 16 a 18 cm, um pouco maiores que agora. Vale para parede, coluna, parapeito, mureta, degrau de contorno e fachada do terraço.
2. **Cadeiras de jantar e poltrona.** O tecido parece lã grossa e está claro demais. Use taupe médio, trama fina, normal bem discreta, e a repetição da textura bem menor. Mantenha a forma nova.
3. **Piso.** Está roxo-acinzentado. Volte para o cobre escuro quente, mantendo os reflexos das janelas.
4. **Forro.** Mantenha o tom de mel, com um pouco menos de saturação e réguas mais estreitas, para ficar mais perto da foto.
5. **Maçaneta da porta amarela.** Hoje são duas peças pretas soltas. Faça espelho vertical preto com alavanca horizontal, como na foto do chalé.
6. **Rótulo inferior das estações concluídas.** Ele está mostrando o texto das telas ("$ git init · $ git status", "Toda segunda? — Relatório de vendas"). Mostre `Estação NN · Concluída` e a `fala_conclusao`, ou a próxima ação. Telas 3D e rótulo HTML são coisas separadas.
7. **Estação 2.** O celular precisa ser o objeto principal: maior, em suporte, de frente para a câmera, sem o abajur e as lanternas formando um amontoado atrás dele. Concluída, a conversa fica legível no enquadramento da estação.
8. **Estação 1.** Concluída, o terminal mostra 5 ou 6 linhas com a aparência de um terminal real, usando comandos das aulas e exercícios da sequência 1, em tamanho legível a 2,4 m.
9. **Estação 3.** Quadro maior e letras maiores: os cartões têm de ser lidos no enquadramento. A faixa do portão continua visível.
10. **Foco no canvas.** O contorno amarelo em volta da tela inteira fica feio. Use indicador discreto e mantenha foco visível nos controles.
11. **`limpar()` durante a entrada.** Uma captura feita 2,5 s depois de `limpar()`, chamado 5 s após entrar, saiu toda preta em renderização por software (cerca de 2 quadros por segundo). Revise a transição de entrada: ela não pode depender da contagem de quadros, nem deixar cobertura escura presa, nem ser reiniciada por `limpar()`. A sala precisa aparecer mesmo a 1 quadro por segundo, usando tempo real.
12. **Desempenho.** Mantenha em desktop no máximo 350 draw calls e 700 mil triângulos, e no celular metade disso. Junte geometrias repetidas com `InstancedMesh` ou merge quando fizer diferença. Exponha `window.__curso.info()` com `{drawCalls, triangulos, texturas, qualidade, pixelRatio}`.
13. **Qualidade automática.** Se a média ficar abaixo de 28 fps por alguns segundos, reduza sombra, reflexo e resolução por etapas, sem trocar a cena de forma brusca.

## Verificação obrigatória
1. `python3 tools/validar_conteudo.py`
2. `node --check` em cada `.js` de `src/`
3. `du -sm assets`

Na resposta final, liste o que mudou por item, cole as saídas reais e escreva "não verificado no navegador" para o que depende de captura.
