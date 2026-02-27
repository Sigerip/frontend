"use client";

import { useEffect, useState } from "react";
import { fetchDimensoes, fetchTabuaOriginal, fetchTabuaProjecoes } from "@/lib/api";
import type { DimLocal, DimFaixa, DimModelo, DimSexo, TabuaMortalidade, PaginatedResponse, Projecoes } from "@/lib/services";

export default function TabuaDashboard() {
  // Estados para as Dimensões (Opções dos Selects)
  const [locais, setLocais] = useState<DimLocal[]>([]);
  const [faixas, setFaixas] = useState<DimFaixa[]>([]);
  const [sexos, setSexos] = useState<DimSexo[]>([]);
  const [modelos, setModelos] = useState<DimModelo[]>([]);
  
  // Estado dos Dados Principais
  const [dataa, setData] = useState<TabuaMortalidade[]>([]);
  const [data2, setData2] = useState<Projecoes[]>([]);
  const [loading, setLoading] = useState(true);
  const [anosOriginal, setAnosOriginal] = useState<number[]>([]);
  const [anosProjecoes, setAnosProjecoes] = useState<number[]>([]);
  
  // Estado dos Filtros Selecionados
  const [filters, setFilters] = useState({
    ano1: 2000,
    ano2: 2024,
    local: 0, // 0 ou null representa 'todos'
    sexo: 0,
    faixa: 0,
    modelo: 0,
    page: 1
  });

  // 1. Carregar as Dimensões ao montar o componente
  useEffect(() => {
    async function loadDims() {
      try {
        const dims = await fetchDimensoes();
        setLocais(dims.locais);
        setFaixas(dims.faixas);
        setSexos(dims.sexos);
        setModelos(dims.modelos);
        setAnosOriginal(dims.anos_original);
        setAnosProjecoes(dims.anos_projecoes);
      } catch (error) {
        console.error("Erro ao carregar dimensões", error);
      }
    }
    loadDims();
  }, []);

  // 2. Carregar a Tabela quando os filtros mudarem
  useEffect(() => {
    async function loadTable() {
      setLoading(true);
      try {
        // Filtra parâmetros vazios/zero
        const apiParams: any = { page: filters.page };
        if (filters.ano1) apiParams.ano = filters.ano1;
        if (filters.local) apiParams.local = filters.local;
        if (filters.sexo) apiParams.sexo = filters.sexo;
        if (filters.faixa) apiParams.faixa = filters.faixa;

        const apiParams1: any = { page: filters.page };
        if (filters.ano2) apiParams1.ano = filters.ano2;
        if (filters.local) apiParams1.local = filters.local;
        if (filters.sexo) apiParams1.sexo = filters.sexo;
        if (filters.faixa) apiParams1.faixa = filters.faixa;
        if (filters.modelo) apiParams1.modelo = filters.modelo;

        const response: PaginatedResponse<TabuaMortalidade> = await fetchTabuaOriginal(apiParams);
        const response2: PaginatedResponse<Projecoes> = await fetchTabuaProjecoes(apiParams1);
        setData(response.data);
        //setData2(response2.data);
      } catch (error) {
        console.error("Erro ao buscar tabela", error);
      } finally {
        setLoading(false);
      }
    }

    loadTable();
  }, [filters]); // Roda sempre que 'filters' mudar

  // Handlers
  const handleFilterChange = (field: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [field]: Number(value), page: 1 })); // Reseta p/ pagina 1 ao filtrar
  };

  // Helper para mostrar o nome do local na tabela em vez do ID
  const getLocalName = (id: number) => locais.find(l => l.id_local === id)?.nome_local || id;
  const getFaixaName = (id: number) => faixas.find(f => f.id_faixa === id)?.descricao || id;
  const getModeloName = (id: number) => modelos.find(m => m.id_modelo === id)?.descricao || id;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tábua de Mortalidade</h1>

      {/* ÁREA DE FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-gray-100 p-4 rounded-lg">
        
        {/* Filtro Ano */}
        <div className="flex flex-col">
          <label className="text-sm font-bold mb-1">Ano</label>
          <select 
            className="border p-2 rounded"
            value={filters.ano1}
            onChange={(e) => handleFilterChange('ano1', e.target.value)}
          >
            <option value={0}>Todos os Anos</option>
            {anosOriginal.map((ano1) => (
              <option key={ano1} value={ano1}>
                {ano1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-bold mb-1">Ano</label>
          <select 
            className="border p-2 rounded"
            value={filters.ano2}
            onChange={(e) => handleFilterChange('ano2', e.target.value)}
          >
            <option value={0}>Todos os Anos</option>
            {anosProjecoes.map((ano2) => (
              <option key={ano2} value={ano2}>
                {ano2}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Local - Popula com dados da API */}
        <div>
          <label className="block text-sm font-medium">Local</label>
          <select 
            className="mt-1 block w-full border rounded p-2"
            value={filters.local}
            onChange={(e) => handleFilterChange('local', e.target.value)}
          >
            <option value={0}>Todos</option>
            {locais.map((local) => (
              <option key={local.id_local} value={local.id_local}>
                {local.nome_local}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Sexo */}
        <div>
          <label className="block text-sm font-medium">Sexo</label>
          <select 
            className="mt-1 block w-full border rounded p-2"
            value={filters.sexo}
            onChange={(e) => handleFilterChange('sexo', e.target.value)}
          >
            <option value={0}>Todos</option>
            {sexos.map((sexo) => (
              <option key={sexo.id_sexo} value={sexo.id_sexo}>
                {sexo.descricao}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Modelo */}
        <div>
          <label className="block text-sm font-medium">Modelo</label>
          <select 
            className="mt-1 block w-full border rounded p-2"
            value={filters.modelo}
            onChange={(e) => handleFilterChange('modelo', e.target.value)}
          >
            <option value={0}>Todos</option>
            {modelos.map((modelo) => (
              <option key={modelo.id_modelo} value={modelo.id_modelo}>
                {modelo.descricao}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABELA DE DADOS */}
      {loading ? (
        <p>Carregando dados...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 border">Local</th>
                <th className="p-3 border">Faixa Etária</th>
                <th className="p-3 border">Ano</th>
                <th className="p-3 border">nqx (Prob. Morte)</th>
                <th className="p-3 border">ex (Exp. Vida)</th>
                <th className="p-3 border">lx (Sobreviventes)</th>
              </tr>
            </thead>
            <tbody>
              {dataa.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{getLocalName(row.id_local)}</td>
                  <td className="p-3 border">{getFaixaName(row.id_faixa)}</td>
                  <td className="p-3 border">{row.ano}</td>
                  <td className="p-3 border">{row.nqx.toFixed(5)}</td>
                  <td className="p-3 border text-blue-600 font-bold">{row.ex.toFixed(2)}</td>
                  <td className="p-3 border">{row.lx.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {dataa.length === 0 && <p className="mt-4 text-center">Nenhum dado encontrado.</p>}
        </div>
      )}
      
      {/* Paginação simples */}
      <div className="mt-4 flex gap-2 justify-end">
        <button 
          onClick={() => setFilters(prev => ({...prev, page: prev.page - 1}))}
          disabled={filters.page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="py-2">Página {filters.page}</span>
        <button 
          onClick={() => setFilters(prev => ({...prev, page: prev.page + 1}))}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Próxima
        </button>
      </div>

      {/* TABELA DE projecoes */}
      {loading ? (
        <p>Carregando dados...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 border">Local</th>
                <th className="p-3 border">Faixa Etária</th>
                <th className="p-3 border">Ano</th>
                <th className="p-3 border">nqx (Prob. Morte)</th>
                <th className="p-3 border">ex (Exp. Vida)</th>
                <th className="p-3 border">lx (Sobreviventes)</th>
                <th className="p-3 border">Modelos</th>
              </tr>
            </thead>
            <tbody>
              {data2.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{getLocalName(row.id_local)}</td>
                  <td className="p-3 border">{getFaixaName(row.id_faixa)}</td>
                  <td className="p-3 border">{row.ano}</td>
                  <td className="p-3 border">{row.nqx.toFixed(5)}</td>
                  <td className="p-3 border text-blue-600 font-bold">{row.ex.toFixed(2)}</td>
                  <td className="p-3 border">{row.lx.toLocaleString()}</td>
                  <td className="p-3 border">{getModeloName(row.id_modelo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {data2.length === 0 && <p className="mt-4 text-center">Nenhum dado encontrado.</p>}
        </div>
      )}
      
      {/* Paginação simples */}
      <div className="mt-4 flex gap-2 justify-end">
        <button 
          onClick={() => setFilters(prev => ({...prev, page: prev.page - 1}))}
          disabled={filters.page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="py-2">Página {filters.page}</span>
        <button 
          onClick={() => setFilters(prev => ({...prev, page: prev.page + 1}))}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}