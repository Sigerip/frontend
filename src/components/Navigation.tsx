import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  ChevronDown, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Target, 
  Key, 
  Code,
  BookOpen,
  Home,
  Database,
  ArrowRight,
  BrainCircuit,
  Terminal,
  GraduationCap,
  Library
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Monitora a rolagem para aplicar efeito glassmorphism flutuante e reduzir a altura da barra
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Grupos estruturados para agrupar as 9 páginas originais de forma organizada e limpa
  const analiseItems = [
    { path: "/dados-mortalidade", label: "Dados Mortalidade", icon: BarChart3, desc: "Estatísticas de óbitos nacionais", iconColor: "text-blue-500 bg-blue-500/10" },
    { path: "/expectativa-vida", label: "Expectativa de Vida", icon: TrendingUp, desc: "Séries históricas de longevidade", iconColor: "text-emerald-500 bg-emerald-500/10" },
    { path: "/mortalidade-infantil", label: "Mortalidade Infantil", icon: Activity, desc: "Indicadores de desenvolvimento social", iconColor: "text-rose-500 bg-rose-500/10" }
  ];

  const projecoesItems = [
    { path: "/previsao-mortalidade", label: "Previsão Mortalidade", icon: Target, desc: "Projeções estocásticas avançadas", iconColor: "text-purple-500 bg-purple-500/10" },
    { path: "/previsao-expectativa", label: "Previsão Expectativa", icon: TrendingUp, desc: "Cenários futuros de longevidade", iconColor: "text-amber-500 bg-amber-500/10" }
  ];

  const apiItems = [
    { path: "/solicitar-token", label: "Solicitar Token", icon: Key, desc: "Geração de chaves de autenticação", iconColor: "text-indigo-500 bg-indigo-500/10" },
    { path: "/usar-api", label: "Documentação API", icon: Code, desc: "Integração direta com o observatório", iconColor: "text-slate-600 bg-slate-500/10 dark:text-slate-300" }
  ];

  const cursoItens = [
    { path: "/curso-infografico", label: "Curso Infográfico", icon: GraduationCap, desc: "Construção de infográficos com IA", iconColor: "text-indigo-500 bg-indigo-500/10" }
  ];

  // Verifica se alguma rota de um grupo específico está ativa para destacar o menu pai
  const isGroupActive = (items: { path: string }[]) => {
    return items.some(item => location.pathname === item.path);
  };

  // Fecha o menu mobile quando a rota muda
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled 
          ? "h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/40 shadow-sm"
          : "h-20 bg-white/95 dark:bg-sigerip-dark/95 border-slate-200/30 dark:border-slate-800/20"
      )}>
        <div className="mx-auto h-full px-6 max-w-7xl flex items-center justify-between">
          
          {/* BRAND/LOGO AREA */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            {/* Pulsing visual border ring around logo */}
            <div className="relative h-11 w-11 rounded-full p-0.5 bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400 group-hover:scale-105 transition-transform duration-300 shadow-md">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 blur-[2px] opacity-0 group-hover:opacity-75 transition-opacity" />
              <img 
                src="/img/logo.jpg" 
                alt="OI Atuarial Logo" 
                className="relative h-full w-full rounded-full object-cover bg-white" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg leading-tight tracking-tight text-slate-900 dark:text-white">
                OI <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">Atuarial</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase -mt-0.5">
                UFPB Observatório
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU - Estilo Premium Pill Highlight (Next.js/Vercel) */}
          <div className="hidden lg:flex items-center gap-1">
            
            {/* LINK: INÍCIO */}
            <Link to="/">
              <button className={cn(
                "text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5",
                isActive("/") 
                  ? "bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              )}>
                <Home className="h-3.5 w-3.5" />
                Início
              </button>
            </Link>

            {/* DROPDOWN: ANÁLISES & DADOS */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1",
                  isGroupActive(analiseItems)
                    ? "bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                )}>
                  <Database className="h-3.5 w-3.5 mr-1" />
                  Análises & Dados
                  <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl mt-1 animate-in fade-in-50 slide-in-from-top-1">
                <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase px-2.5 py-1 tracking-widest">
                  Módulos de Análise
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800/60 my-1" />
                {analiseItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.path} asChild className="rounded-xl focus:bg-slate-50 dark:focus:bg-slate-800 p-2 cursor-pointer transition-colors duration-150">
                      <Link to={item.path} className="flex gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", item.iconColor)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{item.label}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">{item.desc}</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* DROPDOWN: PROJEÇÕES AI */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1",
                  isGroupActive(projecoesItems)
                    ? "bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                )}>
                  <BrainCircuit className="h-3.5 w-3.5 mr-1" />
                  Projeções AI
                  <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl mt-1 animate-in fade-in-50 slide-in-from-top-1">
                <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase px-2.5 py-1 tracking-widest">
                  Modelagem Preditiva
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800/60 my-1" />
                {projecoesItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.path} asChild className="rounded-xl focus:bg-slate-50 dark:focus:bg-slate-800 p-2 cursor-pointer transition-colors duration-150">
                      <Link to={item.path} className="flex gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", item.iconColor)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{item.label}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">{item.desc}</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* DROPDOWN: DESENVOLVEDOR / API */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1",
                  isGroupActive(apiItems)
                    ? "bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                )}>
                  <Terminal className="h-3.5 w-3.5 mr-1" />
                  Acesso API
                  <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl mt-1 animate-in fade-in-50 slide-in-from-top-1">
                <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase px-2.5 py-1 tracking-widest">
                  Para Desenvolvedores
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800/60 my-1" />
                {apiItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.path} asChild className="rounded-xl focus:bg-slate-50 dark:focus:bg-slate-800 p-2 cursor-pointer transition-colors duration-150">
                      <Link to={item.path} className="flex gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", item.iconColor)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{item.label}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">{item.desc}</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* LINK: METODOLOGIA */}
            <Link to="/metodologia">
              <button className={cn(
                "text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5",
                isActive("/metodologia") 
                  ? "bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              )}>
                <BookOpen className="h-3.5 w-3.5" />
                Metodologia
              </button>
            </Link>

            {/* DROPDOWN: DESENVOLVEDOR / API */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1",
                  isGroupActive(apiItems)
                    ? "bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                )}>
                  <Library className="h-3.5 w-3.5 mr-1" />
                  Cursos
                  <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl mt-1 animate-in fade-in-50 slide-in-from-top-1">
                <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase px-2.5 py-1 tracking-widest">
                  Cursos Desenvolvidos
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800/60 my-1" />
                {cursoItens.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.path} asChild className="rounded-xl focus:bg-slate-50 dark:focus:bg-slate-800 p-2 cursor-pointer transition-colors duration-150">
                      <Link to={item.path} className="flex gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", item.iconColor)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{item.label}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">{item.desc}</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

          {/* LADO DIREITO: Logos Institucionais com Visual balanced */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden lg:flex items-center gap-4 border-l border-slate-200/50 dark:border-slate-800 pl-4 h-9">
              <img 
                src="/img/brasao.png" 
                alt="Brasão UFPB" 
                className="h-9 w-auto object-contain"
                title="Universidade Federal da Paraíba" 
              />
              <img 
                src="/img/PROEXFULL.png" 
                alt="Logo PROEX" 
                className="h-8 w-auto object-contain"
                title="Pró-Reitoria de Extensão UFPB" 
              />
            </div>

            {/* Botão de Menu Mobile */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden rounded-full border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </Button>
          </div>

        </div>
      </nav>

      {/* MOBILE SHEETS/DRAWER COM FRAMER MOTION (STAGGERED SLIDE OVER) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md"
            />

            {/* Slide-over Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white dark:bg-slate-950 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-900">
                <div className="flex items-center gap-2.5">
                  <img src="/img/logo.jpg" alt="logo" className="h-8 w-8 rounded-full object-cover" />
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    OI <span className="text-blue-500">Atuarial</span>
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-900"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Drawer Body (Staggered items) */}
              <div className="flex-1 py-8 px-6 space-y-6">
                
                {/* 1. SEÇÃO PRINCIPAL */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">
                    Navegação
                  </p>
                  <Link to="/" onClick={() => setIsOpen(false)} className="block">
                    <div className={cn(
                      "flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-colors",
                      isActive("/") 
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                    )}>
                      <Home className="h-4 w-4" />
                      Início
                    </div>
                  </Link>
                  <Link to="/metodologia" onClick={() => setIsOpen(false)} className="block">
                    <div className={cn(
                      "flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-colors",
                      isActive("/metodologia") 
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                    )}>
                      <BookOpen className="h-4 w-4" />
                      Metodologia Científica
                    </div>
                  </Link>
                </div>

                {/* 2. SEÇÃO ANÁLISES */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">
                    Análises & Séries
                  </p>
                  {analiseItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className="block">
                        <div className={cn(
                          "flex items-center justify-between p-3 rounded-xl font-bold text-xs transition-colors",
                          isActive(item.path) 
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                        )}>
                          <span className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            {item.label}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 opacity-40 shrink-0" />
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* 3. SEÇÃO PROJEÇÕES & API */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">
                    Inteligência & API
                  </p>
                  {[...projecoesItems, ...apiItems].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className="block">
                        <div className={cn(
                          "flex items-center justify-between p-3 rounded-xl font-bold text-xs transition-colors",
                          isActive(item.path) 
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                        )}>
                          <span className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            {item.label}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 opacity-40 shrink-0" />
                        </div>
                      </Link>
                    );
                  })}
                </div>

              </div>

              {/* Drawer Footer (Institutional support) */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 text-center">
                  Apoio Institucional
                </p>
                <div className="flex items-center justify-center gap-6">
                  <img src="/img/brasao.png" alt="Brasão UFPB" className="h-9 w-auto object-contain" />
                  <img src="/img/PROEXFULL.png" alt="Logo PROEX" className="h-8 w-auto object-contain" />
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;