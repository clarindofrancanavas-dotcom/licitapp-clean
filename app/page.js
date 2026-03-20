'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [licitacoes, setLicitacoes] = useState([]);
  const [busca, setBusca] = useState('');

  async function carregar() {
    const { data, error } = await supabase
      .from('licitacoes')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setLicitacoes(data || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  const oportunidadesAbertas = useMemo(() => {
  return licitacoes.filter((item) => {
    const status = (item.status || '').toLowerCase();

    return (
      status.includes('divulgada') ||
      status.includes('aberta') ||
      status.includes('andamento')
    );
  });
}, [licitacoes]);

  const resultadosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return oportunidadesAbertas;

    return oportunidadesAbertas.filter((item) => {
      const texto = `
        ${item.titulo || ''}
        ${item.orgao || ''}
        ${item.modalidade || ''}
        ${item.municipio_nome || ''}
        ${item.uf_sigla || ''}
      `.toLowerCase();

      return texto.includes(termo);
    });
  }, [busca, oportunidadesAbertas]);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Licitapp</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Buscar por palavra-chave"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            padding: 10,
            width: 320,
            borderRadius: 8,
            border: '1px solid #ccc'
          }}
        />
      </div>

      <p>
        <strong>Oportunidades abertas:</strong> {resultadosFiltrados.length}
      </p>

      {resultadosFiltrados.length === 0 && (
        <p>Nenhuma oportunidade encontrada.</p>
      )}

      {resultadosFiltrados.map((item) => (
        <div
          key={item.id}
          style={{
            marginBottom: 16,
            padding: 16,
            border: '1px solid #ddd',
            borderRadius: 10,
            background: '#fff',
            color: '#000'
          }}
        >
          <strong>{item.titulo}</strong>
          <br />
          <span><strong>Órgão:</strong> {item.orgao}</span>
          <br />
          <span><strong>Modalidade:</strong> {item.modalidade || 'Não informado'}</span>
          <br />
          <span><strong>Status:</strong> {item.status || 'Não informado'}</span>
          <br />
          <span><strong>Município/UF:</strong> {item.municipio_nome || '-'} / {item.uf_sigla || '-'}</span>
          <br />
          <span><strong>Valor:</strong> R$ {item.valor || 0}</span>
          <br />
          {item.link_processo && (
            <>
              <a href={item.link_processo} target="_blank" rel="noreferrer">
                Abrir edital / processo
              </a>
              <br />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
