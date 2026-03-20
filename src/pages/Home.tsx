import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Target,
  ArrowRight,
  Users,
  ChartArea,
  MapPin,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  Shield,
  TrendingUpDown,
} from "lucide-react";
import { TeamSection } from "@/components/TeamSection";
import { motion } from "motion/react";
import { link } from "fs";
// Importe junto com seus outros imports (ajuste o caminho da pasta)
import backgroundGif from '../../public/img/chart.gif';

const Home = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Dados de Mortalidade",
      description:
        "Análise completa das taxas de mortalidade por faixa etária e região do Brasil",
      link: "/dados-mortalidade",
    },
    {
      icon: TrendingUp,
      title: "Expectativa de Vida",
      description:
        "Visualização da expectativa de vida ao longo dos anos com séries históricas",
      link: "/expectativa-vida",
    },
    {
      icon: Activity,
      title: "Mortalidade Infantil",
      description:
        "Indicadores de mortalidade infantil segmentados por região e período",
      link: "/mortalidade-infantil",
    },
    {
      icon: Target,
      title: "Previsões",
      description:
        "Modelos preditivos para mortalidade e expectativa de vida futura",
      link: "/previsao-mortalidade",
    },
  ];

  const stats = [
    { icon: BarChart3, label: "Originais", link: "/dados-mortalidade" },
    { icon: Activity, label: "Mort. Infantil", link: "/mortalidade-infantil" },
    { icon: TrendingUp, label: "Expec. de Vida", link: "/expectativa-vida" },
    { icon: TrendingUpDown, label: "Projeções", link: "/previsao-mortalidade" },
  ];

  const highlights = [
    "Tábuas de mortalidade atualizadas por região",
    "Modelos preditivos para projeção de mortalidade",
    "Dados do SIM/DATASUS e IBGE",
    "Aplicações em ciências atuariais e demografia",
  ];

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      {/* 1. Removi as cores de fundo daqui para colocá-las em camadas internas */}
      <section className="relative overflow-hidden py-24 md:py-28">
        
        {/* CAMADA 1: O GIF animado (Fica lá no fundo) */}
        <div 
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundGif})`,
          backgroundPosition: 'center 5%' }}
          
        />

        {/* CAMADA 2: O Degradê Azul (Fica por cima do GIF) */}
        {/* Adicionei /80 e /90 nas cores para dar transparência e deixar o GIF aparecer */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sigerip-dark/90 via-sigerip-dark/80 to-primary/90" />

        {/* Decorative pattern original (adicionei -z-10 pra não ficar por cima do texto) */}
        <div className="absolute inset-0 bg-dot-pattern -z-10 opacity-50" />
        
        {/* Decorative circles originais (adicionei -z-10) */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl -z-10" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl -z-10" />

        {/* === O SEU CONTEÚDO CONTINUA INTACTO A PARTIR DAQUI === */}
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium text-white/90">
                <Lightbulb className="h-3.5 w-3.5" />
                Observatório de Inteligência
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="mb-6 mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              OI{" "}
              <span className="bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
                Atuarial
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Desenvolvemos sistemas inteligentes de apoio à decisão com enfoque
              na gestão de riscos e previsão de dados demográficos e atuariais,
              impactando a comunidade através de análises precisas e insights
              estratégicos.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
                <h2 className="mb-4 text-center text-2xl font-bold text-white">Explore nossos dados</h2>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            className="mx-auto mt-10 max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="glass px-260 rounded-2xl py-5">
              <div className="grid grid-cols-4 divide-x divide-white/10">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Link to={stat.link} key={index} className="group block h-full">
                      <div
                        className="flex cursor-pointer flex-col items-center rounded-xl px-4 
                                  transition-all duration-300 ease-in-out 
                                  hover:scale-110"
                      >
                        <Icon className="mb-2 h-5 w-5 text-blue-300 
                                        transition-colors duration-300 
                                        group-hover:text-blue-400" />
                        <span className="text-sm font-bold text-white text-center leading-tight
                                        transition-colors duration-300
                                        group-hover:text-blue-200">
                          {stat.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== SOBRE O PROJETO SECTION ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2 items-center max-w-5xl mx-auto">
            {/* Left — Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary mb-4">
                Sobre o Projeto
              </span>
              <h2 className="text-3xl font-bold tracking-tight mb-4 sm:text-4xl">
                Inteligência aplicada à{" "}
                <span className="text-primary">ciência atuarial</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base text-justify">
                O OI Atuarial é um projeto de extensão da UFPB que desenvolve
                ferramentas para análise demográfica e atuarial. Utilizamos
                dados públicos do SIM/DATASUS e IBGE para construir tábuas de
                mortalidade, projeções de expectativa de vida e modelos
                preditivos que auxiliam pesquisadores e profissionais da área.
              </p>
              <div className="mt-6">
                <Link to="/metodologia">
                  <Button variant="outline" className="rounded-full group">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Ver Metodologia
                    <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right — Highlights list */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 px-5 py-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-foreground font-medium text-sm sm:text-base">
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TEAM SECTION ===== */}
      <TeamSection />

      {/* ===== APOIADORES SECTION ===== */}
      <section className="py-20 bg-gradient-to-b from-white to-muted/40">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Apoiadores
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Instituições que apoiam e financiam o Observatório de Inteligência
              Atuarial
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center items-center gap-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {[
              {
                name: "UFPB",
                logo: "/img/brasao.png",
                link: "http://www.cnpq.br/",
              },
              {
                name: "PROEX",
                logo: "/img/PROEXFULL.png",
                link: "https://www.gov.br/capes/pt-br",
              },
            ].map((sponsor, index) => (
              <a
                key={index}
                href={sponsor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-28 px-6 rounded-xl transition-all duration-300 hover:bg-muted/50 group"
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-h-24 object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              </a>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
