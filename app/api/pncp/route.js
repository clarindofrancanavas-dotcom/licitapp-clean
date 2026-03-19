import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const response = await fetch(
      "https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?pagina=1"
    );

    const data = await response.json();

    const lista = data.data || [];

    for (const item of lista) {
      await supabase.from("licitacoes").insert({
        pncp_id: item.id,
        titulo: item.objetoCompra,
        orgao: item.orgaoEntidade?.razaoSocial,
        valor: item.valorTotalEstimado,
        numero_compra: item.numeroCompra,
        modalidade: item.modalidadeNome,
        status: item.situacaoCompraNome,
        link_edital: item.linkSistemaOrigem,
        itens_json: item,
      });
    }

    return Response.json({ ok: true, total: lista.length });
  } catch (error) {
    return Response.json({ error: error.message });
  }
}
