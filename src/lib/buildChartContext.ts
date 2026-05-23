/**
 * buildChartContext.ts
 *
 * Helper padronizado para construir o contexto visual que o FloatingChat
 * envia ao backend. Garante que todas as páginas descrevam os gráficos
 * de forma consistente: eixos explícitos, filtros com nomes legíveis,
 * e dados amostrais compactos.
 */

import type { DimLocal, DimFaixa, DimSexo, DimModelo } from "@/lib/services";

// ---------------------------------------------------------------------------
// Tipos públicos
// ---------------------------------------------------------------------------

export interface ChartAxisMeta {
  campo: string;
  label: string;
  transformacao?: string; // ex: "log10"
}

export interface ChartSerieMeta {
  nome: string;
  cor: string;
}

export interface GraficoMeta {
  titulo: string;
  eixo_x: ChartAxisMeta;
  eixo_y: ChartAxisMeta;
  series: ChartSerieMeta[];
  dados_amostra: Record<string, unknown>[];
  total_registros: number;
}

export interface FiltroLegivel {
  id: number;
  nome: string;
}

export interface ChartContext {
  pagina: string;
  descricao: string;
  filtros_ativos: Record<string, FiltroLegivel | number>;
  graficos: GraficoMeta[];
  dimensoes: {
    locais: Array<{ id: number; nome: string }>;
    faixas: Array<{ id: number; nome: string }>;
    sexos: Array<{ id: number; nome: string }>;
    modelos?: Array<{ id: number; nome: string }>;
  };
}

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const MAX_AMOSTRA = 150;

const CORES_SEXO: Record<string, string> = {
  Masculino: "#3b82f6",
  Feminino: "#ec4899",
  Ambos: "#10b981",
};

// ---------------------------------------------------------------------------
// Resolvedores de ID → nome
// ---------------------------------------------------------------------------

function resolverLocal(id: number, locais: DimLocal[]): string {
  return locais.find((l) => l.id_local === id)?.nome_local ?? String(id);
}

function resolverFaixa(id: number, faixas: DimFaixa[]): string {
  return faixas.find((f) => f.id_faixa === id)?.descricao ?? String(id);
}

function resolverSexo(id: number, sexos: DimSexo[]): string {
  return sexos.find((s) => s.id_sexo === id)?.descricao ?? String(id);
}

function resolverModelo(id: number, modelos: DimModelo[]): string {
  return modelos.find((m) => m.id_modelo === id)?.descricao ?? String(id);
}

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

function buildDimensoes(
  locais: DimLocal[],
  faixas: DimFaixa[],
  sexos: DimSexo[],
  modelos?: DimModelo[],
) {
  const dims: ChartContext["dimensoes"] = {
    locais: locais.map((l) => ({ id: l.id_local, nome: l.nome_local })),
    faixas: faixas.map((f) => ({ id: f.id_faixa, nome: f.descricao })),
    sexos: sexos.map((s) => ({ id: s.id_sexo, nome: s.descricao })),
  };
  if (modelos && modelos.length > 0) {
    dims.modelos = modelos.map((m) => ({ id: m.id_modelo, nome: m.descricao }));
  }
  return dims;
}

function buildSeries(sexos: DimSexo[]): ChartSerieMeta[] {
  return sexos.map((s) => ({
    nome: s.descricao,
    cor: CORES_SEXO[s.descricao] ?? "#6366f1",
  }));
}

function amostra<T>(dados: T[]): T[] {
  return dados.slice(0, MAX_AMOSTRA);
}

// ---------------------------------------------------------------------------
// Builders por página
// ---------------------------------------------------------------------------

interface DadosMortalidadeInput {
  dados: Array<Record<string, unknown>>;
  dados2: Array<Record<string, unknown>>;
  filters: {
    anoOriginal: number;
    local: number;
    page: number;
    graf2LocalIds: number[];
    graf2FaixaIds: number[];
    graf2SexoIds: number[];
  };
  locais: DimLocal[];
  faixas: DimFaixa[];
  sexos: DimSexo[];
}

export function buildDadosMortalidadeContext(input: DadosMortalidadeInput): ChartContext {
  const { dados, dados2, filters, locais, faixas, sexos } = input;

  return {
    pagina: "dados_mortalidade",
    descricao:
      "Página de dados originais de mortalidade do IBGE. " +
      "Gráfico 1 mostra taxa central de mortalidade (nMx) em escala logarítmica por faixa etária. " +
      "Gráfico 2 mostra log(nMx) ao longo dos anos para territórios, faixas etárias e sexos selecionados (cada combinação é uma linha).",
    filtros_ativos: {
      ano: { id: filters.anoOriginal, nome: String(filters.anoOriginal) },
      local_grafico1: { id: filters.local, nome: resolverLocal(filters.local, locais) },
      locais_grafico2: {
        id: filters.graf2LocalIds[0] ?? 0,
        nome:
          filters.graf2LocalIds.length > 0
            ? filters.graf2LocalIds.map((id) => resolverLocal(id, locais)).join("; ")
            : "(nenhum)",
      },
      faixas_grafico2: {
        id: filters.graf2FaixaIds[0] ?? 0,
        nome:
          filters.graf2FaixaIds.length > 0
            ? filters.graf2FaixaIds.map((id) => resolverFaixa(id, faixas)).join("; ")
            : "(nenhuma)",
      },
      sexos_grafico2: {
        id: filters.graf2SexoIds[0] ?? 0,
        nome:
          filters.graf2SexoIds.length > 0
            ? filters.graf2SexoIds.map((id) => resolverSexo(id, sexos)).join("; ")
            : "(nenhum)",
      },
    },
    graficos: [
      {
        titulo: "Mortalidade Por Faixa-Etária",
        eixo_x: { campo: "id_faixa", label: "Faixa Etária" },
        eixo_y: { campo: "nMx", label: "Log(nMx)", transformacao: "log10" },
        series: buildSeries(sexos),
        dados_amostra: amostra(dados),
        total_registros: dados.length,
      },
      {
        titulo: "Mortalidade Por Ano",
        eixo_x: { campo: "ano", label: "Ano" },
        eixo_y: { campo: "nMx", label: "Log(nMx)", transformacao: "log10" },
        series: buildSeries(sexos),
        dados_amostra: amostra(dados2),
        total_registros: dados2.length,
      },
    ],
    dimensoes: buildDimensoes(locais, faixas, sexos),
  };
}

