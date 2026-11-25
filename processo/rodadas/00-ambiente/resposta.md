Gerei o panorama, as sete texturas e os oito mapas em [assets/ambiente/](../../../assets/ambiente). Os **16 JPEGs** estêo em qualidade 88 e somam **5.469.947 bytes**.

Abri cada arquivo final. Na repetiçêo 2 × 2, os rejuntes, as réguas de madeira e o desenho do kilim continuam entre as peças sem emenda visível. Conferi o panorama com a costura deslocada para o centro. O vale e o céu continuam de um lado ao outro, sem casas, estradas, pessoas ou texto visíveis.

| Arquivo | Dimensões (px) | Tamanho (bytes) |
|---|---:|---:|
| `vale-panorama.jpg` | 1774 × 887 | 463.624 |
| `pedra.jpg` | 1024 × 1024 | 497.654 |
| `pedra-normal.jpg` | 1024 × 1024 | 680.824 |
| `pedra-rugosidade.jpg` | 1024 × 1024 | 244.022 |
| `madeira-forro.jpg` | 1024 × 1024 | 333.327 |
| `madeira-forro-normal.jpg` | 1024 × 1024 | 267.903 |
| `madeira-forro-rugosidade.jpg` | 1024 × 1024 | 139.135 |
| `piso.jpg` | 1024 × 1024 | 235.461 |
| `piso-normal.jpg` | 1024 × 1024 | 139.123 |
| `piso-rugosidade.jpg` | 1024 × 1024 | 148.216 |
| `kilim.jpg` | 1024 × 1024 | 538.718 |
| `mosaico.jpg` | 1024 × 1024 | 469.020 |
| `concreto.jpg` | 1024 × 1024 | 329.810 |
| `concreto-normal.jpg` | 1024 × 1024 | 362.348 |
| `concreto-rugosidade.jpg` | 1024 × 1024 | 149.402 |
| `tecido-taupe.jpg` | 1024 × 1024 | 471.360 |

**Limite da geraçêo.** Pedi o panorama na maior resoluçêo disponível. O `image_gen` devolveu 1774 × 887, e preservei essa resoluçêo nativa, com proporçêo exata de 2:1. A linha de referência do horizonte está a 50% da altura, com as cristas variando naturalmente ao redor dela.

Executei [gerar_mapas.py](../../../processo/gerar_mapas.py) e conferi dimensões, tamanhos e qualidade diretamente nos JPEGs gravados. O validador do projeto também retornou `OK: 4 estações, 37 aulas, 23 exercícios, 16 links conferidos`.