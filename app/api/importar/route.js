import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const url =
      "https://pncp.gov.br/api/consulta/v1/contratacoes/proposta?dataFinal=20261231&codigoModalidadeContratacao=8&pagina=1&tamanhoPagina=1";

    const res = await fetch(url);
    const json = await res.json();

    const lista = json.data || [];

    const dados = lista.map((item) => ({
      pncp_id: item.numeroControlePNCP || null,
      titulo: item.objetoCompra || "Sem título",
      orgao: item.orgaoEntidade?.razaoSocial || "Órgão",
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

    const ids = dados.map((item) => item.pncp_id).filter(Boolean);

    const { data: existentes, error: erroExistentes } = await supabase
      .from("licitacoes")
      .select("pncp_id")
      .in("pncp_id", ids);

    if (erroExistentes) {
      return Response.json({ ok: false, error: erroExistentes.message });
    }

    const idsExistentes = new Set((existentes || []).map((item) => item.pncp_id));

    const novos = dados.filter((item) => !idsExistentes.has(item.pncp_id));

    if (novos.length === 0) {
      return Response.json({ ok: true, inseridos: 0, mensagem: "Nenhuma nova licitação." });
    }

    const { error } = await supabase
      .from("licitacoes")
      .insert(novos);

    if (error) {
      return Response.json({ ok: false, error: error.message });
    }

    return Response.json({
      ok: true,
      inseridos: novos.length
    });
  } catch (e) {
    return Response.json({ ok: false, error: e.message });
  }
}
