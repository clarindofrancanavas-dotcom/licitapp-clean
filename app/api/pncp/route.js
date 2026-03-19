export async function GET() {
  try {
    const url =
      "https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?pagina=1&tam_pagina=5&dataInicial=20250101&dataFinal=20261231";

    const res = await fetch(url);
    const json = await res.json();

    return Response.json(json);
  } catch (e) {
    return Response.json({ ok: false, error: e.message });
  }
}
