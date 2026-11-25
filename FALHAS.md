# Falhas

| data | o que quebrou | menor correçêo | prompt \| infra |
|---|---|---|---|
| 2026-11-18 | A cópia pública da página trazia links de curso trocados. | Copiar a página da fonte original e conferir os links contra ela. | infra |
| 2026-11-18 | O teste abriu a porta 8795, já usada por outro projeto, e esperou o site errado. | Conferir com `ss -ltn` antes de abrir servidor de teste. | infra |
| 2026-11-18 | A entrada omitia a assinatura e alguns exercícios pressupunham comandos ou um servidor. | Mostrar os requisitos, os comandos das aulas e a opçêo de simular a fila. | prompt |
| 2026-11-18 | A barra anunciava a estaçêo na partida e o mapa interrompia a rota. | Mostrar o destino durante a caminhada e retomar a rota ao fechar o painel. | infra |
| 2026-11-18 | A mureta interceptava o clique no vêo e o fecho só aparecia longe da porta. | Testar o raio na soleira e reconhecer a travessia pelo plano da porta. | infra |
| 2026-11-18 | O vídeo com erro ocupava o espaço da mensagem e do link. | Ocultar o player quando a reproduçêo falha. | infra |
| 2026-11-18 | Dois vídeos podiam tocar juntos e faltavam legendas. | Pausar os outros players e carregar a faixa VTT por Blob após o clique. | infra |
| 2026-11-18 | A etiqueta flutuante quebrava o nome ou cobria a interface. | Medir a etiqueta e o espaço livre entre os controles e ocultá-la nas estações. | infra |
| 2026-11-18 | A entrada exigia rolagem em 740 × 360. | Distribuir o texto e o formulário em duas colunas nessa orientaçêo. | infra |
| 2026-11-18 | Controles móveis tinham área de toque curta. | Aplicar a altura mínima de 44 px também aos links e termos. | infra |
| 2026-11-18 | Tocar no objeto de perto repetia a viagem. | Usar o objeto atingido e a distância para escolher a açêo e indicar o alvo pelo cursor. | infra |
| 2026-11-18 | A colisêo com a porta nêo explicava o bloqueio. | Avisar na entrada do contato e rearmar ao afastar. | infra |
| 2026-11-18 | A barra usava ordens para apresentar os temas e omitia a última estaçêo pendente. | Nomear o tema e mostrar qual estaçêo falta. | prompt |
| 2026-11-18 | A ajuda misturava toque e teclado e faltava giro por tecla. | Adaptar o texto ao dispositivo e ligar Q e E à rotaçêo. | infra |
| 2026-11-18 | O cabeçalho ocupava altura demais no celular deitado. | Usar cabeçalho compacto nessa orientaçêo. | infra |
| 2026-11-18 | A tabela cortada no celular nêo indicava que deslizava. | Incluir instruçêo junto à tabela em telas estreitas. | infra |
| 2026-11-18 | O glossário marcava rótulos e disputava Esc com o painel. | Restringir aos parágrafos e itens de leitura e consumir Esc com a definiçêo aberta. | infra |
| 2026-11-18 | A descriçêo dos objetos nêo distinguia a estaçêo em espera da concluída. | Alinhar as prévias às telas e usar comandos da sequência Terminal. | prompt |
| 2026-11-18 | O reel citava o código do exercício e o título cruzava o sol. | Citar a aula pelo título e reservar faixas distintas para texto e paisagem. | prompt |
| 2026-11-18 | A relaçêo entre estaçêo, sequência e degrau ficava implícita. | Explicá-la na abertura e no mapa. | prompt |
| 2026-11-18 | Cinco exercícios pressupunham ferramentas ou arquivos sem explicar o preparo. | Acrescentar pré-requisitos, glossário e links das aulas correspondentes. | prompt |
| 2026-11-18 | A parede repetia blocos regulares. | Usar o novo arenito de referência e preservar suas fiadas e pigmentos ao gerar os mapas. | prompt |
| 2026-11-18 | O piso aparecia vinho. | Clarear o pigmento acobreado e suavizar o brilho. | infra |
| 2026-11-18 | O teto tinha excesso de vermelho. | Ajustar os pigmentos do lambri e dos caibros. | infra |
| 2026-11-18 | A silhueta plana escondia os detalhes da lareira. | Modelar a boca, a grelha, as juntas da coifa e os aros da chaminé. | infra |
| 2026-11-18 | WASD e setas paravam quando o foco saía do canvas para abrir um painel ou visitar uma estaçêo. | Escutar o teclado na janela enquanto a sala estiver ativa e restaurar o foco no acionador. | infra |
| 2026-11-18 | A confirmaçêo duplicada e a barra cobriam controles no celular. | Usar um destino por mensagem e distribuir barra e setas na mesma grade. | infra |
| 2026-11-18 | O mapa fechava o vêo da porta e nêo indicava a posiçêo do visitante. | Traçar a planta nas coordenadas da sala e desenhar a posiçêo da câmera. | infra |
| 2026-11-18 | O material de Filas abria uma página fora do curso. | Retirar o cartêo da lista de materiais da estaçêo. | prompt |
| 2026-11-18 | As cores de cada bloco faziam o arenito parecer um mosaico. | Aplicar um pigmento comum à pedra e manter o rejunte e o relevo do atlas. | infra |
| 2026-11-18 | A captura após limpar a entrada saiu preta a 2 fps. O ajuste de resoluçêo apagava o canvas depois do desenho. | Redimensionar antes do desenho, renderizar ao limpar e usar o relógio no travelling. | infra |
| 2026-11-18 | O rótulo de conclusêo repetia o comando do notebook ou a conversa do celular. | Ler a fala de conclusêo da estaçêo no HTML. | infra |
| 2026-11-18 | O encosto mostrava uma abertura no topo e a lanterna encobria o celular ou os cartões nos enquadramentos de visita. | Fechar o estofado numa malha contínua, liberar a linha de vista e conferir as interseções com a câmera de cada estaçêo. | infra |
| 2026-11-18 | Uma rota em diagonal podia cortar a quina de um móvel entre duas amostras. | Testar cada intervalo entre as bordas dos colisores antes de encurtar a rota. | infra |
