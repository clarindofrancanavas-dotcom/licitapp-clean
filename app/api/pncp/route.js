import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    const url =
      "https://pncp.gov.br/api/consulta/v1/contratacoes/proposta?dataFinal=20261231&codigoModalidadeContratacao=8&pagina=1&tamanhoPagina=10";

    const res = await fetch(url);
    const json = await res.json();

    const lista = json.data || [];

    const dados = lista.map((item) => ({
      pncp_id: item.numeroControlePNCP || null,
      titulo: item.objetoCompra || "Sem título",
      orgao: item.orgaoEntidade?.razaoSocial || "Órgão não informado",
      valor: item.valorTotalEstimado || 0,
      numero_compra: item.numeroCompra || null,
      modalidade: item.modalidadeNome || null,
      status: item.situacaoCompraNome || null,
      link_edital: item.linkSistemaOrigem || item.linkProcessoEletronico || null,
      itens_json: item,
      data_publicacao: item.dataPublicacaoPncp
        ? item.dataPublicacaoPncp.slice(0, 10)
        : null
    }));

    const { error } = await supabase.from('licitacoes').insert(dados);

    if (error) {
      return Response.json({ ok: false, error: error.message });
    }

    return Response.json({
      ok: true,
      inseridos: dados.length
    });
  } catch (e) {
    return Response.json({ ok: false, error: e.message });
  }
}
