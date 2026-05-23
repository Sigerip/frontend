import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Loader2, Sparkles, Database, Filter } from "lucide-react";
import { DimFaixa, DimLocal, DimSexo, PaginatedResponse, type TabuaMortalidade } from "@/lib/services";
import MortalidadeRechartsChart from "@/components/charts/MortalidadeRechartsChart";
import DownloadButton from "@/components/DownloadButton";
import { fetchDimensoes, fetchTabuaOriginal } from "@/lib/api";
import DadosMortalidade2 from "@/components/charts/DadosMortalidade2";
import FloatingChat from "@/components/ChatFloat";
import { buildDadosMortalidadeContext } from "@/lib/buildChartContext";
import { MortalidadePorAnoPanel } from "@/components/MortalidadePorAnoPanel";
import { MultiSelect } from "@/components/ui/multi-select";
import { motion } from "motion/react";

const otimizarParaIA = (dados: TabuaMortalidade[]) => {
  return dados.map((item) => ({
    id_local: item.id_local,
    id_sexo: item.id_sexo,
    id_faixa: item.id_faixa,
    nMx: item.nMx ? Math.log10(Number(item.nMx.toFixed(4))) : null,
  }));
};

const DadosMortalidade = () => {
  const [locais, setLocais] = useState<DimLocal[]>([]);
  const [faixas, setFaixas] = useState<DimFaixa[]>([]);
  const [sexos, setSexos] = useState<DimSexo[]>([]);

  const [dados, setDados] = useState<TabuaMortalidade[]>([]);
  const [dados2, setDados2] = useState<TabuaMortalidade[]>([]);

  const [dimsLoaded, setDimsLoaded] = useState(false);
  const [selectedSexos, setSelectedSexos] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [anoOriginal, setAnoOriginal] = useState<number[]>([]);

  const [filters, setFilters] = useState<{
    anosOriginal: number[];
    locais: number[];
    page: number;
  }>({
    anosOriginal: [2000],
    locais: [1],
    page: 1,
  });

  const [graf2LocalIds, setGraf2LocalIds] = useState<number[]>([]);
  const [graf2FaixaIds, setGraf2FaixaIds] = useState<number[]>([]);
  const [graf2SexoIds, setGraf2SexoIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadDims() {
      try {
        const dims = await fetchDimensoes();
        setAnoOriginal(dims.anos_original);
        setLocais(dims.locais);
        setFaixas(dims.faixas);
        setSexos(dims.sexos);
        setSelectedSexos(dims.sexos.map((s: DimSexo) => s.id_sexo));
        if (dims.faixas?.length && dims.sexos?.length) {
          setGraf2FaixaIds([dims.faixas[0].id_faixa]);
          setGraf2SexoIds(dims.sexos.map((s: DimSexo) => s.id_sexo));
        }
        if (dims.locais?.length) {
          setGraf2LocalIds([dims.locais[0].id_local]);
        }
        setDimsLoaded(true);
      } catch (err) {
        console.error("Erro ao carregar dimensões", err);
      }
    }
    loadDims();
  }, []);

  const dadosFiltrados = useMemo(() => {
    if (selectedSexos.length === 0) return [];
    return dados.filter((d) => selectedSexos.includes(d.id_sexo));
  }, [dados, selectedSexos]);

  const dadosGraf1Filtrados = useMemo(() => otimizarParaIA(dadosFiltrados), [dadosFiltrados]);

  const dados2Filtrados = useMemo(() => {
    if (graf2FaixaIds.length === 0 || graf2SexoIds.length === 0 || graf2LocalIds.length === 0) return [];
    return dados2.filter(
      (d) =>
        graf2LocalIds.includes(d.id_local) &&
        graf2FaixaIds.includes(d.id_faixa) &&
        graf2SexoIds.includes(d.id_sexo),
    );
  }, [dados2, graf2LocalIds, graf2FaixaIds, graf2SexoIds]);

  const dados_graf_2 = useMemo(() => otimizarParaIA(dados2Filtrados), [dados2Filtrados]);

  useEffect(() => {
    async function loadTable() {
      if (!dimsLoaded) return;
      if (filters.locais.length === 0 || filters.anosOriginal.length === 0) {
        setDados([]);
        return;
      }
      setLoading(true);
      setIsRefreshing(true);
      try {
        const fetchPromises: Promise<PaginatedResponse<TabuaMortalidade>>[] = [];
        filters.locais.forEach((localId) => {
          filters.anosOriginal.forEach((anoVal) => {
            fetchPromises.push(
              fetchTabuaOriginal({
                page: 1,
                per_page: 2000,
                local: localId,
                ano: anoVal,
              })
            );
          });
        });

        const responses = await Promise.all(fetchPromises);
        const merged = responses.flatMap((r) => r.data);
        setDados(merged);

        if (graf2LocalIds.length === 0) {
          setDados2([]);
        } else {
          const responses2 = await Promise.all(
            graf2LocalIds.map((id) =>
              fetchTabuaOriginal({
                page: 1,
                per_page: 20000,
                local: id,
              }),
            ),
          );
          const merged2 = responses2.flatMap((r) => r.data);
          setDados2(merged2);
        }
      } catch (error) {
        console.error("Erro ao buscar tabela", error);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
    loadTable();
  }, [filters, graf2LocalIds, dimsLoaded]);

  // Nomes por extenso dos locais selecionados
  const activeLocaisNames = useMemo(() => {
    if (filters.locais.length === 0) return "Nenhum local";
    return filters.locais
      .map((id) => locais.find((l) => l.id_local === id)?.nome_local || String(id))
      .join(", ");
  }, [locais, filters.locais]);

  const downloadFilename = useMemo(() => {
    const localNames = filters.locais
      .map((id) => locais.find((l) => l.id_local === id)?.nome_local || String(id))
      .join("_")
      .toLowerCase()
      .replace(/\s+/g, "_");
    const years = filters.anosOriginal.join("_");
    return `mortalidade_geral_${localNames}_anos_${years}`;
  }, [locais, filters.locais, filters.anosOriginal]);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background via-background/95 to-background/90 text-foreground">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Banner Hero */}
        <div className="text-center mb-12 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5 mb-4 hover:scale-105 transition-transform duration-300">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-400 to-cyan-300 bg-clip-text text-transparent mb-3 animate-fade-in">
            Dados de Mortalidade Geral
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Consulte as tábuas de mortalidade originais coletadas para alimentar nossos modelos preditivos.
          </p>
        </div>

        {/* Card Unificado de Filtros Superiores (Sempre Visível) */}
        <Card className="border-primary/10 bg-card/40 backdrop-blur-md shadow-xl mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              Filtros Principais
            </CardTitle>
            <CardDescription>Estes parâmetros afetam a Tabela e o gráfico de Mortalidade por Faixa Etária</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Anos de Referência</label>
                <MultiSelect
                  options={anoOriginal.map((a) => ({ value: a, label: String(a) }))}
                  selectedValues={filters.anosOriginal}
                  onChange={(vals) => setFilters((prev) => ({ ...prev, anosOriginal: vals, page: 1 }))}
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

        {/* Abas */}
        <Tabs defaultValue="graficos" className="w-full">
          <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 bg-muted/20 border border-primary/5 p-1 rounded-xl">
            <TabsTrigger value="graficos" className="rounded-lg py-2">Gráficos</TabsTrigger>
            <TabsTrigger value="tabela" className="rounded-lg py-2">Tabela</TabsTrigger>
          </TabsList>

          {/* Aba Tabela */}
          <TabsContent value="tabela" className="mt-6">
            <Card className="border-primary/10 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-xl">Tábua Atuarial Simplificada</CardTitle>
                  <CardDescription>{dadosFiltrados.length} registros para {activeLocaisNames} em {filters.anosOriginal.join(", ")}</CardDescription>
                </div>
                <DownloadButton
                  dados={dadosFiltrados}
                  filename={downloadFilename}
                  disabled={loading}
                  locais={locais}
                  faixas={faixas}
                  sexos={sexos}
                  colunas={["ano", "faixa", "local", "sexo", "nMx", "ex"]}
                />
              </CardHeader>
              <CardContent className={`px-0 transition-opacity duration-300 ${isRefreshing ? "opacity-50" : "opacity-100"}`}>
                {loading && dadosFiltrados.length === 0 ? (
                  <div className="h-96 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : dadosFiltrados.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted/30 border-b border-primary/5 text-muted-foreground text-left text-xs font-semibold uppercase tracking-wider">
                          <th className="px-6 py-3.5">Ano</th>
                          <th className="px-6 py-3.5">Faixa</th>
                          <th className="px-6 py-3.5">Local</th>
                          <th className="px-6 py-3.5">Sexo</th>
                          <th className="px-6 py-3.5 text-right">nMx</th>
                          <th className="px-6 py-3.5 text-right">ex</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/5 text-sm">
                        {dadosFiltrados.slice(0, 100).map((item) => (
                          <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-6 py-3 font-medium text-primary/80">{item.ano}</td>
                            <td className="px-6 py-3">
                              {faixas.find((f) => f.id_faixa === item.id_faixa)?.descricao || item.id_faixa}
                            </td>
                            <td className="px-6 py-3">
                              {locais.find((f) => f.id_local === item.id_local)?.nome_local || item.id_local}
                            </td>
                            <td className="px-6 py-3">
                              {sexos.find((f) => f.id_sexo === item.id_sexo)?.descricao || item.id_sexo}
                            </td>
                            <td className="px-6 py-3 text-right font-mono font-bold text-foreground">{item.nMx?.toFixed(6)}</td>
                            <td className="px-6 py-3 text-right font-mono text-foreground">{item.ex?.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {dadosFiltrados.length > 100 && (
                      <p className="text-xs text-muted-foreground mt-4 py-4 text-center border-t border-primary/5">
                        Mostrando os primeiros 100 de {dadosFiltrados.length} registros.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center text-muted-foreground">
                    Sem registros para esta consulta.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Gráficos */}
          <TabsContent value="graficos" className="mt-6">
            <div className="space-y-8">
              
              {/* Gráfico 1: Mortalidade por Faixa */}
              <Card className="border-primary/10 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Mortalidade por Faixa-Etária ({filters.anosOriginal.join(", ")} - {activeLocaisNames})
                  </CardTitle>
                  <CardDescription>
                    Curvas do logaritmo de nMx exibidas por faixas de idade. Padrão "U" de mortalidade populacional.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading && dadosFiltrados.length === 0 ? (
                    <div className="h-96 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <MortalidadeRechartsChart dados={dadosFiltrados} faixas={faixas} sexos={sexos} locais={locais} />
                  )}
                </CardContent>
              </Card>

              {/* Gráfico 2: Mortalidade por Ano */}
              <Card className="border-primary/10 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    Mortalidade por Série de Anos
                  </CardTitle>
                  <CardDescription>
                    Escolha múltiplos territórios, faixas e sexos para analisar a redução da taxa ao longo do tempo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MortalidadePorAnoPanel
                    locais={locais}
                    faixas={faixas}
                    sexos={sexos}
                    selectedLocalIds={graf2LocalIds}
                    onLocalIdsChange={setGraf2LocalIds}
                    selectedFaixaIds={graf2FaixaIds}
                    onFaixaIdsChange={setGraf2FaixaIds}
                    selectedSexoIds={graf2SexoIds}
                    onSexoIdsChange={setGraf2SexoIds}
                    disabled={loading}
                  />

                  <div className="mt-8">
                    {loading ? (
                      <div className="flex h-96 items-center justify-center rounded-xl bg-muted/20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <DadosMortalidade2 dados={dados2Filtrados} faixas={faixas} sexos={sexos} locais={locais} />
                    )}
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <FloatingChat
        chartTitle="dados_mortalidade"
        chartData={buildDadosMortalidadeContext({
          dados: dadosGraf1Filtrados,
          dados2: dados_graf_2,
          filters: {
            ...filters,
            graf2LocalIds,
            graf2FaixaIds,
            graf2SexoIds,
          },
          locais,
          faixas,
          sexos,
        })}
      />
    </div>
  );
};

export default DadosMortalidade;
