import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchDimensoes, fetchTabuaProjecoes } from "@/lib/api";
import { DimFaixa, DimLocal, DimModelo, DimSexo, PaginatedResponse, Projecoes } from "@/lib/services";
import { kMaxLength } from "buffer";
import { Target } from "lucide-react";
import { useEffect, useState } from "react";
import Previsoes from "@/components/charts/Previsoes";

const DadosPrevisao = () => {
  const [dados, setDados] = useState<Projecoes[]>([]);

  const [locais, setLocais] = useState<DimLocal[]>([]);
  const [sexos, setSexos] = useState<DimSexo[]>([]);
  const [faixas, setFaixas] = useState<DimFaixa[]>([]);
  const [modelos, setModelos] = useState<DimModelo[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [ano, setAno] = useState<number[]>([]);

  const [filters, setFilters] = useState({
    ano: 2024,
    local: 1,
    sexo: 1,
    faixa: 1,
    modelo: 1,
    page: 1,
  })

  useEffect(() => {
    async function loadDims () {
      try {
        const dims = await fetchDimensoes();
        setAno(dims.anos_projecoes);
        setLocais(dims.locais);
        setSexos(dims.sexos);
        setFaixas(dims.faixas);
        setModelos(dims.modelos);
      }
      catch (err) {
        console.error("Erro ao carregar dimensões:", err);
      }
    }
    loadDims();
  }, []);

  useEffect(() => {
    async function loadData() {
      //setLoading(true);
      try {
        const apiparams: any = {page:filters.page};
        if (filters.ano) apiparams.ano = filters.ano;
        if (filters.local) apiparams.local = filters.local;
        if (filters.modelo) apiparams.modelo = filters.modelo;

        const response: PaginatedResponse<Projecoes> = await fetchTabuaProjecoes(apiparams);
        setDados(response.data);
      }
      catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }
    loadData();
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
              <Target className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Previsão de Mortalidade</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Modelos preditivos para taxas de mortalidade futuras
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <label className="block text-sm font-medium mb-2">Ano</label>
              <select
                value={filters.ano}
                onChange={(e) => handleFilterChange("ano", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {ano.map((ano) => (
                  <option key={ano} value={ano}>
                    {ano}
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

            <div>
              <label className="block text-sm font-medium mb-2"> Modelo</label>
              <select
                value={filters.modelo}
                onChange={(e) => handleFilterChange("modelo", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {modelos.map((modelo) => (
                  <option value={modelo.id_modelo} key={modelo.id_modelo}>{modelo.descricao}</option>
                ))}
              </select>
            </div>

          </div>

          <Tabs defaultValue="previsao" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="previsao">Previsões</TabsTrigger>
              <TabsTrigger value="modelo">Modelo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="previsao" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Projeções Futuras</CardTitle>
                  <CardDescription>
                    Previsões baseadas em modelos estatísticos avançados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Previsoes dados={dados} faixas={faixas} sexos={sexos} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="modelo" className="mt-6">
              <Card>
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
                            <th className="px-4 text-left text-sm font-medium">Modelo</th>
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
                              <td className="px-4 py-2 text-sm">{modelos.find(f => f.id_modelo === item.id_modelo)?.descricao || item.id_modelo}</td>
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
          </Tabs>

          <div className="mt-8">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle>Aplicações das Previsões</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  As previsões de mortalidade são fundamentais para planejamento de políticas 
                  públicas, alocação de recursos em saúde e desenvolvimento de estratégias 
                  de prevenção. Nossos modelos auxiliam gestores na tomada de decisões 
                  baseadas em evidências.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DadosPrevisao;
