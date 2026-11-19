Rodada 0: crie as imagens do ambiente. Não escreva código do site nesta rodada.

Leia `AGENTS.md` e a seção "O ambiente" de `processo/BRIEFING.md`. As fotos anexadas são o lugar real. Use a ferramenta de geração de imagens (`image_gen`) com elas como referência.

Gere, confira e salve em `assets/ambiente/`, em JPEG qualidade 88:

1. `vale-panorama.jpg`: panorama de 360 graus do vale visto do alto da serra, projeção equiretangular 2:1, no maior tamanho disponível. Fim de tarde dourado, sol baixo, serras cobertas de mata como nas fotos, araucárias dispersas, neblina leve entre as serras, céu com nuvens altas. Horizonte exatamente na metade da altura. Metade inferior é a mata descendo. Sem casas, pessoas, estradas, texto ou marca. As bordas esquerda e direita precisam continuar uma na outra.
2. `pedra.jpg`: textura plana e frontal dos blocos de arenito bege e rosado com rejunte cinza, como as paredes das fotos, sem sombra direcional.
3. `madeira-forro.jpg`: textura plana e frontal do lambri cor de mel do forro, em réguas.
4. `piso.jpg`: textura plana do piso escuro acobreado, sem reflexos pintados.
5. `kilim.jpg`: tapete kilim da mureta do terraço, visto de frente, plano, preenchendo a imagem.
6. `mosaico.jpg`: tampo de pastilhas coloridas da mesa do terraço, visto de cima, plano, preenchendo a imagem.
7. `concreto.jpg`: concreto aparente cinza da viga, plano.
8. `tecido-taupe.jpg`: estofado taupe das cadeiras, plano.

Depois, com Python e Pillow/NumPy disponíveis aqui (sem instalar nada):
- Crie `processo/gerar_mapas.py` e rode: deixe as texturas 2 a 8 repetíveis nas duas direções, com 1024 x 1024 ou 2048 x 2048, e gere para `pedra`, `madeira-forro`, `piso` e `concreto` os mapas `<nome>-normal.jpg` e `<nome>-rugosidade.jpg`.
- Faça a costura lateral do panorama com mistura suave nas bordas e garanta proporção exata 2:1.

Confira cada imagem abrindo o arquivo. Refaça a que tiver texto, pessoa, casa, emenda visível, perspectiva em textura plana ou que não pareça o lugar das fotos.

As imagens geradas ficam na pasta de imagens do Codex; copie as aprovadas para `assets/ambiente/`. Não copie as fotos de referência para `assets/`.

Na resposta final, liste cada arquivo com dimensões e tamanho (saída real de um comando) e diga o que não ficou como pedido.
