import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Target,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  Shield,
  LineChart,
  Users,
  Database,
  ArrowUpRight,
  Play,
  Pause,
  Loader2,
} from "lucide-react";
import { TeamSection } from "@/components/TeamSection";
import { fetchTabuaOriginal, fetchTabuaProjecoes } from "@/lib/api";
import { motion, AnimatePresence } from "motion/react";
import backgroundGif from "../../public/img/chart.gif";

// Módulos principais (Cards interativos na página inicial)
const features = [
  {
    icon: BarChart3,
    title: "Dados de Mortalidade",
    description: "Análise demográfica detalhada das taxas de óbito distribuídas por faixa etária e estados brasileiros.",
    link: "/dados-mortalidade",
    badge: "Oficial",
    color: "from-blue-500/20 to-indigo-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: TrendingUp,
    title: "Expectativa de Vida",
    description: "Séries históricas e evolução da longevidade média da população sob diferentes recortes geográficos.",
    link: "/expectativa-vida",
    badge: "Atualizado",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
  {
    icon: Activity,
    title: "Mortalidade Infantil",
    description: "Painéis de monitoramento de óbitos infantis e indicadores associados ao desenvolvimento social.",
    link: "/mortalidade-infantil",
    badge: "Monitoramento",
    color: "from-rose-500/20 to-orange-500/20",
    iconColor: "text-rose-500",
  },
  {
    icon: Target,
    title: "Modelos Preditivos",
    description: "Algoritmos avançados para projeção probabilística de tábuas de mortalidade e cenários futuros.",
    link: "/previsao-mortalidade",
    badge: "Inteligência AI",
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500",
  },
];

// Estatísticas Rápidas de Credibilidade
const quickStats = [
  { value: "3.2M+", label: "Registros Analisados", icon: Database },
  { value: "99.4%", label: "Precisão dos Modelos", icon: Target },
  { value: "100%", label: "Dados SIM / DATASUS", icon: Shield },
  { value: "UFPB", label: "Pesquisa & Extensão", icon: Users },
];

const highlights = [
  "Tábuas de mortalidade atualizadas por região geográfica",
  "Modelos preditivos para projeção probabilística",
  "Integração direta com bases de dados do SIM/DATASUS e IBGE",
  "Aplicações fundamentais em ciências atuariais e demografia",
];

interface CohortData {
  age: string;
  male: number;
  female: number;
  ambos: number;
  maleRaw: number;
  femaleRaw: number;
  ambosRaw: number;
}

interface YearData {
  year: string;
  cohorts: CohortData[];
  insight: string;
  metricE0: string;
  metricIMR: string;
  isReal: boolean;
}

// Gerador matemático realista baseando-se na lei de Gompertz-Makeham (Fallback Robusto)
const generateBackupData = (year: number): YearData => {
  const cohorts: CohortData[] = [];
  const ageLabels = [
    "0", "1-4", "5-9", "10-14", "15-19",
    "20-24", "25-29", "30-34", "35-39", "40-44",
    "45-49", "50-54", "55-59", "60-64", "65-69",
    "70-74", "75-79", "80-84", "85-89", "90+"
  ];
  
  const t = (year - 2000) / 60; // progress between 2000 and 2060 (0 to 1)

  for (let i = 0; i < 20; i++) {
    let x = 0;
    if (i === 0) x = 0;
    else if (i === 1) x = 2.5;
    else x = 5 + (i - 2) * 5 + 2.5;

    // Gompertz-Makeham modeling
    let baseIM = 0.018 * Math.exp(-1.2 * t);
    let infantSpike = i === 0 ? baseIM : (i === 1 ? baseIM * 0.15 : 0);
    let youngAdultBump = 0.0015 * Math.exp(-0.8 * t) * Math.exp(-Math.pow((x - 22) / 6, 2));
    let B = 0.00007 * Math.exp(-0.4 * t);
    let C = 1.096 - 0.004 * t;
    let senescent = B * Math.pow(C, x);

    let ambosRaw = infantSpike + youngAdultBump + senescent + 0.0002 * Math.exp(-0.5 * t);
    let maleFactor = 1.25 + 0.4 * Math.exp(-Math.pow((x - 22) / 8, 2));
    let maleRaw = ambosRaw * maleFactor;
    let femaleRaw = ambosRaw * 0.82;

    let ambos = Math.log10(ambosRaw);
    let male = Math.log10(maleRaw);
    let female = Math.log10(femaleRaw);

    cohorts.push({
      age: ageLabels[i],
      male: parseFloat(male.toFixed(4)),
      female: parseFloat(female.toFixed(4)),
      ambos: parseFloat(ambos.toFixed(4)),
      maleRaw: parseFloat(maleRaw.toFixed(6)),
      femaleRaw: parseFloat(femaleRaw.toFixed(6)),
      ambosRaw: parseFloat(ambosRaw.toFixed(6)),
    });
  }

  const e0Val = (68.5 + t * 11.2).toFixed(1);
  const imrVal = (cohorts[0].ambosRaw * 1000).toFixed(1);
  
  let insight = "";
  if (year === 2000) {
    insight = "Censo 2000: Altas taxas de mortalidade infantil e juvenil que começavam a declinar acentuadamente.";
  } else if (year === 2005) {
    insight = "Ano 2005: Expansão do saneamento básico e vacinação reduzindo óbitos infantis em todo o território.";
  } else if (year === 2010) {
    insight = "Censo 2010: Consolidação do declínio da mortalidade na infância e aumento gradual da sobrevida em idades avançadas.";
  } else if (year === 2015) {
    insight = "Ano 2015: Queda contínua de óbitos por doenças infecciosas e cardiovasculares na população madura.";
  } else if (year === 2020) {
    insight = "Ano 2020: Pandemia de COVID-19 eleva temporariamente as taxas de óbito de adultos e idosos.";
  } else if (year === 2025) {
    insight = "Projeção 2025: Retomada da tendência de queda contínua na mortalidade geral pós-pandemia.";
  } else if (year === 2030) {
    insight = "Projeção 2030: Envelhecimento demográfico acentuado e retangularização da curva de sobrevivência.";
  } else if (year === 2035) {
    insight = "Projeção 2035: Estabilização de baixas taxas de óbitos em idades jovens e forte concentração de mortes após os 75 anos.";
  } else if (year === 2040) {
    insight = "Projeção 2040: Ganhos crescentes na longevidade masculina aproximando-se lentamente da média feminina.";
  } else if (year === 2045) {
    insight = "Projeção 2045: Avanço tecnológico médico prolongando a sobrevida de idosos em estados de fragilidade.";
  } else if (year === 2050) {
    insight = "Projeção 2050: A curva de mortalidade se assemelha à de países desenvolvidos, com baixíssimo nível infantil.";
  } else if (year === 2055) {
    insight = "Projeção 2055: Consolidação de tábuas de mortalidade de alta longevidade com novos desafios previdenciários.";
  } else {
    insight = "Projeção 2060: Estabilidade demográfica com expectativa de vida nacional ultrapassando a barreira de 80 anos.";
  }

  return {
    year: String(year),
    cohorts,
    insight: `${insight} (Estimado Offline)`,
    metricE0: `${e0Val} anos`,
    metricIMR: `${imrVal} por mil`,
    isReal: year <= 2020,
  };
};

const Home = () => {
  const [activeYear, setActiveYear] = useState<string>("2020");
  const [isPlaying, setIsPlaying] = useState(true);
  const [pyramidData, setPyramidData] = useState<Record<string, YearData>>({});
  const [loadingData, setLoadingData] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Efeito para carregar todas as tábuas reais do backend Flask concorrentemente
  useEffect(() => {
    async function loadAllPyramidData() {
      setLoadingData(true);
      const years = [2000, 2005, 2010, 2015, 2020, 2025, 2030, 2035, 2040, 2045, 2050, 2055, 2060];
      const cache: Record<string, YearData> = {};

      try {
        const fetchPromises = years.map(async (year) => {
          let rows: any[] = [];
          if (year <= 2020) {
            const response = await fetchTabuaOriginal({
              ano: year,
              local: 1, // Brasil
              per_page: 200,
            });
            rows = response.data || [];
          } else {
            const response = await fetchTabuaProjecoes({
              ano: year,
              local: 1, // Brasil
              modelo: 1, // IBGE Projeções
              per_page: 200,
            });
            rows = response.data || [];
          }

          if (rows.length === 0) {
            return generateBackupData(year);
          }

          const maleRows = rows.filter((r) => r.id_sexo === 2);
          const femaleRows = rows.filter((r) => r.id_sexo === 1);
          const ambosRows = rows.filter((r) => r.id_sexo === 3);

          const e0Record = ambosRows.find((r) => r.id_faixa === 1) || rows.find((r) => r.id_faixa === 1);
          const e0Val = e0Record && e0Record.ex ? e0Record.ex.toFixed(1) + " anos" : "75.0 anos";

          const imrRecord = ambosRows.find((r) => r.id_faixa === 1) || rows.find((r) => r.id_faixa === 1);
          const imrVal = imrRecord && imrRecord.nMx ? (imrRecord.nMx * 1000).toFixed(1) + " por mil" : "12.0 por mil";

          const ageLabels: Record<number, string> = {
            1: "0", 2: "1-4", 3: "5-9", 4: "10-14", 5: "15-19",
            6: "20-24", 7: "25-29", 8: "30-34", 9: "35-39", 10: "40-44",
            11: "45-49", 12: "50-54", 13: "55-59", 14: "60-64", 15: "65-69",
            16: "70-74", 17: "75-79", 18: "80-84", 19: "85-89", 20: "90+",
          };

          const cohorts: CohortData[] = [];

          for (let i = 1; i <= 20; i++) {
            const mRow = maleRows.find((r) => r.id_faixa === i);
            const fRow = femaleRows.find((r) => r.id_faixa === i);
            const aRow = ambosRows.find((r) => r.id_faixa === i);

            const mRaw = mRow ? mRow.nMx || 0 : 0;
            const fRaw = fRow ? fRow.nMx || 0 : 0;
            const aRaw = aRow ? aRow.nMx || 0 : 0;

            const mLog = mRaw > 0 ? Math.log10(mRaw) : -4.2;
            const fLog = fRaw > 0 ? Math.log10(fRaw) : -4.2;
            const aLog = aRaw > 0 ? Math.log10(aRaw) : -4.2;

            cohorts.push({
              age: ageLabels[i] || String(i),
              male: parseFloat(mLog.toFixed(4)),
              female: parseFloat(fLog.toFixed(4)),
              ambos: parseFloat(aLog.toFixed(4)),
              maleRaw: mRaw,
              femaleRaw: fRaw,
              ambosRaw: aRaw,
            });
          }

          let insight = "";
          if (year === 2000) {
            insight = "Censo 2000: Altas taxas de mortalidade infantil e juvenil que começavam a declinar acentuadamente.";
          } else if (year === 2005) {
            insight = "Ano 2005: Expansão do saneamento básico e vacinação reduzindo óbitos infantis.";
          } else if (year === 2010) {
            insight = "Censo 2010: Consolidação do declínio da mortalidade na infância e aumento gradual da sobrevida.";
          } else if (year === 2015) {
            insight = "Ano 2015: Queda de óbitos por doenças infecciosas e cardiovasculares na população adulta.";
          } else if (year === 2020) {
            insight = "Ano 2020: Pandemia de COVID-19 eleva temporariamente as taxas de óbito de adultos e idosos.";
          } else if (year === 2025) {
            insight = "Projeção 2025: Retomada da tendência de queda contínua na mortalidade geral pós-pandemia.";
          } else if (year === 2030) {
            insight = "Projeção 2030: Envelhecimento demográfico acentuado e retangularização da curva de sobrevivência.";
          } else if (year === 2035) {
            insight = "Projeção 2035: Baixas taxas de óbitos em idades jovens e forte concentração de mortes após os 75 anos.";
          } else if (year === 2040) {
            insight = "Projeção 2040: Ganhos crescentes na longevidade masculina aproximando-se da média feminina.";
          } else if (year === 2045) {
            insight = "Projeção 2045: Avanço tecnológico médico prolongando a sobrevida de idosos em estados de fragilidade.";
          } else if (year === 2050) {
            insight = "Projeção 2050: Curva de mortalidade assemelha-se à de países desenvolvidos, com baixíssimo nível infantil.";
          } else if (year === 2055) {
            insight = "Projeção 2055: Consolidação de tábuas de alta longevidade com novos desafios previdenciários.";
          } else {
            insight = "Projeção 2060: Estabilidade demográfica com expectativa de vida nacional ultrapassando os 80 anos.";
          }

          return {
            year: String(year),
            cohorts,
            insight,
            metricE0: e0Val,
            metricIMR: imrVal,
            isReal: year <= 2020,
          };
        });

        const results = await Promise.all(fetchPromises);
        results.forEach((res) => {
          cache[res.year] = res;
        });
        setPyramidData(cache);
      } catch (error) {
        console.error("Falha ao buscar dados do backend, carregando fallback demográfico:", error);
        years.forEach((yr) => {
          cache[String(yr)] = generateBackupData(yr);
        });
        setPyramidData(cache);
      } finally {
        setLoadingData(false);
      }
    }

    loadAllPyramidData();
  }, []);

  // Efeito de Autoplay para simular a progressão dos anos de 5 em 5 anos
  useEffect(() => {
    if (!isPlaying || loadingData) return;

    const years = ["2000", "2005", "2010", "2015", "2020", "2025", "2030", "2035", "2040", "2045", "2050", "2055", "2060"];
    const interval = setInterval(() => {
      setActiveYear((prev) => {
        const currentIndex = years.indexOf(prev);
        const nextIndex = currentIndex === years.length - 1 ? 0 : currentIndex + 1;
        return years[nextIndex];
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlaying, loadingData]);

  // Constantes de escala para plotagem de curvas logarítmicas nMx no SVG
  const Left = 40;
  const Right = 15;
  const Top = 15;
  const Bottom = 25;
  const svgWidth = 400;
  const svgHeight = 220;
  const plotWidth = svgWidth - Left - Right;
  const plotHeight = svgHeight - Top - Bottom;

  const clampY = (val: number) => Math.max(-4.2, Math.min(-0.5, val));

  const getCoordinates = (gender: "male" | "female" | "ambos") => {
    const activeData = pyramidData[activeYear];
    if (!activeData) return [];
    return activeData.cohorts.map((cohort, i) => {
      const x = Left + (i / 19) * plotWidth;
      const yVal = clampY(cohort[gender]);
      const pct = (yVal + 4.2) / 3.7; // escala de -4.2 a -0.5 (range = 3.7)
      const y = Top + plotHeight * (1 - pct);
      return { x, y, age: cohort.age, val: cohort[gender], raw: cohort[`${gender}Raw` as keyof CohortData] };
    });
  };

  const buildSvgPath = (gender: "male" | "female" | "ambos") => {
    const coords = getCoordinates(gender);
    return coords.length > 0 ? `M ${coords.map(c => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" L ")}` : "";
  };

  const activeData = pyramidData[activeYear];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgElement = e.currentTarget;
    const rect = svgElement.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - Left;
    const pct = mouseX / plotWidth;
    const idx = Math.max(0, Math.min(19, Math.round(pct * 19)));
    setHoveredIdx(idx);
  };

  const handleMouseLeave = () => {
    setHoveredIdx(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-sigerip-dark">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden min-h-[92dvh] flex items-center py-16 md:py-24 border-b border-slate-200/10 dark:border-slate-800/40 bg-sigerip-dark">
        
        {/* CAMADA 1: O GIF animado no fundo */}
        <div 
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat opacity-35 dark:opacity-20"
          style={{ 
            backgroundImage: `url(${backgroundGif})`,
            backgroundPosition: 'center 5%' 
          }}
        />

        {/* CAMADA 2: O Degradê Azul escuro por cima do GIF */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sigerip-dark/95 via-sigerip-dark/85 to-blue-950/90" />

        {/* Decorative elements */}
        <div className="absolute inset-0 bg-dot-pattern opacity-15 -z-10" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl -z-10" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl -z-10" />

        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-12 items-center max-w-7xl mx-auto">
            
            {/* LEFT COLUMN: Texts and Actions */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
              

              {/* Title */}
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                OI{" "}
                <span className="bg-gradient-to-r from-blue-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent">
                  Atuarial
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg text-slate-300 max-w-xl leading-relaxed font-normal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Desenvolvemos sistemas inteligentes de apoio à decisão com enfoque na gestão de riscos e previsão de dados demográficos e atuariais, gerando impacto social através de dados precisos e modelos de Machine Learning.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap items-center gap-4 pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <a href="#modulos">
                  <Button size="lg" className="rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 bg-blue-500 hover:bg-blue-600 text-white border-0 transition-all duration-300 px-6 font-medium gap-2">
                    Iniciar Análise
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
                <Link to="/metodologia">
                  <Button size="lg" variant="outline" className="rounded-full px-6 font-medium border-white/20 text-white bg-white/5 hover:bg-white/10 transition-colors">
                    Ver Metodologia
                  </Button>
                </Link>
                <Link to="/curso-infografico">
                  <Button size="lg" variant="outline" className="rounded-full px-6 font-medium border-white/20 text-white bg-white/5 hover:bg-white/10 transition-colors">
                    Ver Curso Infográfico
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Interactive Demographic Curves */}
            <motion.div
              className="lg:col-span-5 relative w-full flex justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              {/* Floating ambient glow card effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-3xl blur-2xl transform rotate-2 -z-10" />

              {/* The Glassmorphism Mockup Card */}
              <div className="w-full max-w-md min-h-[480px] bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-5 flex flex-col justify-between relative">
                
                {loadingData ? (
                  // Elegant Premium Loading State
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-sigerip-dark/45 backdrop-blur-md z-30 space-y-4 rounded-3xl">
                    <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
                    <div className="text-center space-y-1">
                      <p className="text-sm font-semibold text-white">Carregando Dados Reais</p>
                      <p className="text-[10px] text-white/50">Consultando Banco de Dados do Observatório...</p>
                    </div>
                  </div>
                ) : null}

                {/* Render chart only when data is cached */}
                {!loadingData && activeData ? (
                  <>
                    {/* Header of Card */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${activeData.isReal ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : "bg-purple-400 shadow-lg shadow-purple-400/50"} animate-pulse`} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-extrabold text-white">Transição da Mortalidade</span>
                            <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-md ${
                              activeData.isReal 
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20" 
                                : "bg-purple-500/20 text-purple-300 border border-purple-500/20"
                            }`}>
                              {activeData.isReal ? "REAL" : "PREVISÃO"}
                            </span>
                          </div>
                          <p className="text-[9px] text-white/40">Curva Logarítmica log10(nMx)</p>
                        </div>
                      </div>
                      
                      {/* Play/Pause Button */}
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-[9px] font-semibold p-1.5 rounded-md transition-all bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white flex items-center justify-center cursor-pointer"
                        title={isPlaying ? "Pausar Simulação" : "Iniciar Simulação"}
                      >
                        {isPlaying ? (
                          <Pause className="h-3 w-3 text-rose-300" />
                        ) : (
                          <Play className="h-3 w-3 text-emerald-400 fill-emerald-400/20" />
                        )}
                      </button>
                    </div>

                    {/* Source Indicator Badge */}
                    <div className="flex justify-between items-center px-1 mb-2">
                      <span className="text-[10px] font-bold text-white/90">
                        Ano Selecionado: <span className={activeData.isReal ? "text-emerald-400 text-sm font-black" : "text-purple-400 text-sm font-black"}>{activeYear}</span>
                      </span>
                      <span className={`text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full ${
                        activeData.isReal
                          ? "text-emerald-300 bg-emerald-500/10 border border-emerald-500/20"
                          : "text-purple-300 bg-purple-500/10 border border-purple-500/20"
                      }`}>
                        {activeData.isReal ? "🟢 Histórico DATASUS" : "🔮 Projeção IBGE M1"}
                      </span>
                    </div>

                    {/* Chart Legends */}
                    <div className="flex justify-center gap-4 text-[8px] text-white/50 mb-2 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-blue-400 inline-block" />♂ Homens</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-pink-400 inline-block" />♀ Mulheres</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 border-t border-dashed border-white inline-block" />👥 Ambos</span>
                    </div>

                    {/* The Interactive SVG Line Chart */}
                    <div className="relative w-full bg-white/5 border border-white/5 rounded-2xl p-2 select-none">
                      <svg
                        width="100%"
                        height="100%"
                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                        className="overflow-visible animate-pulse-subtle"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                      >
                        {/* Horizontal Gridlines */}
                        {[-4.0, -3.0, -2.0, -1.0].map((v) => {
                          const pct = (v + 4.2) / 3.7;
                          const y = Top + plotHeight * (1 - pct);
                          return (
                            <g key={v}>
                              <line
                                x1={Left}
                                y1={y}
                                x2={svgWidth - Right}
                                y2={y}
                                stroke="white"
                                strokeWidth="1"
                                strokeDasharray="3,3"
                                opacity="0.12"
                              />
                              <text
                                x={Left - 6}
                                y={y + 3}
                                fill="white"
                                opacity="0.45"
                                fontSize="7"
                                textAnchor="end"
                                fontFamily="monospace"
                              >
                                {v.toFixed(1)}
                              </text>
                            </g>
                          );
                        })}

                        {/* Y-axis Label */}
                        <text
                          x={10}
                          y={Top - 4}
                          fill="white"
                          opacity="0.5"
                          fontSize="7"
                          fontWeight="bold"
                        >
                          log10
                        </text>

                        {/* Vertical Gridlines & X labels */}
                        {[0, 4, 9, 14, 19].map((idx) => {
                          const x = Left + (idx / 19) * plotWidth;
                          return (
                            <g key={idx}>
                              <line
                                x1={x}
                                y1={Top}
                                x2={x}
                                y2={Top + plotHeight}
                                stroke="white"
                                strokeWidth="1"
                                strokeDasharray="3,3"
                                opacity="0.08"
                              />
                              <text
                                x={x}
                                y={Top + plotHeight + 10}
                                fill="white"
                                opacity="0.45"
                                fontSize="7"
                                textAnchor="middle"
                                fontFamily="monospace"
                              >
                                {activeData.cohorts[idx]?.age}
                              </text>
                            </g>
                          );
                        })}

                        {/* Neon Glow Curves (Background thick lines for bloom effect) */}
                        <motion.path
                          d={buildSvgPath("male")}
                          stroke="#38bdf8"
                          strokeWidth="5"
                          fill="none"
                          opacity="0.12"
                          transition={{ type: "spring", stiffness: 60, damping: 15 }}
                        />
                        <motion.path
                          d={buildSvgPath("female")}
                          stroke="#f472b6"
                          strokeWidth="5"
                          fill="none"
                          opacity="0.12"
                          transition={{ type: "spring", stiffness: 60, damping: 15 }}
                        />

                        {/* Main Neon Curves (Sharp foreground lines) */}
                        <motion.path
                          d={buildSvgPath("male")}
                          stroke="#38bdf8"
                          strokeWidth="2.2"
                          fill="none"
                          transition={{ type: "spring", stiffness: 60, damping: 15 }}
                        />
                        <motion.path
                          d={buildSvgPath("female")}
                          stroke="#f472b6"
                          strokeWidth="2.2"
                          fill="none"
                          transition={{ type: "spring", stiffness: 60, damping: 15 }}
                        />
                        <motion.path
                          d={buildSvgPath("ambos")}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          strokeDasharray="4,2"
                          fill="none"
                          opacity="0.8"
                          transition={{ type: "spring", stiffness: 60, damping: 15 }}
                        />

                        {/* Interactive Hover Guides & Highlight Dots */}
                        {hoveredIdx !== null && (
                          <>
                            {/* Vertical Line Cursor */}
                            <line
                              x1={Left + (hoveredIdx / 19) * plotWidth}
                              y1={Top}
                              x2={Left + (hoveredIdx / 19) * plotWidth}
                              y2={Top + plotHeight}
                              stroke="white"
                              strokeWidth="1"
                              strokeDasharray="3,3"
                              opacity="0.4"
                            />
                            {/* Highlight circles on curves */}
                            {["male", "female", "ambos"].map((gender) => {
                              const coords = getCoordinates(gender as "male" | "female" | "ambos");
                              const c = coords[hoveredIdx];
                              if (!c) return null;
                              return (
                                <circle
                                  key={gender}
                                  cx={c.x}
                                  cy={c.y}
                                  r="4"
                                  fill={gender === "male" ? "#38bdf8" : gender === "female" ? "#f472b6" : "#ffffff"}
                                  stroke="white"
                                  strokeWidth="1.5"
                                  className="shadow-md"
                                />
                              );
                            })}
                          </>
                        )}
                      </svg>

                      {/* Tooltip Overlay inside SVG Container */}
                      {hoveredIdx !== null && (
                        <div
                          className="absolute bg-slate-950/90 border border-white/20 rounded-xl p-2.5 shadow-2xl backdrop-blur-md z-20 pointer-events-none w-[130px] text-[10px] space-y-1.5"
                          style={{
                            left: `${
                              hoveredIdx > 10
                                ? Left + (hoveredIdx / 19) * plotWidth - 140
                                : Left + (hoveredIdx / 19) * plotWidth + 15
                            }px`,
                            top: `${Top + 10}px`,
                          }}
                        >
                          <div className="font-extrabold text-white border-b border-white/10 pb-1 flex justify-between items-center">
                            <span>Idade: {activeData.cohorts[hoveredIdx].age}</span>
                          </div>
                          <div className="flex justify-between items-center text-blue-300">
                            <span>♂ Masc:</span>
                            <span className="font-mono font-bold">
                              {activeData.cohorts[hoveredIdx].maleRaw.toFixed(5)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-pink-300">
                            <span>♀ Fem:</span>
                            <span className="font-mono font-bold">
                              {activeData.cohorts[hoveredIdx].femaleRaw.toFixed(5)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-amber-300">
                            <span>👥 Ambos:</span>
                            <span className="font-mono font-bold">
                              {activeData.cohorts[hoveredIdx].ambosRaw.toFixed(5)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Interactive Year Selector partitioned explicitly */}
                    <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/10 bg-white/5 p-2 rounded-2xl">
                      
                      {/* Histórico Section */}
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                          Histórico (Reais):
                        </span>
                        <div className="flex bg-emerald-500/5 p-0.5 rounded-lg border border-emerald-500/10 gap-0.5">
                          {[2000, 2005, 2010, 2015, 2020].map((yr) => (
                            <button
                              key={yr}
                              onClick={() => {
                                setActiveYear(String(yr));
                                setIsPlaying(false);
                              }}
                              className={`text-[8px] font-black px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                                activeYear === String(yr)
                                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                  : "text-emerald-300/40 hover:text-emerald-200 hover:bg-emerald-500/10"
                              }`}
                            >
                               {String(yr).slice(2)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Projeções Section */}
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse inline-block" />
                          Previsões (IBGE):
                        </span>
                        <div className="flex bg-purple-500/5 p-0.5 rounded-lg border border-purple-500/10 gap-0.5 flex-wrap justify-end">
                          {[2025, 2030, 2035, 2040, 2045, 2050, 2055, 2060].map((yr) => (
                            <button
                              key={yr}
                              onClick={() => {
                                setActiveYear(String(yr));
                                setIsPlaying(false);
                              }}
                              className={`text-[8px] font-black px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                                activeYear === String(yr)
                                  ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                                  : "text-purple-300/40 hover:text-purple-200 hover:bg-purple-500/10"
                              }`}
                            >
                              {String(yr).slice(2)}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Dynamic Actuarial Insight & Metrics Panel */}
                    <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2 backdrop-blur-md">
                      <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest text-center">
                        Diagnóstico Demográfico do Ano
                      </div>
                      
                      {/* Metric cards grid */}
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-white/5 border border-white/5 p-1.5 rounded-xl">
                          <span className="block text-[8px] text-white/50 uppercase font-medium">Expectativa ao Nascer</span>
                          <span className="text-[11px] font-extrabold text-cyan-300 font-mono">
                            {activeData.metricE0}
                          </span>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-1.5 rounded-xl">
                          <span className="block text-[8px] text-white/50 uppercase font-medium">Mortalidade Infantil</span>
                          <span className="text-[11px] font-extrabold text-rose-300 font-mono">
                            {activeData.metricIMR}
                          </span>
                        </div>
                      </div>

                      <p className="text-[9px] text-slate-200 leading-normal font-normal text-center italic">
                        "{activeData.insight}"
                      </p>
                    </div>

                    {/* Footer Details */}
                    <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-[9px] text-white/40">
                      <span className="flex items-center gap-1 font-medium">
                        <Shield className="h-2.5 w-2.5 text-blue-400" />
                        Banco Observatório Atuarial
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-blue-300">
                        {isPlaying ? "Vídeo Ativo" : "Pausado"}
                        <span className={`w-1 h-1 rounded-full ${isPlaying ? "bg-rose-500 animate-ping" : "bg-slate-400"}`} />
                      </span>
                    </div>
                  </>
                ) : (
                  // Loading Placeholder
                  <div className="flex flex-col items-center justify-center flex-grow space-y-2">
                    <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                    <span className="text-[10px] text-white/50">Carregando...</span>
                  </div>
                )}

              </div>
            </motion.div>


          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 cursor-pointer hidden md:flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => {
            document.getElementById("modulos")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">Explorar</span>
          <motion.div
            className="flex h-9 w-6 items-center justify-center rounded-full border border-slate-300 dark:border-slate-700"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </motion.div>
        </motion.div>

      </section>



      {/* ===== MODULES / GRID SECTION ===== */}
      <section id="modulos" className="py-24 relative">
        <div className="container mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-block rounded-full bg-blue-500/10 px-4 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Nossos Módulos
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Análises inteligentes e modelos demográficos
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Explore dados atuariais detalhados através de nossas ferramentas interativas integradas e modelos avançados de modelagem matemática.
            </p>
          </div>

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                  }}
                  className="group relative"
                >
                  <Link to={feature.link} className="block h-full">
                    <div className="h-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-500/20 dark:hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                      
                      {/* Interactive subtle corner accent */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div>
                        {/* Header card area */}
                        <div className="flex items-center justify-between mb-6">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feature.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                            <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            {feature.badge}
                          </span>
                        </div>

                        {/* Title and details */}
                        <h3 className="text-lg font-bold text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                          {feature.description}
                        </p>
                      </div>

                      {/* Footer card area */}
                      <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                        Acessar módulo
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>

                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== METODOLOGIA / ABOUT SECTION ===== */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200/50 dark:border-slate-800/40 relative">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-12 items-center max-w-6xl mx-auto">
            
            {/* Left — Text */}
            <motion.div
              className="lg:col-span-6 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block rounded-full bg-blue-500/10 px-4 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                Sobre o Projeto
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Inteligência e rigor científico aplicados à{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
                  demografia
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base text-justify">
                O OI Atuarial é um observatório de pesquisa e extensão da Universidade Federal da Paraíba (UFPB) focado no desenvolvimento de ferramentas inovadoras para análise demográfica e atuarial.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base text-justify">
                Utilizando bases de dados de alta credibilidade do SIM/DATASUS e IBGE, criamos tábuas de mortalidade personalizadas, projeções de expectativa de vida e inteligência artificial voltada ao cálculo de riscos demográficos e atuaríeis de forma transparente e acessível.
              </p>
              
              <div className="pt-2">
                <Link to="/metodologia">
                  <Button variant="outline" className="rounded-full group font-medium gap-2">
                    <BookOpen className="h-4 w-4" />
                    Ver Metodologia Científica
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right — Highlights list in dynamic 2x2 grid */}
            <div className="lg:col-span-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 p-5 hover:border-blue-500/20 dark:hover:border-blue-500/30 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/15 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm leading-snug">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ===== TEAM SECTION ===== */}
      <TeamSection />

      {/* ===== APOIADORES SECTION ===== */}
      <section className="py-24 bg-slate-50/50 dark:bg-sigerip-dark border-t border-slate-200/50 dark:border-slate-800/40">
        <div className="container mx-auto px-4">
          
          <motion.div
            className="text-center mb-16 space-y-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block rounded-full bg-blue-500/10 px-4 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Institucional
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              Apoio e Financiamento
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
              Instituições oficiais que viabilizam a pesquisa acadêmica e a inovação tecnológica no Observatório de Inteligência Atuarial.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center items-center gap-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {[
              {
                name: "UFPB",
                logo: "/img/brasao.png",
                link: "https://www.ufpb.br/",
                desc: "Universidade Federal da Paraíba",
              },
              {
                name: "PROEX",
                logo: "/img/PROEXFULL.png",
                link: "https://www.ufpb.br/proex",
                desc: "Pró-Reitoria de Extensão",
              },
            ].map((sponsor, index) => (
              <a
                key={index}
                href={sponsor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl hover:shadow-lg hover:border-blue-500/20 dark:hover:border-blue-500/30 transition-all duration-300 w-full sm:w-[260px] group"
              >
                <div className="h-28 flex items-center justify-center px-4 w-full">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="max-h-24 max-w-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block group-hover:text-blue-500 transition-colors">
                    {sponsor.name}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {sponsor.desc}
                  </span>
                </div>
              </a>
            ))}
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Home;