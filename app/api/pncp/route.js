import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    // 🔹 Simulando dados (depois ligamos no PNCP real)
    const dados = [
      {
        titulo: "Licitação teste automática",
        orgao: "Prefeitura",
        valor: 50000
      }
    ];

    const { data, error } = await supabase
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
