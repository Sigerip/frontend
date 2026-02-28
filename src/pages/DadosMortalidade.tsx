import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Loader2 } from "lucide-react";
import { DimFaixa, DimLocal, DimSexo, PaginatedResponse, tabuaMortalidadeService, type TabuaMortalidade } from "@/lib/services";
import MortalidadeD3Chart from "@/components/charts/MortalidadeD3Chart";
import DownloadButton from "@/components/DownloadButton";
import { fetchDimensoes, fetchTabuaOriginal } from "@/lib/api";
import DadosMortalidade2 from "@/components/charts/DadosMortalidade2";

const DadosMortalidade = () => {
  const [locais, setLocais] = useState<DimLocal[]>([]);
  const [faixas, setFaixas] = useState<DimFaixa[]>([]);
  const [sexos, setSexos] = useState<DimSexo[]>([]);

  const [dados, setDados] = useState<TabuaMortalidade[]>([]);
  const [dados2, setDados2] = useState<TabuaMortalidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // Loading sutil para atualizações
  const [error, setError] = useState<string | null>(null);
  const [ano, setAno] = useState(2000);
  const [anoOriginal, setAnoOriginal] = useState<number[]>([]);
  
  const [local, setLocal] = useState<string>("Brasil");

  const [filters, setFilters] = useState({
    anoOriginal: 2000,
    local: 1,
    page: 1,
    faixa: 1,
    local2: 1,
  })

  useEffect(() =>{
    async function loadDims () {
      try {
        const dims = await fetchDimensoes();
        setAnoOriginal(dims.anos_original);
        setLocais(dims.locais);
        setFaixas(dims.faixas);
        setSexos(dims.sexos);
      }
      catch (err) {
        console.error("Erro ao carregar dimensões", err);
      }
    }
    loadDims();
  }, []);

  useEffect(() => {
    async function loadTable() {
      setLoading(true);
      try {
        const apiparams: any = {page: filters.page };
        if (filters.anoOriginal) apiparams.ano = filters.anoOriginal;
        if (filters.local) apiparams.local = filters.local;

        const apiparams2: any = {page: filters.page };
        if (filters.local2) apiparams2.local = filters.local2;
        if (filters.faixa) apiparams2.faixa = filters.faixa;

        const response: PaginatedResponse<TabuaMortalidade> = await fetchTabuaOriginal(apiparams);
        const response2: PaginatedResponse<TabuaMortalidade> = await fetchTabuaOriginal(apiparams2);
        setDados2(response2.data);
        setDados(response.data);
      }
      catch (error) {
        console.error("Erro ao buscar tabela", error);
      }
      finally {
        setLoading(false);
      }
    }
    loadTable();
  }, [filters]);

  const handleFilterChange = (field: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [field]: Number(value), page: 1 })); // Reseta p/ pagina 1 ao filtrar
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-4">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Dados de Mortalidade</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Análise dos dados originais coletados
            </p>
          </div>          

          <Tabs defaultValue="graficos" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="graficos">Gráficos</TabsTrigger>
              <TabsTrigger value="tabela">Tabela</TabsTrigger>
            </TabsList>

            <TabsContent value="tabela" className="mt-6">
              <h3 className="text-3xl font-bold mb-4 text-center">Tábua de Mortalidade</h3>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardDescription>{dados.length} registros filtrados</CardDescription>
                  </div>
                  <DownloadButton 
                    dados={dados}
                    filename={`tabua_mortalidade_${ano}_${local}`}
                    //fetchAllData={fetchAllData}
                    disabled={isRefreshing}
                  />
                </CardHeader>
                <CardContent className={`transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
                  {dados.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium">Ano</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Faixa</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Local</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Sexo</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">nMx</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">ex</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {dados.slice(0, 100).map((item) => (
                            <tr key={item.id} className="hover:bg-muted/50">
                              <td className="px-4 py-2 text-sm">{item.ano}</td>
                              <td className="px-4 py-2 text-sm">{faixas.find(f => f.id_faixa === item.id_faixa)?.descricao || item.id_faixa}</td>
                              <td className="px-4 py-2 text-sm">{locais.find(f => f.id_local === item.id_local)?.nome_local || item.id_local}</td>
                              <td className="px-4 py-2 text-sm">{sexos.find(f => f.id_sexo === item.id_sexo)?.descricao || item.id_sexo}</td>
                              <td className="px-4 py-2 text-sm font-mono">{item.nMx?.toFixed(6)}</td>
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
                    <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">Nenhum dado disponivel</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="graficos" className="mt-6">

              <Card className="mb-6">
                <CardHeader>
                  <h3 className="text-center mt-6 text-3xl font-bold">Mortalidade Por Faixa-Etária</h3>
                  <CardTitle className="flex items-center gap-2">
                    
                    {isRefreshing && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <label className="block text-sm font-medium mb-2">Ano</label>
                      <select
                        value={filters.anoOriginal}
                        onChange={(e) => handleFilterChange("anoOriginal", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        {anoOriginal.map((anoOriginal) => (
                          <option key={anoOriginal} value={anoOriginal}>
                            {anoOriginal}
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
                        {locais.map((local) =>(
                          <option value={local.id_local} key={local.id_local}>
                            {local.nome_local}
                          </option>
                        ))}
                      </select>
                    </div>                
                  </div>
                  <MortalidadeD3Chart dados={dados} faixas={faixas} sexos={sexos} />
                
                  <h3 className="text-center mt-12 text-3xl font-bold mb-6">Mortalidade Por Ano</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <label className="block text-sm font-medium mb-2">Faixa</label>
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
                        value={filters.local2}
                        onChange={(e) => handleFilterChange("local2", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        {locais.map((local2) =>(
                          <option value={local2.id_local} key={local2.id_local}>
                            {local2.nome_local}
                          </option>
                        ))}
                      </select>
                    </div>                
                  </div>
                  <DadosMortalidade2 dados={dados2} faixas={faixas} sexos={sexos}/>
                </CardContent>
              </Card>

            </TabsContent>
          </Tabs>


          
        </div>
      </div>
    </div>
  );
};

export default DadosMortalidade;
