import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    let inseridos = 0;

    for (let pagina = 1; pagina <= 5; pagina++) {
      const url = `https://pncp.gov.br/api/consulta/v1/contratacoes/proposta?dataFinal=20261231&codigoModalidadeContratacao=8&pagina=${pagina}&tamanhoPagina=10`;

      const res = await fetch(url);
      const json = await res.json();

      if (!json.data) continue;

      const registros = json.data.map((item) => ({
        titulo: item.objetoCompra,
        orgao: item.orgaoEntidade?.razaoSocial,
        valor: item.valorTotalEstimado,
        numeroControlePNCP: item.numeroControlePNCP,
      }));

      const { error } = await supabase
        .from("licitacoes")
        .upsert(registros, {
          onConflict: "numeroControlePNCP",
        });

      if (!error) inseridos += registros.length;
    }

    return Response.json({
      ok: true,
      inseridos,
      mensagem: "Importação concluída",
    });
  } catch (e) {
    return Response.json({ ok: false, error: e.message });
  }
}
