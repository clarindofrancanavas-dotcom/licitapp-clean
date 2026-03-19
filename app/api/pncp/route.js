export async function GET() {
  try {
    const url =
      "https://pncp.gov.br/api/consulta/v1/contratacoes/proposta?dataFinal=20261231&codigoModalidadeContratacao=8&pagina=1&tamanhoPagina=5";

    const res = await fetch(url);
    const json = await res.json();

    return Response.json(json);
  } catch (e) {
    return Response.json({ ok: false, error: e.message });
  }
}
