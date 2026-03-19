'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [licitacoes, setLicitacoes] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [orgao, setOrgao] = useState('');
  const [valor, setValor] = useState('');

  async function carregar() {
    const { data, error } = await supabase
      .from('licitacoes')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setLicitacoes(data || []);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionarLicitacao(e) {
    e.preventDefault();

    const { error } = await supabase.from('licitacoes').insert([
      {
        titulo,
        orgao,
        valor: valor ? Number(valor) : null
      }
    ]);

    if (error) {
      alert('Erro ao salvar.');
      console.error(error);
      return;
    }

    setTitulo('');
    setOrgao('');
    setValor('');
    carregar();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Licitapp</h1>

      <form onSubmit={adicionarLicitacao} style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8 }}>
          <input
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            style={{ padding: 8, width: 300 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <input
            placeholder="Órgão"
            value={orgao}
            onChange={(e) => setOrgao(e.target.value)}
            style={{ padding: 8, width: 300 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <input
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            style={{ padding: 8, width: 300 }}
          />
        </div>

        <button type="submit" style={{ padding: '10px 16px' }}>
          Adicionar licitação
        </button>
      </form>

      {licitacoes.length === 0 && <p>Nenhum dado ainda...</p>}

      {licitacoes.map((item) => (
        <div key={item.id} style={{ marginBottom: 16 }}>
          <strong>{item.titulo}</strong> <br />
          {item.orgao} <br />
          R$ {item.valor}
        </div>
      ))}
    </div>
  );
}
