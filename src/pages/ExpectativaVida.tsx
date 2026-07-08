import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, TrendingUp, Filter, Sparkles, HelpCircle } from "lucide-react";
import { DimFaixa, DimLocal, DimSexo, PaginatedResponse, type TabuaMortalidade } from "@/lib/services";
import { fetchDimensoes, fetchTabuaOriginal } from "@/lib/api";
import ExpectativaRechartsChart from "@/components/charts/ExpectativaRechartsChart";
import DownloadButton from "@/components/DownloadButton";
import FloatingChat from "@/components/ChatFloat";
import { buildExpectativaVidaContext } from "@/lib/buildChartContext";
import { MultiSelect } from "@/components/ui/multi-select";
import { motion, AnimatePresence } from "motion/react";

const ExpectativaVida = () => {
  const [locais, setLocais] = useState<DimLocal[]>([]);
  const [faixas, setFaixas] = useState<DimFaixa[]>([]);
  const [sexos, setSexos] = useState<DimSexo[]>([]);

  const [dados, setDados] = useState<TabuaMortalidade[]>([]);
  const [dimsLoaded, setDimsLoaded] = useState(false);
  const [selectedSexos, setSelectedSexos] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [filters, setFilters] = useState<{
    locais: number[];
    faixas: number[];
    page: number;
  }>({
    locais: [1],
    faixas: [1],
    page: 1,
  });

  // Carregar dimensões
  useEffect(() => {
    async function loadDims() {
      try {
        const dims = await fetchDimensoes();
        setLocais(dims.locais);
        setFaixas(dims.faixas);
        setSexos(dims.sexos);
        setSelectedSexos(dims.sexos.map((s: DimSexo) => s.id_sexo));
        setDimsLoaded(true);
      } catch (err) {
        console.error("Erro ao carregar dimensões:", err);
      }
    }
    loadDims();
  }, []);

  const dadosFiltrados = useMemo(() => {
    if (selectedSexos.length === 0) return [];
    return dados.filter((d) => selectedSexos.includes(d.id_sexo));
  }, [dados, selectedSexos]);

  // Carregar dados com filtros
  useEffect(() => {
    async function loadData() {
      if (!dimsLoaded) return;
      if (filters.locais.length === 0 || filters.faixas.length === 0) {
        setDados([]);
        return;
      }
      setLoading(true);
      setIsRefreshing(true);
      try {
        const fetchPromises: Promise<PaginatedResponse<TabuaMortalidade>>[] = [];
        filters.locais.forEach((localId) => {
          filters.faixas.forEach((faixaId) => {
            fetchPromises.push(
              fetchTabuaOriginal({
                page: 1,
                per_page: 2000,
                local: localId,
                faixa: faixaId,
              })
            );
          });
        });

        const responses = await Promise.all(fetchPromises);
        const merged = responses.flatMap((r) => r.data);
        setDados(merged);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
    loadData();
  }, [filters, dimsLoaded]);

  // Nomes amigáveis e descrições para exportação e cabeçalho
  const activeLocaisNames = useMemo(() => {
    if (filters.locais.length === 0) return "Nenhum local";
    return filters.locais
      .map(id => locais.find(l => l.id_local === id)?.nome_local || String(id))
      .join(", ");
  }, [locais, filters.locais]);

  const activeFaixasDescs = useMemo(() => {
    if (filters.faixas.length === 0) return "Nenhuma faixa";
    return filters.faixas
      .map(id => faixas.find(f => f.id_faixa === id)?.descricao || String(id))
      .join(", ");
  }, [faixas, filters.faixas]);

  // Nome do arquivo para download sanitizado
  const downloadFilename = useMemo(() => {
    const localNames = filters.locais
      .map((id) => locais.find((l) => l.id_local === id)?.nome_local || String(id))
      .join("_")
      .toLowerCase()
      .replace(/\s+/g, "_");
    const faixaDescs = filters.faixas
      .map((id) => faixas.find((f) => f.id_faixa === id)?.descricao || String(id))
      .join("_")
      .toLowerCase()
      .replace(/\s+/g, "_");
    return `expectativa_vida_${localNames}_faixas_${faixaDescs}`;
  }, [locais, faixas, filters.locais, filters.faixas]);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background via-background/95 to-background/90 text-foreground">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="max-w-6xl mx-auto">
          
          {/* Banner Hero */}
          <div className="text-center mb-12 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5 mb-4 hover:scale-105 transition-transform duration-300">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-400 to-cyan-300 bg-clip-text text-transparent mb-3">
              Expectativa de Vida
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Análise e acompanhamento histórico da evolução da expectativa de vida (e<sub>x</sub>) no Brasil de 2000 a 2023.
            </p>
          </div>

          {/* Card Unificado de Filtros (Sempre Visível) */}
          <Card className="border-primary/10 bg-card/40 backdrop-blur-md shadow-xl mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                Filtros de Análise
              </CardTitle>
              <CardDescription>Defina as faixas etárias e localidades para atualizar as projeções e tabelas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Faixas Etárias</label>
                  <MultiSelect
                    options={faixas.map((f) => ({ value: f.id_faixa, label: f.descricao }))}
                    selectedValues={filters.faixas}
                    onChange={(vals) => setFilters((prev) => ({ ...prev, faixas: vals, page: 1 }))}
                    placeholder="Selecionar faixas..."
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
          <Tabs defaultValue="grafico" className="w-full">
            <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 bg-muted/20 border border-primary/5 p-1 rounded-xl">
              <TabsTrigger value="grafico" className="rounded-lg py-2">Gráfico Histórico</TabsTrigger>
              <TabsTrigger value="tabela" className="rounded-lg py-2">Dados em Tabela</TabsTrigger>
            </TabsList>

            {/* Aba de Gráficos */}
            <TabsContent value="grafico" className="mt-6">
              <Card className="border-primary/10 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    Evolução Histórica
                  </CardTitle>
                  <CardDescription>
                    Expectativa de vida restante em anos (e<sub>x</sub>) para {activeLocaisNames} ({activeFaixasDescs}) ao longo do período observado.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {loading && dadosFiltrados.length === 0 ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-3 bg-muted/5 rounded-lg">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground animate-pulse">Carregando dados do gráfico...</span>
                    </div>
                  ) : (
                    <ExpectativaRechartsChart dados={dadosFiltrados} faixas={faixas} sexos={sexos} locais={locais} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba de Tabela */}
            <TabsContent value="tabela" className="mt-6">
              <Card className="border-primary/10 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden">
                <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Planilha de Registros</CardTitle>
                    <CardDescription>Mostrando {dadosFiltrados.length} registros observados filtrados por local e faixa etária</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <DownloadButton
                      dados={dadosFiltrados}
                      filename={downloadFilename}
                      locais={locais}
                      faixas={faixas}
                      sexos={sexos}
                      disabled={loading || dadosFiltrados.length === 0}
                      colunas={["ano", "faixa", "local", "sexo", "ex"]}
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
                            <th className="px-6 py-3.5 text-right font-mono">ex (anos)</th>
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
                                <td className="px-6 py-3">{sexos.find(s => s.id_sexo === item.id_sexo)?.descricao || item.id_sexo}</td>
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
                          Mostrando os primeiros 100 de {dadosFiltrados.length} registros. Utilize os filtros para refinar mais.
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
          <div className="grid grid-cols-1 gap-6 mt-8">
            <Card className="md:col-span-2 border-primary/10 bg-card/25 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-md flex items-center gap-2 text-primary">
                  <HelpCircle className="h-4 w-4" />
                  O que representa a Expectativa de Vida e<sub>x</sub>?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  A <strong>Expectativa de Vida à Idade x (e<sub>x</sub>)</strong> é o número médio de anos adicionais que uma pessoa que atingiu exatamente a idade <em>x</em> pode esperar viver, assumindo que as taxas de mortalidade observadas para cada grupo etário permaneçam constantes ao longo do restante de sua vida.
                </p>
                <p>
                  A expectativa de vida ao nascer (e<sub>0</sub>) é o indicador mais tradicional de saúde pública e desenvolvimento socioeconômico. Já as expectativas em idades ativas e avançadas servem como insumos cruciais para a precificação de <strong>planos de previdência</strong> e análise de <strong>sustentabilidade de sistemas previdenciários</strong>.
                </p>
              </CardContent>
            </Card>

            
          </div>

        </div>
      </div>
      <FloatingChat
        chartTitle="expectativa_vida"
        chartData={buildExpectativaVidaContext({
          dados: dadosFiltrados, filters, locais, faixas, sexos,
        })}
      />
    </div>
  );
};

export default ExpectativaVida;
