'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [licitacoes, setLicitacoes] = useState([]);

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from('licitacoes')
        .select('*');

      if (error) {
        console.error(error);
      } else {
        setLicitacoes(data);
      }
    }

    carregar();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Licitapp</h1>

      {licitacoes.length === 0 && <p>Nenhum dado ainda...</p>}

      {licitacoes.map((item) => (
        <div key={item.id} style={{ marginBottom: 10 }}>
          <strong>{item.titulo}</strong> <br />
          {item.orgao} <br />
          R$ {item.valor}
        </div>
      ))}
    </div>
  );
}
