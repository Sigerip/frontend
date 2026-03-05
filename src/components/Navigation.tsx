import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Início" },
    { path: "/metodologia", label: "Metodologia" },
    { path: "/dados-mortalidade", label: "Dados Mortalidade" },
    { path: "/expectativa-vida", label: "Expectativa de Vida" },
    { path: "/mortalidade-infantil", label: "Mortalidade Infantil" },
    { path: "/previsao-mortalidade", label: "Previsão Mortalidade" },
    { path: "/previsao-expectativa", label: "Previsão Expectativa" },
    { path: "/solicitar-token", label: "Solicitar Token" },
    { path: "/usar-api", label: "Usar API" }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/30">
      <div className="mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* LADO ESQUERDO: Logo e Título 
              Adicionado mr-8 xl:mr-16 para afastar o menu "Início" e space-x-3 para afastar o nome da bolinha */}
          <Link to="/" className="flex items-center space-x-2 mr-8 xl:mr-8 shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <img src="/img/logo.jpg" alt="logo" className="h-full w-full rounded-full object-cover" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              OIAtuarial
            </span>
          </Link>

          {/* CENTRO: Links de Navegação (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1 w-full justify-start">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "transition-all",
                    isActive(item.path) && "shadow-md"
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* LADO DIREITO: Apoiadores e Botão Mobile */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            
            {/* Imagens dos Apoiadores - Ocultas no Mobile 
                Trocado h-8 para h-12 para aumentar as logos */}
            <div className="hidden md:flex items-center gap-5 border-l border-slate-200 pl-4 md:pl-6">
              <img 
                src="/img/brasao.png" 
                alt="Apoiador 1" 
                className="h-12 w-auto object-contain" 
              />
              <img 
                src="/img/PROEXFULL.png" 
                alt="Apoiador 2" 
                className="h-12 w-auto object-contain" 
              />
            </div>

            {/* Botão do Menu Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-2 animate-fade-in">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
              >
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            
            {/* Apoiadores dentro do Menu Mobile */}
            <div className="flex items-center justify-center gap-6 pt-4 mt-4 border-t border-slate-200">
               <img src="/img/brasao.png" alt="Apoiador 1" className="h-10 w-auto object-contain opacity-70" />
               <img src="/img/PROEXFULL.png" alt="Apoiador 2" className="h-10 w-auto object-contain opacity-70" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;