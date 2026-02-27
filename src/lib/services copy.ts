/**
 * Serviços da API - Mortalidade
 * Funções específicas para cada endpoint da API Flask
 */

import { api, type FilterParams } from './api';

/**
 * Interface para resposta paginada da API
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

/**
 * Tipos de dados - Ajustados para o backend Flask
 */
export interface TabuaMortalidade {
  id: number;
  id_faixa: number;
  id_local: number;
  id_sexo: number;
  ano: number;
  nMx: number;
  nqx: number;
  nAx: number;
  lx: number;
  ndx: number;
  nLx: number;
  Tx: number;
  ex: number;
}

// Tipo genérico para previsões (retrocompatibilidade)
export interface Projecoes {
  id: number;
  id_faixa: number;
  id_local: number;
  id_sexo: number;
  id_modelo: number;
  ano: number;
  nMx: number;
  nqx: number;
  nAx: number;
  lx: number;
  ndx: number;
  nLx: number;
  Tx: number;
  ex: number;
}

// Métricas
export interface Metricas {
  id: number;
  id_faixa: number;
  id_local: number;
  id_sexo: number;
  id_modelo: number;
  RMSE: number;
  MAE: number;
  SMAPE: number;
}

export interface MortalidadeInfantil {
  id: number;
  ano: number;
  Taxa: number;        // Campo com T maiúsculo conforme API
  local: string;
  cod_IBGE?: string;
  codigo_DataSUS?: string;
}

export interface DatabaseStatus {
  database: string;
  database_file: string;
  tables: Record<string, number>;
  total_records: number;
  has_data: boolean;
}

/**
 * Serviço: Tábua de Mortalidade
 */
export const tabuaMortalidadeService = {
  /**
   * Buscar dados da tábua de mortalidade (retorna resposta paginada)
   */
  async getAll(params?: FilterParams): Promise<TabuaMortalidade[]> {
    const response = await api.get<PaginatedResponse<TabuaMortalidade>>('original', {
      ...params,
      per_page: params?.limit || 1000,  // Buscar mais registros por padrão
    });
    return response.data || [];
  },

  /**
   * Buscar resposta paginada completa
   */
  async getPaginated(params?: FilterParams): Promise<PaginatedResponse<TabuaMortalidade>> {
    return api.get<PaginatedResponse<TabuaMortalidade>>('original', params);
  },

  /**
   * Buscar por ano específico
   */
  async getByYear(ano: number): Promise<TabuaMortalidade[]> {
    const response = await api.get<PaginatedResponse<TabuaMortalidade>>('original', { 
      ano: ano, 
      per_page: 1000,
    });
    return response.data || [];
  },

  /**
   * Buscar por faixa de anos
   */
  async getByYearRange(ano: number): Promise<TabuaMortalidade[]> {
    const response = await api.get<PaginatedResponse<TabuaMortalidade>>('original', { 
      ano: ano,
      per_page: 1000,
    });
    return response.data || [];
  },

  /**
   * Buscar anos disponíveis
   */
  async getAnos(): Promise<number[]> {
    return api.get<number[]>('original/anos');
  },

  /**
   * Buscar locais disponíveis
   */
  async getLocais(): Promise<string[]> {
    return api.get<string[]>('original/locais');
  },
};

/**
 * Serviço: Previsões
 */
export const previsoesService = {
  /**
   * Previsões ARIMA/ETS
   */
  async getArimaEts(params?: FilterParams): Promise<Projecoes[]> {
    const response = await api.get<PaginatedResponse<Projecoes>>('tabuas_previsoes', {
      ...params,
      per_page: params?.limit || 1000,
    });
    return response.data || [];
  },

};

/**
 * Serviço: Mortalidade Infantil
 */
export const mortalidadeInfantilService = {
  /**
   * Buscar dados de mortalidade infantil
   */
  async getAll(params?: FilterParams): Promise<MortalidadeInfantil[]> {
    const response = await api.get<PaginatedResponse<MortalidadeInfantil>>('mortalidade-infantil', {
      ...params,
      per_page: params?.limit || 1000,
    });
    return response.data || [];
  },

  /**
   * Buscar por ano específico
   */
  async getByYear(ano: number): Promise<MortalidadeInfantil[]> {
    const response = await api.get<PaginatedResponse<MortalidadeInfantil>>('mortalidade-infantil', { 
      ano: ano,
      per_page: 1000,
    });
    return response.data || [];
  },
};

/**
 * Serviço: Sistema
 */
export const sistemaService = {
  /**
   * Health check
   */
  async healthCheck() {
    return api.healthCheck();
  },

  /**
   * Status do banco de dados
   */
  async getDatabaseStatus(): Promise<DatabaseStatus> {
    return api.get('/database/status');
  },

  /**
   * Listar rotas disponíveis
   */
  async getRoutes() {
    return api.get('/routes');
  },
};
