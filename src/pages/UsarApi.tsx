import React, { useState } from 'react';
import { Key, Code2, Network, CheckCircle2, Clipboard, ArrowRight, BookOpen, Terminal, Shield } from 'lucide-react';
import { ClipboardCheck } from "@/components/animate-ui/icons/clipboard-check";
import { motion, AnimatePresence } from "motion/react";

// Componente de Bloco de Código com Abas
const MultiLangCodeBlock = () => {
  const [activeTab, setActiveTab] = useState<'python' | 'r'>('python');
  const [isCopied, setIsCopied] = useState(false);

  const snippets = {
    python: {
      name: 'Python',
      langClass: 'python',
      code: `import requests
import pandas as pd

token = "SEU TOKEN AQUI"
endpoint = "ENDPOINT AQUI"

url = f"https://backend-weld-five-44.vercel.app/oiatuarial_api/{endpoint}"
headers = {
    "Authorization": f"Bearer {token}"
}

response = requests.get(url, headers=headers)
data = response.json()

# O link de download retorna os dados no formato Parquet comprimido de alta performance
df = pd.read_parquet(data['url_download'])
print(df.head())`
    },
    
    r: {
      name: 'R',
      langClass: 'r',
      code: `# Dependências necessárias
install.packages("httr")
install.packages("arrow")

# Bibliotecas
library(httr)
library(arrow)

token <- "SEU TOKEM AQUI"
endpoint <- "ENDPOINT AQUI"

url <- paste0("https://backend-weld-five-44.vercel.app/oiatuarial_api/", endpoint)
headers <- add_headers(Authorization = paste0("Bearer ", token))

response <- GET(url, headers)
data <- content(response, "parsed")

# O link de download retorna os dados no formato Parquet comprimido de alta performance
dados <- read_parquet(data$url_download)

print(head(dados))`
    }
  };

  const handleCopy = async () => {
    try {
      const currentCode = snippets[activeTab].code;
      await navigator.clipboard.writeText(currentCode);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Falha ao copiar o texto: ', err);
    }
  };

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-primary/10 bg-[#070b13]/85 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-primary/20">
      {/* Top Bar / Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-background/60 border-b border-primary/10">
        <div className="flex gap-2">
          {(Object.keys(snippets) as Array<'python' | 'r'>).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`relative px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${
                activeTab === lang
                  ? 'text-white bg-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.15)] border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
              }`}
            >
              {snippets[lang].name}
            </button>
          ))}
        </div>
        
        <button 
          onClick={handleCopy}
          className="p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5"
          title="Copiar código"
        >
          {isCopied ? (
            <ClipboardCheck size={16} className="text-emerald-400" transition={{ duration: 0.8 }}/>
          ) : (
            <Clipboard animateOnHover size={16} />
          )}
        </button>
      </div>

      {/* Code Editor Area */}
      <div className="relative p-6 overflow-x-auto font-mono text-sm leading-relaxed text-zinc-100 max-h-[350px]">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10" />
        
        <pre className="text-zinc-300">
          <code>
            {snippets[activeTab].code.split('\n').map((line, i) => {
              // Simple highlighting helper
              let styledLine = line;
              if (line.trim().startsWith('#')) {
                // Comments
                return <div key={i} className="text-zinc-500 italic">{line}</div>;
              }
              
              // Keywords
              if (line.includes('import ') || line.includes('from ') || line.includes('library') || line.includes('install.packages')) {
                return (
                  <div key={i}>
                    <span className="text-pink-400 font-semibold">
                      {line.split(' ').map((word, idx) => {
                        if (['import', 'from', 'library'].includes(word.replace(/[()]/g, ''))) {
                          return <span key={idx} className="text-pink-400">{word} </span>;
                        }
                        return <span key={idx} className="text-zinc-300">{word} </span>;
                      })}
                    </span>
                  </div>
                );
              }
              
              // Strings
              if (line.includes('"') || line.includes("'")) {
                const parts = line.split(/(".*?"|'.*?')/);
                return (
                  <div key={i}>
                    {parts.map((part, idx) => {
                      if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
                        return <span key={idx} className="text-emerald-400 font-medium">{part}</span>;
                      }
                      return <span key={idx}>{part}</span>;
                    })}
                  </div>
                );
              }

              return <div key={i}>{line}</div>;
            })}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 text-foreground py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Glowing background highlights */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-3xl -z-10 animate-pulse duration-[8s]" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* Cabeçalho */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 pb-8 border-b border-primary/10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary uppercase tracking-wider">
            <Terminal size={14} />
            Área do Desenvolvedor
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Instruções de uso da{' '}
            <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-300 bg-clip-text text-transparent">
              API
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed text-center">
            Integre os modelos preditivos e tábuas de vida do sistema SIGERIP diretamente em seus scripts R ou Python de forma extremamente performática e segura.
          </p>
        </motion.header>

        {/* 1. Como Cadastrar o Token */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-card/30 backdrop-blur-md border border-primary/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
        >
          {/* Card subtle neon top border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-primary">
              <Key size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">1. Solicitação & Configuração do Token</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Como obter credenciais autorizadas de acesso</p>
            </div>
          </div>
          
          <div className="text-muted-foreground space-y-6 leading-relaxed">
            <p className="text-justify text-sm md:text-base">
              Para interagir com as APIs restritas, é obrigatório possuir uma chave privada autorizada (Bearer Token). Isso garante a segurança e rastreabilidade das requisições.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/40 border border-primary/5 rounded-xl p-5 hover:border-primary/15 hover:bg-background/60 transition-all duration-300">
                <div className="flex items-center gap-2 text-foreground font-semibold mb-2">
                  <Shield size={16} className="text-primary" />
                  <span>Passo 1: Cadastro</span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground text-justify">
                  Navegue até a página de{' '}
                  <a href="/solicitar-token" className="text-primary font-medium hover:underline inline-flex items-center gap-0.5">
                    Cadastro de Usuário
                    <ArrowRight size={10} />
                  </a>{' '}
                  e submeta as informações de finalidade para gerar sua chave privada instantaneamente.
                </p>
              </div>

              <div className="bg-background/40 border border-primary/5 rounded-xl p-5 hover:border-primary/15 hover:bg-background/60 transition-all duration-300">
                <div className="flex items-center gap-2 text-foreground font-semibold mb-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>Passo 2: Utilização</span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground text-justify">
                  Copie o token gerado e salve-o em seu ambiente de desenvolvimento local de forma confidencial. Nunca exponha seu token publicamente no GitHub.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 2. Como Utilizar a API com Bearer Token */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card/30 backdrop-blur-md border border-primary/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0" />
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <Code2 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">2. Consumo & Autenticação (Bearer)</h2>
              <p className="text-sm text-muted-foreground mt-0.5 font-sans">Requisições HTTP estruturadas com cabeçalho seguro</p>
            </div>
          </div>
          
          <div className="text-muted-foreground space-y-4 text-justify leading-relaxed">
            <p className="text-sm md:text-base">
              A autenticação é feita via cabeçalho HTTP padrão <code>Authorization</code> com o esquema <strong>Bearer</strong>. Os endpoints de dados disponibilizam links temporários assinados para baixar os conjuntos de dados em formato <strong>Parquet</strong> para máxima eficiência.
            </p>
            <p className="text-sm">Selecione a linguagem de preferência para visualizar o script de integração:</p>
          </div>
          
          <MultiLangCodeBlock />
        </motion.section>

        {/* 3. Endpoints Disponíveis */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-card/30 backdrop-blur-md border border-primary/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0" />
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
              <Network size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">3. Catálogo de Endpoints</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Rotas HTTP disponíveis para consumo</p>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm mb-6">
            Todos os endpoints abaixo respondem na URL base <code>https://backend-weld-five-44.vercel.app/oiatuarial_api/</code> e exigem autenticação ativa.
          </p>

          <div className="overflow-x-auto rounded-xl border border-primary/10 bg-background/20">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-primary/5 text-muted-foreground border-b border-primary/10">
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Método</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Endpoint</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Descrição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 font-sans">
                <tr className="hover:bg-primary/5 transition-all duration-300">
                  <td className="p-4">
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                      GET
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs font-semibold text-foreground">dados_mortalidade1</td>
                  <td className="p-4 text-xs text-muted-foreground leading-relaxed">
                    Retorna o mapeamento dos dados históricos de mortalidade observados.
                  </td>
                </tr>
                <tr className="hover:bg-primary/5 transition-all duration-300">
                  <td className="p-4">
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                      GET
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs font-semibold text-foreground">projecoes</td>
                  <td className="p-4 text-xs text-muted-foreground leading-relaxed">
                    Retorna as estimativas projetadas de taxas de mortalidade (nMx).
                  </td>
                </tr>
                <tr className="hover:bg-primary/5 transition-all duration-300">
                  <td className="p-4">
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                      GET
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs font-semibold text-foreground">metricas_erro</td>
                  <td className="p-4 text-xs text-muted-foreground leading-relaxed">
                    Retorna as métricas estatísticas de validação e calibração dos modelos.
                  </td>
                </tr>
                <tr className="hover:bg-primary/5 transition-all duration-300">
                  <td className="p-4">
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                      GET
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs font-semibold text-foreground">nacoes_unidas</td>
                  <td className="p-4 text-xs text-muted-foreground leading-relaxed">
                    Retorna os conjuntos de dados de mortalidade e tábuas da ONU para comparação.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

      </div>
    </div>
  );
}