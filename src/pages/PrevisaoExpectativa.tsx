import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, TrendingUp } from "lucide-react";
import { DimFaixa, DimLocal, DimModelo, DimSexo, PaginatedResponse, type Projecoes } from "@/lib/services";
import { fetchDimensoes, fetchTabuaProjecoes } from "@/lib/api";
import ExpectativaVidaChart from "@/components/charts/expectativa";
import DownloadButton from "@/components/DownloadButton";

const ExpectativaVida = () => {
  const [locais, setLocais] = useState<DimLocal[]>([]);
  const [faixas, setFaixas] = useState<DimFaixa[]>([]);
  const [sexos, setSexos] = useState<DimSexo[]>([]);
  const [modelos, setModelos] = useState<DimModelo[]>([]);

  const [dados, setDados] = useState<Projecoes[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [filters, setFilters] = useState({
    local: 1,
    faixa: 1,
    page: 1,
    modelo: 1,
  });

  // Carregar dimensões
  useEffect(() => {
    async function loadDims() {
      try {
        const dims = await fetchDimensoes();
        setLocais(dims.locais);
        setFaixas(dims.faixas);
        setSexos(dims.sexos);
        setModelos(dims.modelos);
      } catch (err) {
        console.error("Erro ao carregar dimensões:", err);
      }
    }
    loadDims();
  }, []);

  // Carregar dados com filtros
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const apiparams: any = { page: filters.page };
        if (filters.local) apiparams.local = filters.local;
        if (filters.faixa) apiparams.faixa = filters.faixa;
        if (filters.modelo) apiparams.modelo = filters.modelo;

        const response: PaginatedResponse<Projecoes> = await fetchTabuaProjecoes(apiparams);
        setDados(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [filters]);

  const handleFilterChange = (field: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [field]: Number(value), page: 1 }));
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-4">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Previsão da Expectativa de Vida</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Análise da previsão da expectativa de vida no Brasil entre 2024-2070.
            </p>
          </div>

          <Tabs defaultValue="grafico" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="grafico">Gráfico</TabsTrigger>
              <TabsTrigger value="tabela">Tabela</TabsTrigger>
            </TabsList>

            <TabsContent value="grafico" className="mt-6">
              <Card>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 mt-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">Faixa Etária</label>
                      <select
                        value={filters.faixa}
                        onChange={(e) => handleFilterChange("faixa", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        {faixas.map((faixa) => (
                          <option key={faixa.id_faixa} value={faixa.id_faixa}>
                            {faixa.descricao}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Local</label>
                      <select
                        value={filters.local}
                        onChange={(e) => handleFilterChange("local", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        {locais.map((local) => (
                          <option value={local.id_local} key={local.id_local}>
                            {local.nome_local}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Modelo</label>
                      <select
                        value={filters.modelo}
                        onChange={(e) => handleFilterChange("modelo", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        {modelos.map((modelo) => (
                          <option value={modelo.id_modelo} key={modelo.id_modelo}>
                            {modelo.descricao}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {loading ? (
                    <div className="h-96 flex items-center justify-center bg-muted/30 rounded-lg">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <ExpectativaVidaChart dados={dados} faixas={faixas} sexos={sexos} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tabela" className="mt-6">
              <h3 className="text-3xl font-bold mb-4 text-center">Dados de Expectativa de Vida</h3>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardDescription>{dados.length} registros filtrados</CardDescription>
                  </div>
                  <DownloadButton
                    dados={dados}
                    filename={`expectativa_vida_${filters.local}_faixa${filters.faixa}`}
                    disabled={loading}
                  />
                </CardHeader>
                <CardContent className={`transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
                  {/* Filtros na tabela também */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Faixa Etária</label>
                      <select
                        value={filters.faixa}
                        onChange={(e) => handleFilterChange("faixa", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        {faixas.map((faixa) => (
                          <option key={faixa.id_faixa} value={faixa.id_faixa}>
                            {faixa.descricao}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Local</label>
                      <select
                        value={filters.local}
                        onChange={(e) => handleFilterChange("local", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        {locais.map((local) => (
                          <option value={local.id_local} key={local.id_local}>
                            {local.nome_local}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Modelo</label>
                      <select
                        value={filters.modelo}
                        onChange={(e) => handleFilterChange("modelo", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        {modelos.map((modelo) => (
                          <option value={modelo.id_modelo} key={modelo.id_modelo}>
                            {modelo.descricao}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {dados.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium">Ano</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Faixa</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Local</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Sexo</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Modelo</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">ex (anos)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {dados.slice(0, 100).map((item) => (
                            <tr key={item.id} className="hover:bg-muted/50">
                              <td className="px-4 py-2 text-sm">{item.ano}</td>
                              <td className="px-4 py-2 text-sm">{faixas.find(f => f.id_faixa === item.id_faixa)?.descricao || item.id_faixa}</td>
                              <td className="px-4 py-2 text-sm">{locais.find(f => f.id_local === item.id_local)?.nome_local || item.id_local}</td>
                              <td className="px-4 py-2 text-sm">{sexos.find(f => f.id_sexo === item.id_sexo)?.descricao || item.id_sexo}</td>
                              <td className="px-4 py-2 text-sm">{modelos.find(m => m.id_modelo === item.id_modelo)?.descricao || item.id_modelo}</td>
                              <td className="px-4 py-2 text-sm font-mono">{item.ex?.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {dados.length > 100 && (
                        <p className="text-sm text-muted-foreground mt-4 text-center">
                          Mostrando 100 de {dados.length} registros
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="h-96 flex items-center justify-center bg-muted/30">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ExpectativaVida;
