export async function GET() {
  try {
    const res = await fetch(
      "https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?pagina=1&tam_pagina=5"
    );

    const json = await res.json();

    return Response.json(json);
  } catch (e) {
    return Response.json({ ok: false, error: e.message });
  }
}
