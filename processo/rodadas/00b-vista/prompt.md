Rodada 0b: crie a vista do vale em alta resoluçêo. Nêo escreva código do site.

`assets/ambiente/vale-panorama.jpg` está aprovado, mas tem 1774 x 887, pouco para a vista pelas janelas. Crie `assets/ambiente/vale-faixa.jpg`, uma faixa de 360 graus com o mesmo vale e o mesmo sol.

Contrato do arquivo:
- Cobre os 360 graus na horizontal, com a mesma origem de longitude do panorama: a coluna x da faixa corresponde à mesma fraçêo de x do panorama.
- Cobre na vertical da elevaçêo +24 graus (topo) até -36 graus (base). Em projeçêo equiretangular, sêo as linhas de 148 a 443... calcule pela altura: topo = (90-24)/180, base = (90+36)/180.
- Largura de 6000 a 7000 px, proporçêo 6:1, JPEG qualidade 85, até 3,5 MB.
- As bordas esquerda e direita continuam uma na outra.

Como fazer:
1. Recorte a regiêo do panorama em 5 ou 6 trechos sobrepostos em cerca de 20%, com Pillow.
2. Use `image_gen` em cada trecho como imagem de referência, pedindo a mesma composiçêo, com as mesmas serras, sol, nuvens e posiçêo das árvores, apenas com muito mais detalhe de folhagem e relevo. Sem casas, pessoas, estradas, texto ou marca.
3. Registre cada trecho de volta sobre o panorama ampliado e misture nas sobreposições com máscara suave. Se um trecho divergir, corrija cor e brilho ou gere de novo. Crie `processo/montar_faixa.py` para essa montagem.
4. Confira a imagem inteira, cada emenda ampliada e a emenda lateral. Nêo pode haver sol duplicado, serra cortada ou mudança brusca de cor.

Nêo altere nenhum outro arquivo de `assets/ambiente/`. Outro processo está construindo o site ao mesmo tempo: nêo mexa em `index.html`, `src/` nem `conteudo/`.

Na resposta final, informe dimensões e tamanho com a saída real de um comando e diga o que nêo ficou como pedido.