interface ExpectativaVidaInput {
  dados: Array<Record<string, unknown>>;
  filters: { local: number; faixa: number; page: number };
  locais: DimLocal[];
  faixas: DimFaixa[];
  sexos: DimSexo[];
}

export function buildExpectativaVidaContext(input: ExpectativaVidaInput): ChartContext {
  const { dados, filters, locais, faixas, sexos } = input;

  return {
    pagina: "expectativa_vida",
    descricao:
      "Página de expectativa de vida (ex) ao longo dos anos, extraída dos dados originais do IBGE. " +
      "O eixo X mostra anos e o eixo Y mostra a expectativa de vida em anos, agrupado por sexo.",
    filtros_ativos: {
      local: { id: filters.local, nome: resolverLocal(filters.local, locais) },
      faixa: { id: filters.faixa, nome: resolverFaixa(filters.faixa, faixas) },
    },
    graficos: [
      {
        titulo: "Expectativa de Vida ao Longo dos Anos",
        eixo_x: { campo: "ano", label: "Ano" },
        eixo_y: { campo: "ex", label: "Expectativa de Vida (anos)" },
        series: buildSeries(sexos),
        dados_amostra: amostra(dados),
        total_registros: dados.length,
      },
    ],
    dimensoes: buildDimensoes(locais, faixas, sexos),
  };
}

interface PrevisaoMortalidadeInput {
  dados: Array<Record<string, unknown>>;
  filters: { ano: number; local: number; sexo: number; faixa: number; modelo: number; page: number };
  locais: DimLocal[];
  faixas: DimFaixa[];
  sexos: DimSexo[];
  modelos: DimModelo[];
}

export function buildPrevisaoMortalidadeContext(input: PrevisaoMortalidadeInput): ChartContext {
  const { dados, filters, locais, faixas, sexos, modelos } = input;

  return {
    pagina: "previsao_mortalidade",
    descricao:
      "Página de previsão de mortalidade. Mostra projeções de nMx (taxa central de mortalidade) " +
      "em escala logarítmica por faixa etária, geradas por modelos como Lee-Carter, Chronos e TimesFM. " +
      "Os dados são projeções futuras (2024-2070).",
    filtros_ativos: {
      ano: filters.ano,
      local: { id: filters.local, nome: resolverLocal(filters.local, locais) },
      modelo: { id: filters.modelo, nome: resolverModelo(filters.modelo, modelos) },
    },
    graficos: [
      {
        titulo: "Previsão de Mortalidade por Faixa-Etária",
        eixo_x: { campo: "id_faixa", label: "Faixa Etária" },
        eixo_y: { campo: "nMx", label: "Log(nMx)", transformacao: "log10" },
        series: buildSeries(sexos),
        dados_amostra: amostra(dados),
        total_registros: dados.length,
      },
    ],
    dimensoes: buildDimensoes(locais, faixas, sexos, modelos),
  };
}

interface PrevisaoExpectativaInput {
  dados: Array<Record<string, unknown>>;
  filters: { local: number; faixa: number; modelo: number; page: number };
  locais: DimLocal[];
  faixas: DimFaixa[];
  sexos: DimSexo[];
  modelos: DimModelo[];
}

export function buildPrevisaoExpectativaContext(input: PrevisaoExpectativaInput): ChartContext {
  const { dados, filters, locais, faixas, sexos, modelos } = input;

  return {
    pagina: "previsao_expectativa",
    descricao:
      "Página de previsão da expectativa de vida. Mostra projeções de ex (expectativa de vida em anos) " +
      "ao longo dos anos futuros (2024-2070), geradas por modelos como Lee-Carter, Chronos e TimesFM.",
    filtros_ativos: {
      local: { id: filters.local, nome: resolverLocal(filters.local, locais) },
      faixa: { id: filters.faixa, nome: resolverFaixa(filters.faixa, faixas) },
      modelo: { id: filters.modelo, nome: resolverModelo(filters.modelo, modelos) },
    },
    graficos: [
      {
        titulo: "Previsão da Expectativa de Vida ao Longo dos Anos",
        eixo_x: { campo: "ano", label: "Ano" },
        eixo_y: { campo: "ex", label: "Expectativa de Vida (anos)" },
        series: buildSeries(sexos),
        dados_amostra: amostra(dados),
        total_registros: dados.length,
      },
    ],
    dimensoes: buildDimensoes(locais, faixas, sexos, modelos),
  };
}
