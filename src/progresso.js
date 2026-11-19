const chave = 'inema.do-chat-ao-agente.1';

export function criarProgresso(estacoes) {
  const ids = new Map(estacoes.map((e) => [e.numero, new Set(e.exercicios.map((x) => x.id))]));
  const validos = new Set([...ids.values()].flatMap((grupo) => [...grupo]));
  const eventos = new EventTarget();
  let salvo,
    persistente = true;
  try {
    salvo = JSON.parse(localStorage.getItem(chave));
  } catch {
    persistente = false;
  }
  let nome = typeof salvo?.nome === 'string' ? salvo.nome.slice(0, 60) : '';
  const feitos = new Set(
    (Array.isArray(salvo?.exercicios) ? salvo.exercicios : []).filter((id) => validos.has(id))
  );
  const feitas = () => [...ids].filter(([, grupo]) => [...grupo].every((id) => feitos.has(id))).map(([n]) => n);

  function gravar() {
    try {
      localStorage.setItem(chave, JSON.stringify({ nome, exercicios: [...feitos], estacoes: feitas() }));
      persistente = true;
    } catch {
      persistente = false;
    }
    eventos.dispatchEvent(new Event('change'));
  }

  function marcar(n, id, valor = true) {
    if (!ids.get(n)?.has(id) || feitos.has(id) === valor) return;
    if (valor) feitos.add(id);
    else feitos.delete(id);
    gravar();
  }

  return {
    get nome() {
      return nome;
    },
    get persistente() {
      return persistente;
    },
    get total() {
      return feitos.size;
    },
    feitas,
    eventos,
    marcar,
    tem: (id) => feitos.has(id),
    contar: (n) => [...(ids.get(n) || [])].filter((id) => feitos.has(id)).length,
    identificar(valor) {
      nome = String(valor).trim().slice(0, 60);
      gravar();
    },
    completar(n) {
      if (ids.has(n)) {
        for (const id of ids.get(n)) feitos.add(id);
        gravar();
      }
    },
    limpar() {
      feitos.clear();
      nome = '';
      gravar();
    }
  };
}
