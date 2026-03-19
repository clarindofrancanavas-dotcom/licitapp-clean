import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    // 🔥 API REAL DO PNCP
    const res = await fetch(
      "https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?pagina=1&tam_pagina=5"
    );

    const json = await res.json();

    const dados = json.data.map(item => ({
      titulo: item.objetoCompra || "Sem título",
      orgao: item.orgaoEntidade?.razaoSocial || "Órgão não informado",
      valor: item.valorTotalEstimado || 0
    }));

    const { error } = await supabase
      .from('licitacoes')
      .insert(dados);

    if (error) {
      return Response.json({ ok: false, error });
    }

    return Response.json({
      ok: true,
      inseridos: dados.length
    });

  } catch (e) {
    return Response.json({ ok: false, error: e.message });
  }
}
