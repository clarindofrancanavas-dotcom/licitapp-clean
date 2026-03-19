import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    let inseridos = 0;

    for (let pagina = 1; pagina <= 5; pagina++) {

      const url =
        `https://pncp.gov.br/api/consulta/v1/contratacoes/proposta?dataFinal=20261231&codigoModalidadeContratacao=8&pagina=${pagina}&tamanhoPagina=10`;

      const res = await fetch(url);
      const json = await res.json();

      const lista = json.data || [];

      const dados = lista.map((item) => ({

        pncp_id: item.numeroControlePNCP,

        titulo: item.objetoCompra,

        orgao: item.orgaoEntidade?.razaoSocial,

        valor: item.valorTotalEstimado,

        numero_compra: item.numeroCompra,

        modalidade: item.modalidadeNome,

        status: item.situacaoCompraNome,

        municipio_nome: item.unidadeOrgao?.municipioNome,

        uf_sigla: item.unidadeOrgao?.ufSigla,

        link_processo:
          item.linkSistemaOrigem ||
          item.linkProcessoEletronico,

        data_abertura_proposta:
          item.dataAberturaProposta,

        data_encerramento_proposta:
          item.dataEncerramentoProposta,

        itens_json: item
      }));


      const ids = dados.map((d) => d.pncp_id);

      const { data: existentes } = await supabase
        .from("licitacoes")
        .select("pncp_id")
        .in("pncp_id", ids);

      const existentesSet = new Set(
        (existentes || []).map((e) => e.pncp_id)
      );

      const novos = dados.filter(
        (d) => !existentesSet.has(d.pncp_id)
      );

      if (novos.length > 0) {

        const { error } = await supabase
          .from("licitacoes")
          .insert(novos);

        if (!error) inseridos += novos.length;
      }
    }

    return Response.json({
      ok: true,
      inseridos
    });

  } catch (e) {

    return Response.json({
      ok: false,
      error: e.message
    });
  }
}
