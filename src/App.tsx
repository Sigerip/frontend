import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Metodologia from "./pages/Metodologia";
import DadosMortalidade from "./pages/DadosMortalidade";
import ExpectativaVida from "./pages/ExpectativaVida";
import MortalidadeInfantil from "./pages/MortalidadeInfantil";
import PrevisaoMortalidade from "./pages/PrevisaoMortalidade";
import PrevisaoExpectativa from "./pages/PrevisaoExpectativa";
import MortalidadePage from "./pages/MortalidadePage";
import Teste from "./pages/teste2";
import NotFound from "./pages/NotFound";
import CadastroUsuario from "./pages/CadastroUsuario";
import UsarApi from "./pages/UsarApi";

const queryClient = new QueryClient();

const App = () => {
  // Opcional: Se você salva o token no localStorage ao solicitar a API, você pode puxá-lo aqui.
  // Caso contrário, você precisará gerenciar esse estado dependendo de como o usuário faz "login" na sua ferramenta.
  const TOKEN = import.meta.env.VITE_TOKEN;
  const userApiKey = localStorage.getItem("api_key") || TOKEN;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teste2" element={<Teste />}/>
            <Route path="/metodologia" element={<Metodologia />} />
            <Route path="/dados-mortalidade" element={<DadosMortalidade />} />
            <Route path="/expectativa-vida" element={<ExpectativaVida />} />
            <Route path="/mortalidade-infantil" element={<MortalidadeInfantil />} />
            <Route path="/previsao-mortalidade" element={<PrevisaoMortalidade />} />
            <Route path="/mortalidade" element={<MortalidadePage />} />
            <Route path="/previsao-expectativa" element={<PrevisaoExpectativa />} />
            <Route path="/solicitar-token" element={<CadastroUsuario />} />
            <Route path="/usar-api" element={<UsarApi />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>

        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;