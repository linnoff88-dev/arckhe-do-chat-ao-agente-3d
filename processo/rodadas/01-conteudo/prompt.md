Rodada 1: escreva os textos do curso. Não crie o site nesta rodada.

Leia `AGENTS.md`, `processo/BRIEFING.md`, `conteudo/base.json`, `fonte/do-chat-ao-agente.html`, as regras de texto e de chamada do design INEMA.

`conteudo/base.json` já traz, sem reescrita, as aulas, os exercícios, os vídeos e os cards. O site vai ler a base diretamente. Você escreve só a camada que costura o curso dentro da casa.

Crie `conteudo/curso.json` com:
- `titulo`: "Do Chat ao Agente 3D"
- `subtitulo`: uma frase com a promessa.
- `chamada`: `dor_ou_desejo`, `quem`, `nucleo`, `por_que_importa`, `metodo`, `formato`, seguindo `regras/chamada.md`. O `nucleo` abre com o ganho de quem assiste, em "você".
- `abertura`: `titulo`, `texto` (a virada: no chat você é o motorista; a virada é mudar de lugar) e `sem_milagre` (o aviso honesto da fonte: quem pula a sequência 1 empaca).
- `por_onde_comecar`: os 4 pontos da tabela da fonte, com `situacao`, `comece_por`, `estacao` (1 a 4).
- `estacoes`: 4 itens na ordem da base, com:
  - `numero`, `id` (igual à base), `nome` (Terminal, Jarvis, Filas, Redes), `titulo`.
  - `por_que`: 2 frases fiéis à fonte.
  - `ganho`: o que a pessoa terá ao concluir, verificável.
  - `objeto`: 1 frase ligando a estação ao objeto da sala descrito no briefing.
  - `fala_entrada` e `fala_conclusao`: frases curtas para ler na tela; a de conclusão diz o que acendeu e qual é o próximo passo.
  - `materiais`: lista com `titulo`, `tipo`, `detalhe`, `url`, escolhida entre os `cards_pagina` daquela sequência, com a URL exata. Inclua todos os cursos e projetos; deixe de fora só o card de exercícios, que já estão dentro da estação.
  - Não copie `aulas`, `exercicios` nem `video`: o site usa a base.
- `fecho`: `titulo`, `texto`, `pergunta` (uma pergunta de verdade sobre o que a pessoa vai delegar primeiro) e `cta` contendo exatamente "grátis no inema.club, direto na internet".
- `ui`: todos os rótulos fixos da interface em português.

Crie `conteudo/roteiro.md` com o percurso da pessoa, da entrada ao terraço, indicando o que acontece na tela em cada momento.

Regras de texto: frases curtas, voz ativa, verbo concreto, sem hype. Fique só no curso gratuito. Todo fato vem da fonte ou da base.

Verificação obrigatória antes de responder: rode `python3 tools/validar_conteudo.py` até passar e cole a saída real.
