import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  BookOpen, 
  Activity, 
  TrendingUp, 
  Cpu, 
  Calendar, 
  Percent, 
  FileText,
  ChevronRight,
  Database
} from "lucide-react";

const Metodologia = () => {
  const [ativarSecao, setAtivarSecao] = useState("");

  const secoes = [
    { id: "mortalidade-infantil", titulo: "Mortalidade Infantil", icon: Activity },
    { id: "mortalidade-geral", titulo: "Mortalidade Geral", icon: Database },
    { id: "projecoes-ibge", titulo: "Projeções IBGE", icon: TrendingUp },
    { id: "lee-carter", titulo: "Lee-Carter", icon: Cpu },
    { id: "lee-miller", titulo: "Lee-Miller", icon: Cpu },
    { id: "arima-ets", titulo: "ARIMA + ETS", icon: Cpu },
    { id: "nnar", titulo: "ARIMA + ETS + NNAR", icon: Cpu },
    { id: "divisao-temporal", titulo: "Divisão Temporal", icon: Calendar },
    { id: "metricas", titulo: "Métricas", icon: Percent },
  ];

  useEffect(() => {
    const observar = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entry) => {
          if (entry.isIntersecting) {
            setAtivarSecao(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    secoes.forEach((secao) => {
      const element = document.getElementById(secao.id);
      if (element) observar.observe(element);
    });
    return () => observar.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 text-foreground py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Glowing background decorations */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-3xl -z-10 animate-pulse duration-[8s]" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary uppercase tracking-wider">
            <BookOpen size={14} />
            Metodologia Científica
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Nossos{' '}
            <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-300 bg-clip-text text-transparent">
              Métodos e Técnicas
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Conheça as bases estatísticas, modelos preditivos e tratamentos demográficos utilizados para gerar as estimativas.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* GUIA LATERAL (Sticky) - Hidden on mobile */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 p-6 bg-card/20 backdrop-blur-md border border-primary/10 rounded-2xl space-y-4 shadow-xl">
              <p className="font-bold uppercase text-[10px] text-primary tracking-widest mb-4">
                Nesta página
              </p>
              <nav className="flex flex-col space-y-2">
                {secoes.map((secao) => {
                  const Icon = secao.icon;
                  return (
                    <a
                      key={secao.id}
                      href={`#${secao.id}`}
                      className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 border ${
                        ativarSecao === secao.id
                          ? "bg-primary/10 text-white border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] font-semibold"
                          : "text-muted-foreground border-transparent hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      <Icon size={16} className={ativarSecao === secao.id ? "text-primary" : "text-muted-foreground"} />
                      <span>{secao.titulo}</span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <div className="flex-1 space-y-12 max-w-4xl">
            
            {/* Banco de dados de mortalidade infantil */}
            <motion.section 
              id="mortalidade-infantil" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24 bg-card/20 backdrop-blur-md border border-primary/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                  <Activity size={20} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Banco de Dados de Mortalidade Infantil</h2>
              </div>
              <div className="space-y-4 text-justify leading-relaxed text-muted-foreground text-sm md:text-base">
                <p>
                  A base de dados de mortalidade infantil utilizada neste projeto foi construída a partir de fontes oficiais, com rigorosos procedimentos de coleta, tratamento e validação. Os dados foram extraídos do Sistema de Informações sobre Nascidos Vivos (SINASC) e do Sistema de Informações sobre Mortalidade (SIM), ambos via <a href="https://datasus.saude.gov.br/informacoes-de-saude-tabnet/" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">Tabnet/DATASUS</a>, já consolidados e validados pelo <a href="https://docs.google.com/spreadsheets/d/1mJ4NdolOPlsAykFTHolrnh8odUaZE5WM/edit?gid=1015938775#gid=1015938775" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">IBGE</a>. O período analisado compreende os anos de 2000 a 2023, abrangendo recortes nacional, regional, estadual e municipal, o que permite análises comparativas e identificação de padrões regionais e locais.
                </p>
                <p>
                  A principal variável analisada é a taxa de mortalidade infantil (TMI), definida como o número de óbitos de crianças menores de um ano por mil nascidos vivos em determinado ano e localidade. A TMI é calculada como:
                </p>
                
                <div className="my-6 py-6 px-4 text-center overflow-x-auto">
                  <div className="inline-flex items-center justify-center gap-3 font-serif text-lg md:text-xl italic text-black dark:text-white">
                    <span>TMI<sub>i,t</sub> = </span>
                    <div className="inline-flex flex-col items-center justify-center mx-1.5 align-middle">
                      <span className="text-sm md:text-base text-black dark:text-white pb-1 px-3 text-center font-serif">Óbitos &lt; 1 ano<sub>i,t</sub></span>
                      <div className="w-full h-[1.5px] bg-black/30 dark:bg-white/30" />
                      <span className="text-sm md:text-base text-black dark:text-white pt-1 px-3 text-center font-serif">Nascidos Vivos<sub>i,t</sub></span>
                    </div>
                    <span className="text-black dark:text-white font-sans font-semibold">× 1000</span>
                  </div>
                </div>
                
                <p>
                  Para garantir a qualidade dos dados, registros inconsistentes e referentes a "Município Ignorado" foram excluídos, e a análise foi restrita ao período pós-2000 devido à maior confiabilidade dos registros. O processamento e validação dos dados foram realizados com o auxílio de rotinas em Python para automação e checagem.
                </p>
              </div>
            </motion.section>

            {/* Banco de dados de mortalidade geral e tábuas de vida */}
            <motion.section 
              id="mortalidade-geral" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24 bg-card/20 backdrop-blur-md border border-primary/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0" />
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                  <Database size={20} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Banco de Dados de Mortalidade Geral e Tábuas de Vida</h2>
              </div>
              <div className="space-y-4 text-justify leading-relaxed text-muted-foreground text-sm md:text-base">
                <p>
                  A base de mortalidade geral e as tábuas de vida utilizadas seguem rigorosamente a metodologia oficial do IBGE, conforme detalhado nas Notas Metodológicas 01/2024. As tábuas são abreviadas, estruturadas em grupos etários quinquenais (0, 1-4, 5-9, ..., 90+), e cobrem o período de 2000 a 2070, sendo 2000-2023 dados observados e 2024-2070 projeções.
                </p>
                <p>
                  A construção das tábuas parte dos registros de óbitos (SIM) e das estimativas populacionais dos Censos Demográficos (2000, 2010, 2022), ajustados para cobertura e qualidade. O IBGE aplica técnicas como Busca Ativa, Captura-Recaptura e modelos logísticos para corrigir sub-registros e distorções, especialmente em idades avançadas, onde se utiliza o modelo log-quadrático de Wilmoth et al. (2012) e ajustes propostos pela ONU.
                </p>
                <p>
                  As principais variáveis das tábuas incluem: probabilidade de morte (<sub>n</sub>q<sub>x</sub>), sobreviventes (l<sub>x</sub>), óbitos (d<sub>x</sub>), pessoas-ano vividas (<sub>n</sub>L<sub>x</sub>), total de pessoas-ano acima da idade x (T<sub>x</sub>), expectativa de vida (e<sub>x</sub>) e, fundamentalmente para este projeto, a taxa central de mortalidade por grupo etário (<sub>n</sub>M<sub>x</sub>). A <sub>n</sub>M<sub>x</sub> representa a razão entre o número de óbitos ajustados e a população correspondente em cada grupo etário, sendo a principal variável utilizada para as previsões de mortalidade por idade.Essas tábuas permitem análises detalhadas e comparáveis dos padrões de mortalidade, sendo fundamentais para a avaliação de tendências e para a calibração dos modelos preditivos.
                </p>
              </div>
            </motion.section>

            {/* Projeções oficiais do IBGE até 2070 */}
            <motion.section 
              id="projecoes-ibge" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24 bg-card/20 backdrop-blur-md border border-primary/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0" />
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                  <TrendingUp size={20} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Projeções Oficiais do IBGE até 2070</h2>
              </div>
              <div className="space-y-4 text-justify leading-relaxed text-muted-foreground text-sm md:text-base">
                <p>
                  As projeções oficiais do IBGE para mortalidade até 2070 baseiam-se em hipóteses de convergência da esperança de vida ao nascer, com limites superiores de 85 anos para homens e 88 anos para mulheres, alinhados às Tábuas Modelo Oeste da ONU. O ajuste é feito por interpolação entre os padrões observados em 2023 e os limites de 2100, garantindo coerência entre nível e estrutura etária da mortalidade projetada. A metodologia está descrita em IBGE. Projeções da população: <a href="https://biblioteca.ibge.gov.br/index.php/biblioteca-catalogo?view=detalhes&id=2102111" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">notas metodológicas 01/2024</a>.
                </p>
                <p>
                  Destaca-se, contudo, que o IBGE não informa se suas projeções foram submetidas a análises quantitativas de desempenho ou a métricas formais de avaliação preditiva, razão pela qual tais indicadores não estão disponíveis publicamente. Por esse motivo, e para garantir a comparabilidade com as demais projeções alternativas, utilizou-se neste projeto apenas as tábuas e projeções oficialmente publicadas pelo IBGE, sem aplicação ou reprodução de eventuais equações logísticas internas do órgão.
                </p>
              </div>
            </motion.section>

            {/* Modelo Lee-Carter */}
            <motion.section 
              id="lee-carter" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24 bg-card/20 backdrop-blur-md border border-primary/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                  <Cpu size={20} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Modelo Lee-Carter</h2>
              </div>
              <div className="space-y-4 text-justify leading-relaxed text-muted-foreground text-sm md:text-base">
                <p>
                  O modelo Lee-Carter (1992) é um dos métodos mais consagrados para projeção de mortalidade, especialmente por sua capacidade de capturar tendências de longo prazo e mudanças estruturais. Ele modela a taxa central de mortalidade (<sub>n</sub>M<sub>x</sub>) por idade e ano como:
                </p>
                
                <div className="my-6 py-5 px-4 text-center overflow-x-auto">
                  <div className="inline-flex items-center justify-center gap-2 font-serif text-lg md:text-xl italic text-black dark:text-white">
                    <span>ln(m<sub>x,t</sub>) = a<sub>x</sub> + b<sub>x</sub>k<sub>t</sub> + ε<sub>x,t</sub></span>
                  </div>
                </div>
                
                <p>onde os componentes representam:</p>
                <ul className="space-y-3 pl-4">
                  <li className="flex items-start gap-2.5">
                    <ChevronRight size={16} className="text-primary mt-1 shrink-0" />
                    <span><strong className="text-foreground">a<sub>x</sub></strong>: Padrão médio estrutural da mortalidade por idade (não varia com o tempo).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ChevronRight size={16} className="text-primary mt-1 shrink-0" />
                    <span><strong className="text-foreground">b<sub>x</sub></strong>: Sensibilidade e velocidade de declínio/variação da mortalidade por idade.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ChevronRight size={16} className="text-primary mt-1 shrink-0" />
                    <span><strong className="text-foreground">k<sub>t</sub></strong>: Índice geral de declínio temporal da mortalidade.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ChevronRight size={16} className="text-primary mt-1 shrink-0" />
                    <span><strong className="text-foreground">ε<sub>x,t</sub></strong>: Termo de erro estocástico com média zero.</span>
                  </li>
                </ul>
                <p className="mt-4">
                  A estimação dos parâmetros é realizada por decomposição de valores singulares (SVD), utilizando o pacote <em>demography</em> (R). O componente temporal k<sub>t</sub> é projetado via modelo ARIMA(0,1,0) (passeio aleatório com drift), ajustado com o pacote <em>forecast</em>. O modelo é avaliado por faixa etária, permitindo identificar a acurácia em cada grupo e facilitando a comparação com outros métodos.
                </p>
              </div>
            </motion.section>

            {/* Modelo Lee-Miller */}
            <motion.section 
              id="lee-miller" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24 bg-card/20 backdrop-blur-md border border-primary/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0" />
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                  <Cpu size={20} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Modelo Lee-Miller</h2>
              </div>
              <div className="space-y-4 text-justify leading-relaxed text-muted-foreground text-sm md:text-base">
                <p>
                  A variante Lee-Miller (2001) foi desenvolvida para corrigir a tendência do Lee-Carter de subestimar a expectativa de vida projetada, especialmente em idades avançadas. Após a aplicação da SVD, o vetor k<sub>t</sub> é reajustado iterativamente para que as taxas projetadas repliquem com maior precisão a expectativa de vida observada, conforme a seguinte regra:
                </p>

                <div className="my-6 py-6 px-4 text-center overflow-x-auto">
                  <div className="inline-flex items-center justify-center gap-1 font-serif text-lg md:text-xl italic text-black dark:text-white">
                    <span>k<sub>t</sub><sup>(j+1)</sup> = k<sub>t</sub><sup>(j)</sup> + Σ<sub>x</sub> b<sub>x</sub> × </span>
                    
                    {/* Estrutura da Fração */}
                    <div className="inline-flex flex-col items-center justify-center mx-1.5 align-middle">
                      {/* Numerador */}
                      <span className="text-sm md:text-base text-black dark:text-white pb-1 px-3 text-center">
                        L<sub>x</sub>
                      </span>
                      
                      {/* Linha da Fração */}
                      <div className="w-full h-[1.5px] bg-black/30 dark:bg-white/30" />
                      
                      {/* Denominador */}
                      <span className="text-sm md:text-base text-black dark:text-white pt-1 px-3 text-center">
                        (e<sub>0,t</sub><sup>obs</sup> − e<sub>0,t</sub><sup>proj(j)</sup>)
                      </span>
                    </div>

                  </div>
                </div>
                
                <p>
                  Esse ajuste é repetido até que a diferença entre a expectativa de vida observada e projetada seja inferior a um limiar pré-definido (10<sup>−4</sup>). A implementação foi gerada com o pacote <em>demography</em> em R. Assim como no Lee-Carter, as avaliações são feitas por faixa etária, permitindo identificar ganhos de precisão em grupos específicos.
                </p>
              </div>
            </motion.section>

            {/* Modelo combinado ARIMA + ETS */}
            <motion.section 
              id="arima-ets" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24 bg-card/20 backdrop-blur-md border border-primary/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0" />
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                  <Cpu size={20} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Modelo Combinado ARIMA + ETS</h2>
              </div>
              <div className="space-y-4 text-justify leading-relaxed text-muted-foreground text-sm md:text-base">
                <p>
                  O modelo combinado ARIMA+ETS integra duas abordagens clássicas de séries temporais para previsão da taxa central de mortalidade <sub>n</sub>M<sub>x</sub> por idade, sexo e localidade.
                </p>
                
                <p>
                  <strong className="text-foreground">ARIMA (AutoRegressive Integrated Moving Average):</strong> Modelo clássico para séries temporais, capaz de capturar padrões lineares, tendências e sazonalidades. A estrutura geral é:
                </p>
                
                <div className="my-6 py-5 px-4 text-center overflow-x-auto">
                  <div className="inline-flex items-center justify-center gap-2 font-serif text-lg md:text-xl italic text-black dark:text-white">
                    <span>Φ<sub>p</sub>(B)Φ<sub>P</sub>(B<sup>s</sup>)(1 − B)<sup>d</sup>(1 − B<sup>s</sup>)<sup>D</sup>y<sub>t</sub> = Θ<sub>q</sub>(B)Θ<sub>Q</sub>(B<sup>s</sup>)ε<sub>t</sub></span>
                  </div>
                </div>
                
                <p>
                  Os melhores hiperparâmetros são selecionados automaticamente via <em>auto.arima()</em> do pacote <em>forecast</em> (R).
                </p>

                <p className="mt-4">
                  <strong className="text-foreground">ETS (Error, Trend, Seasonality):</strong> Modelo que decompõe a série em componentes de erro, tendência e sazonalidade, com variantes aditivas e multiplicativas. A estrutura básica é:
                </p>
                
                <div className="my-6 py-5 px-4 text-center overflow-x-auto">
                  <div className="inline-flex items-center justify-center gap-2 font-serif text-lg md:text-xl italic text-black dark:text-white">
                    <span>y<sub>t</sub> = ℓ<sub>t−1</sub> + b<sub>t−1</sub> + s<sub>t−m</sub> + ε<sub>t</sub></span>
                  </div>
                </div>
                
                <p>
                  O ajuste é feito via máxima verossimilhança utilizando a função <em>ets()</em> do pacote <em>forecast</em> (R).
                </p>

                <p className="mt-4">
                  As previsões de cada modelo são combinadas por faixa etária, utilizando pesos inversamente proporcionais ao erro quadrático médio (RMSE) obtido no conjunto de validação para cada grupo etário:
                </p>
                
                <div className="my-6 py-6 px-4 text-center overflow-x-auto space-y-6">
                  <div className="inline-flex items-center justify-center gap-2 font-serif text-lg md:text-xl italic text-black dark:text-white">
                    <span>W<sub>i</sub> = </span>
                    <div className="inline-flex flex-col items-center justify-center mx-2 align-middle">
                      <div className="inline-flex flex-col items-center justify-center mx-1.5 pb-1 text-xs md:text-sm">
                        <span className="text-black dark:text-white">1</span>
                        <div className="w-full h-[1px] bg-black/30 dark:bg-white/30 my-0.5" />
                        <span className="text-black dark:text-white font-serif">RMSE<sub>i</sub></span>
                      </div>
                      <div className="w-full h-[1.5px] bg-black/30 dark:bg-white/30" />
                      <div className="inline-flex items-center gap-1.5 pt-1">
                        <div className="inline-flex flex-col items-center justify-center align-middle leading-none mx-0.5">
                          <span className="text-xl md:text-2xl text-black dark:text-white">Σ</span>
                          <span className="text-[10px] text-black/70 dark:text-white/70 font-semibold mt-[-2px]">j</span>
                        </div>
                        <div className="inline-flex flex-col items-center justify-center mx-1">
                          <span className="text-xs md:text-sm text-black dark:text-white">1</span>
                          <div className="w-full h-[1px] bg-black/30 dark:bg-white/30 my-0.5" />
                          <span className="text-xs md:text-sm text-black dark:text-white font-serif">RMSE<sub>j</sub></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[1px] bg-black/10 dark:bg-white/10 max-w-xs mx-auto" />
                  <div className="inline-flex items-center justify-center gap-2 font-serif text-lg md:text-xl italic text-black dark:text-white">
                    <span>ŷ<sub>t</sub><sup>Comb</sup> = </span>
                    <div className="inline-flex flex-col items-center justify-center align-middle leading-none mx-1">
                      <span className="text-xl md:text-2xl text-black dark:text-white">Σ</span>
                      <span className="text-[10px] text-black/70 dark:text-white/70 font-semibold mt-[-2px]">i</span>
                    </div>
                    <span>w<sub>i</sub>ŷ<sub>t</sub><sup>(i)</sup>,&nbsp; i ∈ {"{"} ARIMA, ETS {"}"}</span>
                  </div>
                </div>
                
                <p>
                  Essa abordagem permite que a combinação seja sensível ao desempenho específico em cada faixa etária, maximizando a acurácia onde cada modelo é mais eficiente.
                </p>
              </div>
            </motion.section>

            {/* Modelo combinado ARIMA + ETS + MLP-Shallow (NNAR) */}
            <motion.section 
              id="nnar" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24 bg-card/20 backdrop-blur-md border border-primary/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                  <Cpu size={20} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Modelo Combinado ARIMA + ETS + NNAR</h2>
              </div>
              <div className="space-y-4 text-justify leading-relaxed text-muted-foreground text-sm md:text-base">
                <p>
                  A metodologia combina três modelos: ARIMA, ETS e NNAR (Neural Network AutoRegressive, uma rede neural MLP-shallow), para previsão da taxa central de mortalidade (<sub>n</sub>M<sub>x</sub>).
                </p>
                
                <p>
                  <strong className="text-foreground">NNAR (Neural Network AutoRegressive, MLP-Shallow):</strong> Rede neural do tipo Multilayer Perceptron (MLP) com uma camada oculta, capaz de capturar padrões não-lineares. A arquitetura é:
                </p>
                
                <div className="my-6 py-6 px-4 text-center overflow-x-auto">
                  <div className="inline-flex items-center justify-center gap-1.5 font-serif text-lg md:text-xl italic text-black dark:text-white">
                    <span>ŷ<sub>t+h</sub> = β<sub>0</sub> + </span>
                    <div className="inline-flex flex-col items-center justify-center align-middle leading-none mx-1.5">
                      <span className="text-[10px] text-black/70 dark:text-white/70 font-semibold mb-[-2px]">k</span>
                      <span className="text-xl md:text-2xl text-black dark:text-white">Σ</span>
                      <span className="text-[10px] text-black/70 dark:text-white/70 font-semibold mt-[-2px]">r=1</span>
                    </div>
                    <span>β<sub>r</sub>σ</span>
                    <span className="text-2xl md:text-3xl font-light text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors mx-0.5">(</span>
                    <span>α<sub>r0</sub> + </span>
                    <div className="inline-flex flex-col items-center justify-center align-middle leading-none mx-1.5">
                      <span className="text-[10px] text-black/70 dark:text-white/70 font-semibold mb-[-2px]">p</span>
                      <span className="text-xl md:text-2xl text-black dark:text-white">Σ</span>
                      <span className="text-[10px] text-black/70 dark:text-white/70 font-semibold mt-[-2px]">j=1</span>
                    </div>
                    <span>α<sub>rj</sub>y<sub>t−j+1</sub></span>
                    <span className="text-2xl md:text-3xl font-light text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors mx-0.5">)</span>
                  </div>
                </div>
                
                <p>
                  onde <em>p</em> é o número de defasagens (lags) e <em>k</em> o número de neurônios na camada oculta. O ajuste é feito com o pacote <em>nnetar()</em> do <em>forecast</em> (R), com múltiplas inicializações para robustez.
                </p>

                <p className="mt-4">
                  As previsões dos três modelos são combinadas por faixa etária, utilizando a mesma regra de pesos inversamente proporcionais ao RMSE em validação:
                </p>
                
                <div className="my-6 py-6 px-4 text-center overflow-x-auto space-y-6">
                  <div className="inline-flex items-center justify-center gap-2 font-serif text-lg md:text-xl italic text-black dark:text-white">
                    <span>W<sub>i</sub> = </span>
                    <div className="inline-flex flex-col items-center justify-center mx-2 align-middle">
                      <div className="inline-flex flex-col items-center justify-center mx-1.5 pb-1 text-xs md:text-sm">
                        <span className="text-black dark:text-white">1</span>
                        <div className="w-full h-[1px] bg-black/30 dark:bg-white/30 my-0.5" />
                        <span className="text-black dark:text-white font-serif">RMSE<sub>i</sub></span>
                      </div>
                      <div className="w-full h-[1.5px] bg-black/30 dark:bg-white/30" />
                      <div className="inline-flex items-center gap-1.5 pt-1">
                        <div className="inline-flex flex-col items-center justify-center align-middle leading-none mx-0.5">
                          <span className="text-xl md:text-2xl text-black dark:text-white">Σ</span>
                          <span className="text-[10px] text-black/70 dark:text-white/70 font-semibold mt-[-2px]">j</span>
                        </div>
                        <div className="inline-flex flex-col items-center justify-center mx-1">
                          <span className="text-xs md:text-sm text-black dark:text-white">1</span>
                          <div className="w-full h-[1px] bg-black/30 dark:bg-white/30 my-0.5" />
                          <span className="text-xs md:text-sm text-black dark:text-white font-serif">RMSE<sub>j</sub></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[1px] bg-black/10 dark:bg-white/10 max-w-xs mx-auto" />
                  <div className="inline-flex items-center justify-center gap-2 font-serif text-lg md:text-xl italic text-black dark:text-white">
                    <span>ŷ<sub>t</sub><sup>Comb</sup> = </span>
                    <div className="inline-flex flex-col items-center justify-center align-middle leading-none mx-1">
                      <span className="text-xl md:text-2xl text-black dark:text-white">Σ</span>
                      <span className="text-[10px] text-black/70 dark:text-white/70 font-semibold mt-[-2px]">i</span>
                    </div>
                    <span>w<sub>i</sub>ŷ<sub>t</sub><sup>(i)</sup>,&nbsp; i ∈ {"{"} ARIMA, ETS, NNAR {"}"}</span>
                  </div>
                </div>
                
                <p>
                  A incerteza das previsões combinadas é estimada por bootstrap residual paramétrico (B=1000), reamostrando resíduos, gerando séries sintéticas, reestimando os modelos e recombinando as previsões. Os intervalos de confiança de 95% são obtidos pelos percentis 2,5% e 97,5% das previsões simuladas.
                </p>
              </div>
            </motion.section>

            {/* Divisão temporal dos dados e justificativa */}
            <motion.section 
              id="divisao-temporal" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24 bg-card/20 backdrop-blur-md border border-primary/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0" />
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                  <Calendar size={20} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Divisão Temporal dos Dados e Justificativa</h2>
              </div>
              <div className="space-y-6 text-justify leading-relaxed text-muted-foreground text-sm md:text-base">
                <p>
                  Para garantir a avaliação justa e realista dos modelos, os dados foram divididos em três períodos:
                </p>
                
                <div className="overflow-x-auto rounded-xl border border-primary/10 bg-background/20">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-primary/5 text-muted-foreground border-b border-primary/10">
                        <th className="p-4 font-semibold text-xs uppercase tracking-wider">Fase</th>
                        <th className="p-4 font-semibold text-xs uppercase tracking-wider">Anos</th>
                        <th className="p-4 font-semibold text-xs uppercase tracking-wider">Uso</th>
                        <th className="p-4 font-semibold text-xs uppercase tracking-wider">Objetivo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                      <tr className="hover:bg-primary/5 transition-all duration-300">
                        <td className="p-4 font-bold text-foreground">Treino</td>
                        <td className="p-4 font-mono text-xs text-primary font-semibold">2000–2011</td>
                        <td className="p-4 text-xs">Ajuste dos modelos</td>
                        <td className="p-4 text-xs">Estimar parâmetros</td>
                      </tr>
                      <tr className="hover:bg-primary/5 transition-all duration-300">
                        <td className="p-4 font-bold text-foreground">Validação</td>
                        <td className="p-4 font-mono text-xs text-primary font-semibold">2012–2015</td>
                        <td className="p-4 text-xs">Cálculo de RMSE</td>
                        <td className="p-4 text-xs">Definir pesos de combinação</td>
                      </tr>
                      <tr className="hover:bg-primary/5 transition-all duration-300">
                        <td className="p-4 font-bold text-foreground">Teste</td>
                        <td className="p-4 font-mono text-xs text-primary font-semibold">2016–2019</td>
                        <td className="p-4 text-xs">Avaliação final</td>
                        <td className="p-4 text-xs">Medir desempenho fora da amostra</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p>
                  A exclusão do período da pandemia de Covid-19 (2020 em diante) é justificada pelo fato de que a crise sanitária gerou mudanças abruptas e atípicas nas taxas de mortalidade, com impactos heterogêneos por idade, sexo e região. A inclusão desse período prejudicaria a avaliação dos modelos, pois estes são treinados para capturar padrões históricos e estruturais, não choques exógenos de curta duração. Assim, a avaliação de desempenho reflete a capacidade dos modelos de prever a mortalidade em condições normais.
                </p>
              </div>
            </motion.section>

            {/* Métricas de avaliação */}
            <motion.section 
              id="metricas" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24 bg-card/20 backdrop-blur-md border border-primary/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300 animate-fade-in"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                  <Percent size={20} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Métricas de Avaliação Preditiva</h2>
              </div>
              <div className="space-y-6 text-justify leading-relaxed text-muted-foreground text-sm md:text-base">
                <p>
                  A avaliação dos modelos foi realizada por faixa etária, permitindo identificar a acurácia em cada grupo e facilitando a comparação entre métodos. As métricas utilizadas foram:
                </p>
                
                <ul className="space-y-6 pl-0">
                  <li className="bg-background/40 border border-primary/5 hover:border-primary/10 rounded-xl p-5 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-foreground">RMSE (Root Mean Square Error)</span>
                    </div>
                    <div className="my-6 py-6 px-4 text-center overflow-x-auto">
                      <div className="inline-flex items-center justify-center gap-1 font-serif text-lg md:text-xl italic text-black dark:text-white">
                        <span>RMSE = √</span>
                        <span className="text-2xl md:text-3xl font-light text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors mx-0.5">(</span>
                        <div className="inline-flex flex-col items-center justify-center mx-1.5 align-middle">
                          <div className="inline-flex items-center gap-1 pb-1">
                            <div className="inline-flex flex-col items-center justify-center align-middle leading-none mx-0.5">
                              <span className="text-[10px] text-black/70 dark:text-white/70 font-semibold mb-[-2px]">n</span>
                              <span className="text-xl md:text-2xl text-black dark:text-white">Σ</span>
                              <span className="text-[10px] text-black/70 dark:text-white/70 font-semibold mt-[-2px]">i=1</span>
                            </div>
                            <span className="text-sm md:text-base text-black dark:text-white font-serif">(ŷ<sub>i</sub> − y<sub>i</sub>)²</span>
                          </div>
                          <div className="w-full h-[1.5px] bg-black/30 dark:bg-white/30" />
                          <span className="text-sm md:text-base text-black dark:text-white pt-1 text-center font-serif">n</span>
                        </div>
                        <span className="text-2xl md:text-3xl font-light text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors mx-0.5">)</span>
                      </div>
                    </div>
                  </li>

                  <li className="bg-background/40 border border-primary/5 hover:border-primary/10 rounded-xl p-5 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-foreground">MAE (Mean Absolute Error)</span>
                    </div>
                    <div className="my-6 py-6 px-4 text-center overflow-x-auto">
                      <div className="inline-flex items-center justify-center gap-1 font-serif text-lg md:text-xl italic text-black dark:text-white">
                        <span>MAE = </span>
                        <div className="inline-flex flex-col items-center justify-center mx-1.5 align-middle">
                          <div className="inline-flex items-center gap-1 pb-1">
                            <div className="inline-flex flex-col items-center justify-center align-middle leading-none mx-0.5">
                              <span className="text-[10px] text-black/70 dark:text-white/70 font-semibold mb-[-2px]">n</span>
                              <span className="text-xl md:text-2xl text-black dark:text-white">Σ</span>
                              <span className="text-[10px] text-black/70 dark:text-white/70 font-semibold mt-[-2px]">i=1</span>
                            </div>
                            <span className="text-sm md:text-base text-black dark:text-white font-serif">|y<sub>i</sub> − ŷ<sub>i</sub>|</span>
                          </div>
                          <div className="w-full h-[1.5px] bg-black/30 dark:bg-white/30" />
                          <span className="text-sm md:text-base text-black dark:text-white pt-1 text-center font-serif">n</span>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li className="bg-background/40 border border-primary/5 hover:border-primary/10 rounded-xl p-5 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-foreground">sMAPE (Symmetric Mean Absolute Percentage Error)</span>
                    </div>
                    <div className="my-6 py-6 px-4 text-center overflow-x-auto">
                      <div className="inline-flex items-center justify-center gap-1 font-serif text-lg md:text-xl italic text-black dark:text-white">
                        <span>sMAPE = </span>
                        <div className="inline-flex flex-col items-center justify-center mx-1.5 align-middle">
                          <span className="text-sm md:text-base text-black dark:text-white pb-1 px-2 text-center font-serif">100</span>
                          <div className="w-full h-[1.5px] bg-black/30 dark:bg-white/30" />
                          <span className="text-sm md:text-base text-black dark:text-white pt-1 px-2 text-center font-serif">n</span>
                        </div>
                        <span className="mx-1.5 font-sans font-semibold text-black dark:text-white">×</span>
                        <div className="inline-flex flex-col items-center justify-center mx-1.5 align-middle">
                          <div className="inline-flex items-center gap-1 pb-1">
                            <div className="inline-flex flex-col items-center justify-center align-middle leading-none mx-0.5">
                              <span className="text-[10px] text-black/70 dark:text-white/70 font-semibold mb-[-2px]">n</span>
                              <span className="text-xl md:text-2xl text-black dark:text-white">Σ</span>
                              <span className="text-[10px] text-black/70 dark:text-white/70 font-semibold mt-[-2px]">t=1</span>
                            </div>
                            <span className="text-sm md:text-base text-black dark:text-white font-serif">|y<sub>t</sub> − ŷ<sub>t</sub>|</span>
                          </div>
                          <div className="w-full h-[1.5px] bg-black/30 dark:bg-white/30" />
                          <div className="inline-flex flex-col items-center justify-center pt-1">
                            <div className="inline-flex flex-col items-center justify-center mx-1 align-middle">
                              <span className="text-xs text-black dark:text-white pb-0.5 px-2 text-center font-serif">|y<sub>t</sub>| + |ŷ<sub>t</sub>|</span>
                              <div className="w-full h-[1px] bg-black/30 dark:bg-white/30" />
                              <span className="text-xs text-black dark:text-white pt-0.5 px-2 text-center font-serif">2</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                
                <p className="text-sm">
                  Essas métricas foram calculadas separadamente para cada faixa etária, possibilitando avaliar a precisão dos modelos em diferentes grupos populacionais e identificar eventuais limitações ou pontos fortes em idades específicas. Os resultados do RMSE orientaram a escolha dos pesos na combinação dos modelos, sempre observando o desempenho em cada faixa etária.
                </p>
              </div>
            </motion.section>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metodologia;
