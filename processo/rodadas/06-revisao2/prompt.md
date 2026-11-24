Rodada 6: corrija o que o segundo revisor independente encontrou. Nota 7, reprovado. Preserve fluxo, API de teste, modo sem 3D, vista, araucárias, porta, terraço e posições de `src/planta.js`. Sua área isolada não abre navegador; eu testo depois.

Leia `AGENTS.md`, `processo/BRIEFING.md`, `src/`, `conteudo/curso.json`. Não edite `conteudo/base.json`.

## Defeitos de uso
1. **Vídeo:** ao abrir outro vídeo, pause todos os demais. Ligue legendas em português: busque o `vtt` da base com `fetch` somente depois do clique, crie um `Blob` e use como `<track default>`, sem `crossorigin` no vídeo. Se falhar, o vídeo toca sem legenda e sem erro.
2. **Etiqueta da próxima estação:** nunca quebra palavra (`white-space: nowrap`), fica sempre inteira na tela e não cobre rótulos, botões nem o objeto da estação atual. Quando a pessoa estiver numa estação, mostre a próxima só na barra inferior e esconda a etiqueta flutuante. Vale em 1366x768, 360x740 e 740x360.
3. **Entrada em 740x360:** os dois botões aparecem sem rolar. Reorganize em duas colunas ou reduza o título.
4. **Área de toque no celular:** todo controle com pelo menos 44 px de altura, inclusive "Ir até lá", "Visão geral", "Ler o fecho", "Abrir aula completa", links de materiais e "Como a casa foi feita".
5. **Clique no objeto:** clicar ou tocar no notebook, celular, quadro ou telas de uma estação próxima abre o painel. Longe, leva até lá. Cursor indica o que é clicável.
6. **Porta fechada:** encostar nela com o teclado mostra "Porta fechada. Faltam N estações." uma vez, sem repetir sem parar.
7. **Barra:** quando falta uma, "Falta o Terminal". As frases de chegada viram tema da estação, sem soar como ordem a cumprir na casa: use um rótulo "Nesta estação" e redação coerente.
8. **Como se mover no celular:** fale de setas, arrastar para olhar e tocar no chão ou numa estação. Em desktop, adicione Q e E para girar.
9. **Cabeçalho em celular deitado:** recolha ou reduza para dar espaço à cena.
10. **Tabela de exercício em 360 px:** indique que dá para deslizar.
11. **Glossário:** não sublinhe em títulos e rótulos. Só no texto corrido. Com a definição aberta, o primeiro Esc fecha a definição e o segundo fecha o painel.

## Texto
12. **`objeto` da estação Terminal** e demais: o texto precisa bater com o que aparece. A tela apagada mostra "em espera"; a concluída mostra comandos de navegação e do agente coerentes com a sequência 1, incluindo `cd`, `dir` e `git status`.
13. **Redes:** "Fonte na tela" deve parecer uma fonte citada no reel, sem o código "Redes · E3". Título legível, sem passar sobre o sol.
14. **Nomes:** explique uma vez, na abertura e no mapa, que cada **estação** é uma **sequência** ou **degrau** do curso. Nos exercícios e aulas o texto original continua.
15. **`ajuda_exercicios`:** complete com informação tirada das aulas de `fonte/cursos/`, com links que existam na base:
    - `s3-e2`: como obter o arquivo e em qual terminal esses comandos funcionam; veja a aula da fila caseira e diga o caminho certo no Windows.
    - `s2-e3`: o que precisa estar instalado (`git`, `python3`), o que é o briefing e o `doc/intelecto.md`.
    - `s2-e5`: OpenRouter e Ollama.
    - `s3-e5`: `/promoavatar`.
    - `s4-e3`: ARCKHÉvox, transcritor local e `checar.py`.
    Inclua esses termos no glossário. Se a fonte não explicar algo, diga só o que ela permite afirmar.

## Materiais: fidelidade às fotos
16. **Pedra nova:** a parede ainda parece bloco regular de jogo. Use `image_gen` com `chale-porta-amarela.jpg` e `sala-vazia.jpg` como referência e gere um novo `assets/ambiente/pedra.jpg`, plano e frontal: arenito rústico cor de areia, blocos de comprimentos e alturas variados, bordas irregulares, argamassa cinza grossa e saliente, poucos blocos levemente rosados. Sem sombra direcional. Torne repetível e refaça normal e rugosidade com `processo/gerar_mapas.py`, usando repetição de cerca de 2,4 m de largura. Simplifique o shader da pedra em `src/luz.js` para usar essa textura com correção de cor leve, sem apagar a variação natural.
17. **Piso:** marrom acobreado mais claro e quente como na foto, com brilho suave; hoje está vinho.
18. **Forro e caibros:** menos laranja-avermelhado, puxando para mel e castanho, mantendo réguas e frestas.
19. **Lareira:** adicione volume: base com abertura, grelha, aro metálico, cone com emendas e chaminé com reflexo.

## Verificação obrigatória
1. `python3 tools/validar_conteudo.py`
2. `node --check` em cada `.js` de `src/`
3. `du -sm assets`
4. Abra a textura nova e uma repetição 2 x 2.

Na resposta final, liste por item o que mudou, cole as saídas reais e escreva "não verificado no navegador" para o que depende de captura.
