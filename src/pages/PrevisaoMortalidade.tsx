import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchDimensoes, fetchTabuaProjecoes } from "@/lib/api";
import { DimFaixa, DimLocal, DimModelo, DimSexo, PaginatedResponse, Projecoes } from "@/lib/services";
import { Loader2, Target, Filter, Sparkles, HelpCircle } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import MortalidadeRechartsChart from "@/components/charts/MortalidadeRechartsChart";
import DownloadButton from "@/components/DownloadButton";
import FloatingChat from "@/components/ChatFloat";
import { buildPrevisaoMortalidadeContext } from "@/lib/buildChartContext";
import { MultiSelect } from "@/components/ui/multi-select";
import { motion, AnimatePresence } from "motion/react";

const DadosPrevisao = () => {
  const [dados, setDados] = useState<Projecoes[]>([]);
  const [dimsLoaded, setDimsLoaded] = useState(false);
  const [selectedSexos, setSelectedSexos] = useState<number[]>([]);

  const [locais, setLocais] = useState<DimLocal[]>([]);
  const [sexos, setSexos] = useState<DimSexo[]>([]);
  const [faixas, setFaixas] = useState<DimFaixa[]>([]);
  const [modelos, setModelos] = useState<DimModelo[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [ano, setAno] = useState<number[]>([]);

  const [filters, setFilters] = useState<{
    anos: number[];
    locais: number[];
    modelos: number[];
    page: number;
  }>({
    anos: [2024],
    locais: [1],
    modelos: [1],
    page: 1,
  });

  useEffect(() => {
    async function loadDims () {
      try {
        const dims = await fetchDimensoes();
        setAno(dims.anos_projecoes);
        setLocais(dims.locais);
        setSexos(dims.sexos);
        setSelectedSexos(dims.sexos.map((s: DimSexo) => s.id_sexo));
        setFaixas(dims.faixas);
        setModelos(dims.modelos);
        setDimsLoaded(true);
      }
      catch (err) {
        console.error("Erro ao carregar dimensões:", err);
      }
    }
    loadDims();
  }, []);

  const dadosFiltrados = useMemo(() => {
    if (selectedSexos.length === 0) return [];
    return dados.filter((d) => selectedSexos.includes(d.id_sexo));
  }, [dados, selectedSexos]);

  useEffect(() => {
    async function loadData() {
      if (!dimsLoaded) return;
      if (filters.locais.length === 0 || filters.modelos.length === 0 || filters.anos.length === 0) {
        setDados([]);
        return;
      }
      setLoading(true);
      setIsRefreshing(true);
      try {
        const fetchPromises: Promise<PaginatedResponse<Projecoes>>[] = [];
        filters.locais.forEach((localId) => {
          filters.modelos.forEach((modeloId) => {
            filters.anos.forEach((anoVal) => {
              fetchPromises.push(
                fetchTabuaProjecoes({
                  page: 1,
                  per_page: 2000,
                  local: localId,
                  modelo: modeloId,
                  ano: anoVal,
                })
              );
            });
          });
        });

        const responses = await Promise.all(fetchPromises);
        const merged = responses.flatMap((r) => r.data);
        setDados(merged);
      }
      catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
    loadData();
  }, [filters, dimsLoaded]);

  // Resoluções amigáveis e descrições para exportação e cabeçalho
  const activeLocaisNames = useMemo(() => {
    if (filters.locais.length === 0) return "Nenhum local";
    return filters.locais
      .map(id => locais.find(l => l.id_local === id)?.nome_local || String(id))
      .join(", ");
  }, [locais, filters.locais]);

  const activeModelosDescs = useMemo(() => {
    if (filters.modelos.length === 0) return "Nenhum modelo";
    return filters.modelos
      .map(id => modelos.find(m => m.id_modelo === id)?.descricao || String(id))
      .join(", ");
  }, [modelos, filters.modelos]);

  // Nome dinâmico para baixar
  const downloadFilename = useMemo(() => {
    const localNames = filters.locais
      .map((id) => locais.find((l) => l.id_local === id)?.nome_local || String(id))
      .join("_")
      .toLowerCase()
      .replace(/\s+/g, "_");
    const modelNames = filters.modelos
      .map((id) => modelos.find((m) => m.id_modelo === id)?.descricao || String(id))
      .join("_")
      .toLowerCase()
      .replace(/\s+/g, "_");
    const years = filters.anos.join("_");
    return `previsao_mortalidade_${localNames}_modelos_${modelNames}_anos_${years}`;
  }, [locais, modelos, filters.locais, filters.modelos, filters.anos]);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background via-background/95 to-background/90 text-foreground">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="max-w-6xl mx-auto">
          
          {/* Banner Hero */}
          <div className="text-center mb-12 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5 mb-4 hover:scale-105 transition-transform duration-300">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-400 to-cyan-300 bg-clip-text text-transparent mb-3">
              Previsão de Mortalidade
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Projeções de mortalidade por faixas etárias, estimadas para os anos de 2024 a 2070.
            </p>
          </div>

          {/* Card Unificado de Filtros Superiores (Sempre Visível) */}
          <Card className="border-primary/10 bg-card/40 backdrop-blur-md shadow-xl mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                Filtros Principais
              </CardTitle>
              <CardDescription>Estes parâmetros afetam os gráficos e a planilha de previsão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Anos Projeção</label>
                  <MultiSelect
                    options={ano.map((a) => ({ value: a, label: String(a) }))}
                    selectedValues={filters.anos}
                    onChange={(vals) => setFilters((prev) => ({ ...prev, anos: vals, page: 1 }))}
                    placeholder="Selecionar anos..."
                    maxBadges={2}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Localidades</label>
                  <MultiSelect
                    options={locais.map((l) => ({ value: l.id_local, label: l.nome_local }))}
                    selectedValues={filters.locais}
                    onChange={(vals) => setFilters((prev) => ({ ...prev, locais: vals, page: 1 }))}
                    placeholder="Selecionar localidades..."
                    maxBadges={2}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Modelos Preditivos</label>
                  <MultiSelect
                    options={modelos.map((m) => ({ value: m.id_modelo, label: m.descricao }))}
                    selectedValues={filters.modelos}
                    onChange={(vals) => setFilters((prev) => ({ ...prev, modelos: vals, page: 1 }))}
                    placeholder="Selecionar modelos..."
                    maxBadges={2}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sexo / Gênero</label>
                  <MultiSelect
                    options={sexos.map((s) => ({ value: s.id_sexo, label: s.descricao }))}
                    selectedValues={selectedSexos}
                    onChange={(vals) => setSelectedSexos(vals)}
                    placeholder="Selecionar sexos..."
                    maxBadges={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Abas Principais (Gráficos vs Tabela) */}
          <Tabs defaultValue="previsao" className="w-full">
            <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 bg-muted/20 border border-primary/5 p-1 rounded-xl">
              <TabsTrigger value="previsao" className="rounded-lg py-2">Gráficos Projeção</TabsTrigger>
              <TabsTrigger value="modelo" className="rounded-lg py-2">Dados em Tabela</TabsTrigger>
            </TabsList>

            {/* Aba de Gráficos */}
            <TabsContent value="previsao" className="mt-6">
              <Card className="border-primary/10 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    Curvas de Mortalidade Projetadas
                  </CardTitle>
                  <CardDescription>
                    Distribuição etária da mortalidade projetada por sexo para {activeLocaisNames} ({activeModelosDescs}) em {filters.anos.join(", ")}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {loading && dadosFiltrados.length === 0 ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-3 bg-muted/5 rounded-lg">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground animate-pulse">Carregando dados das projeções...</span>
                    </div>
                  ) : (
                    <MortalidadeRechartsChart dados={dadosFiltrados} faixas={faixas} sexos={sexos} locais={locais} modelos={modelos} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Aba de Tabela */}
            <TabsContent value="modelo" className="mt-6">
              <Card className="border-primary/10 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden">
                <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Planilha de Projeções</CardTitle>
                    <CardDescription>Mostrando {dadosFiltrados.length} registros estimados de mortalidade</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <DownloadButton
                      dados={dadosFiltrados}
                      filename={downloadFilename}
                      locais={locais}
                      faixas={faixas}
                      sexos={sexos}
                      modelos={modelos}
                      disabled={loading || dadosFiltrados.length === 0}
                      colunas={["ano", "faixa", "local", "sexo", "modelo", "nMx", "ex"]}
                    />
                  </div>
                </CardHeader>
                <CardContent className={`px-0 transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
                  {dadosFiltrados.length > 0 ? (
                    <div className="overflow-x-auto max-h-[500px]">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/30 border-b border-primary/5 text-muted-foreground text-left text-xs font-semibold uppercase tracking-wider">
                            <th className="px-6 py-3.5">Ano</th>
                            <th className="px-6 py-3.5">Faixa Etária</th>
                            <th className="px-6 py-3.5">Localidade</th>
                            <th className="px-6 py-3.5">Sexo</th>
                            <th className="px-6 py-3.5">Modelo</th>
                            <th className="px-6 py-3.5 text-right font-mono">nMx</th>
                            <th className="px-6 py-3.5 text-right font-mono">ex</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5 text-sm">
                          <AnimatePresence mode="popLayout">
                            {dadosFiltrados.slice(0, 100).map((item) => (
                              <motion.tr
                                layout
                                key={item.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="hover:bg-muted/10 transition-colors"
                              >
                                <td className="px-6 py-3 font-semibold text-primary/80">{item.ano}</td>
                                <td className="px-6 py-3">{faixas.find(f => f.id_faixa === item.id_faixa)?.descricao || item.id_faixa}</td>
                                <td className="px-6 py-3">{locais.find(f => f.id_local === item.id_local)?.nome_local || item.id_local}</td>
                                <td className="px-6 py-3">{sexos.find(f => f.id_sexo === item.id_sexo)?.descricao || item.id_sexo}</td>
                                <td className="px-6 py-3">{modelos.find(m => m.id_modelo === item.id_modelo)?.descricao || item.id_modelo}</td>
                                <td className="px-6 py-3 text-right font-mono font-bold text-foreground">
                                  {item.nMx?.toFixed(6)}
                                </td>
                                <td className="px-6 py-3 text-right font-mono font-bold text-foreground">
                                  {item.ex?.toFixed(2)}
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                      {dadosFiltrados.length > 100 && (
                        <p className="text-xs text-muted-foreground py-4 text-center border-t border-primary/5">
                          Mostrando os primeiros 100 de {dadosFiltrados.length} registros. Use os filtros acima para refinar.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="h-96 flex flex-col items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <Loader2 className="h-10 w-10 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground animate-pulse">Carregando dados da tabela...</span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">Nenhum registro encontrado para a combinação selecionada.</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Seção Informativa de Apoio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="md:col-span-2 border-primary/10 bg-card/25 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-md flex items-center gap-2 text-primary">
                  <HelpCircle className="h-4 w-4" />
                  Metodologias Preditivas Atuariais
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  As previsões expostas utilizam os modelos <strong>Lee-Carter</strong>, <strong>Lee-Miller</strong> e composições híbridas integrando <strong>ARIMA + ETS + Redes Neurais Autorregressivas (NNAR)</strong>. Eles modelam e projetam a taxa central de mortalidade (<sub>n</sub>M<sub>x</sub>), que mede a intensidade de óbitos de um determinado grupo etário por pessoa-ano vivida.
                </p>
                <p>
                  Diferente de abordagens estáticas puras, a incorporação de técnicas de <em>machine learning</em> e séries temporais avançadas capta tendências de redução de mortalidade de forma mais coerente para cada território e faixa etária específica.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 bg-card/25 backdrop-blur-sm shadow-lg flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-md text-primary">Detalhamento dos Modelos</CardTitle>
                <CardDescription>Escopo e Horizonte</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <div>
                  <span className="font-semibold block text-foreground">Abrangência Temporal:</span>
                  Previsões para 2024 até o horizonte de 2070.
                </div>
                <div>
                  <span className="font-semibold block text-foreground">Garantia Atuarial:</span>
                  Nomenclaturas mantidas em termos puramente técnicos (<sub>n</sub>M<sub>x</sub>, e<sub>x</sub>) para conformidade com normas reguladoras do setor de previdência.
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
      <FloatingChat
        chartTitle="previsao_mortalidade"
        chartData={buildPrevisaoMortalidadeContext({
          dados: dadosFiltrados, filters, locais, faixas, sexos, modelos,
        })}
      />
    </div>
  );
};

export default DadosPrevisao;
