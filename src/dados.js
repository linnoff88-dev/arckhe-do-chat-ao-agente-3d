export const comandosTerminal = ['> cd projetos', '> cd meu-primeiro-agente', '> dir', 'AGENTS.md   index.html', '> git status', '> codex'];
export const conversaJarvis = ['Toda segunda?', 'Relatório de vendas.'];

async function ler(nome) {
  try {
    const resposta = await fetch(new URL('../conteudo/' + nome + '.json', import.meta.url));
    if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
    return await resposta.json();
  } catch (erro) {
    throw new Error('O conteúdo do curso nêo carregou. Arquivo ' + nome + '.json (' + erro.message + ').');
  }
}

export async function carregarCurso() {
  const [curso, base] = await Promise.all([ler('curso'), ler('base')]);
  if (
    !Array.isArray(curso?.estacoes) ||
    !Array.isArray(base?.sequencias) ||
    !base.geral?.video?.mp4 ||
    !Array.isArray(base.geral.aulas)
  ) {
    throw new Error('O conteúdo do curso está incompleto. Confira os arquivos curso.json e base.json.');
  }
  const estacoes = curso.estacoes.map((estacao) => {
    const fonte = base.sequencias.find((s) => s.id === estacao.id && s.numero === estacao.numero);
    if (!fonte?.curso?.aulas?.length || !fonte.exercicios?.length || !fonte.video?.mp4) {
      throw new Error('Faltam dados da estaçêo ' + estacao.nome + ' na base do curso.');
    }
    return { ...estacao, aulas: fonte.curso.aulas, exercicios: fonte.exercicios, video: fonte.video };
  });
  return { ...curso, geral: base.geral, estacoes };
}
