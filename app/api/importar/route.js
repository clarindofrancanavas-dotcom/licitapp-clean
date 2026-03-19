import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const url =
      "https://pncp.gov.br/api/consulta/v1/contratacoes/proposta?dataFinal=20261231&codigoModalidadeContratacao=8&pagina=1&tamanhoPagina=10";

    const res = await fetch(url);
    const json = await res.json();

    const lista = json.data || [];

    const dados = lista.map((item) => ({
      pncp_id: item.numeroControlePNCP,
      titulo: item.objetoCompra || "Sem título",
      orgao: item.orgaoEntidade?.razaoSocial || "Órgão",
      valor: item.valorTotalEstimado || 0
    }));

    const { error } = await supabase
      .from("licitacoes")
      .upsert(dados, { onConflict: "pncp_id" });

    if (error) {
      return Response.json({ ok: false, error: error.message });
    }

    return Response.json({
      ok: true,
      total: dados.length
    });

  } catch (e) {
    return Response.json({ ok: false, error: e.message });
  }
}
