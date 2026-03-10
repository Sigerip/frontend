import React, { useState } from 'react';
import { Key, Code2, Network, CheckCircle2 } from 'lucide-react';

// Componente de Bloco de Código com Abas
const MultiLangCodeBlock = () => {
  const [activeTab, setActiveTab] = useState('python');

  const snippets = {
    python: {
      name: 'Python',
      code: `import requests
import pandas as pd

token = "SEU TOKEN AQUI"
dados = "DADOS QUE ESTÁ BUSCANDO"

url = f"https://backend-weld-five-44.vercel.app/oiatuarial_api/{dados}"
headers = {
    "Authorization": f"Bearer {token}"
}

response = requests.get(url, headers=headers)
data = response.json()

df = pd.read_parquet(data['url_download'])
print(df.head())`
    },
    
    r: {
      name: 'R',
      code: `# Dependências
install.packages("cli")
install.packages("arrow")
install.packages('httr')

# Bibliotecas
library(httr)
library(arrow)

dados <- "DADOS QUE ESTÁ BUSCANDO"
token <- "SEU TOKEM AQUI"

url <- paste0("https://backend-weld-five-44.vercel.app/oiatuarial_api/", dados)
headers <- add_headers(Authorization = paste0("Bearer ", token))


response <- GET(url, headers)
data <- content(response, "parsed")

dados <- read_parquet(data$url_download)

print(head(dados))`
    }
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-zinc-800 shadow-lg">
      <div className="flex bg-zinc-900 border-b border-zinc-800">
        {(Object.keys(snippets) as Array<keyof typeof snippets>).map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveTab(lang)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === lang
                ? 'text-primary border-b-2 border-primary bg-zinc-800/50'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
            }`}
          >
            {snippets[lang].name}
          </button>
        ))}
      </div>
      <pre className="p-4 bg-[#1e1e1e] text-zinc-100 overflow-x-auto text-sm">
        <code>{snippets[activeTab as keyof typeof snippets].code}</code>
      </pre>
    </div>
  );
};

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-3xl mx-auto py-16 px-6 sm:px-8 space-y-16">
        
        {/* Cabeçalho */}
        <header className="space-y-4 border-b border-border pb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Documentação da API
          </h1>
          <p className="text-muted-foreground text-lg justificado">
            Este guia fornece as instruções necessárias para autenticar e consumir nossos serviços. Siga os passos abaixo para integrar sua aplicação de forma segura.
          </p>
        </header>

        {/* 1. Como Cadastrar o Token */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Key className="text-primary" size={28} />
            <h2 className="text-3xl font-bold tracking-tight">1. Como Cadastrar o Token</h2>
          </div>
          
          <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground justificado">
            <p>
              O acesso aos endpoints requer um Token de Acesso.
            </p>
            <ul className="mt-4 space-y-3 list-none p-0">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-primary mt-1 shrink-0"/> 
                <span>Acesse a página de <a href="/solicitar-token">Solicitação de Token</a> e preencha o formulário para receber o token via email cadastrado.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-primary mt-1 shrink-0"/> 
                <span>Com o token em mãos, você pode utilizar a API conforme necessário. Caso tenha alguma dúvida, consulte as instruções abaixo de como consumir a API.</span>
              </li>
            </ul>
          </div>
        </section>

        <hr className="border-border" />

        {/* 2. Como Utilizar a API com Bearer Token */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Code2 className="text-primary" size={28} />
            <h2 className="text-3xl font-bold tracking-tight">2. Consumindo a API (Bearer Token)</h2>
          </div>
          
          <div className="text-muted-foreground justificado space-y-4">
            <p>
              Para usar a API, você deve enviar o Token recebido no cabeçalho <code>Authorization</code> de todas as requisições subsequentes, utilizando o esquema <strong>Bearer</strong>.
            </p>
            <p>Selecione a linguagem de sua preferência abaixo para ver como configurar o cabeçalho e fazer a requisição:</p>
          </div>
          
          <MultiLangCodeBlock />
        </section>

        <hr className="border-border" />

        {/* 3. Endpoints Disponíveis */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Network className="text-primary" size={28} />
            <h2 className="text-3xl font-bold tracking-tight">3. Endpoints</h2>
          </div>
          
          <p className="text-muted-foreground">
            Abaixo estão as rotas disponíveis para consumo dos dados que desejar utilizar.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border mt-6">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-4 font-semibold border-b border-border">Método</th>
                  <th className="p-4 font-semibold border-b border-border">Endpoint</th>
                  <th className="p-4 font-semibold border-b border-border">Descrição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background/50">
                <tr className="hover:bg-muted/30 transition-smooth">
                  <td className="p-4"><span className="text-blue-600 dark:text-blue-400 font-bold font-mono text-xs">GET</span></td>
                  <td className="p-4 font-mono text-xs font-medium">dados_mortalidade1</td>
                  <td className="p-4 text-muted-foreground">Retorna os dados de mortalidade originais.</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-smooth">
                  <td className="p-4"><span className="text-blue-600 dark:text-blue-400 font-bold font-mono text-xs">GET</span></td>
                  <td className="p-4 font-mono text-xs font-medium">projecoes</td>
                  <td className="p-4 text-muted-foreground">Retorna as projeções de mortalidade.</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-smooth">
                  <td className="p-4"><span className="text-blue-600 dark:text-blue-400 font-bold font-mono text-xs">GET</span></td>
                  <td className="p-4 font-mono text-xs font-medium">metricas_erro</td>
                  <td className="p-4 text-muted-foreground">Retorna as métricas de erro das projeções.</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-smooth">
                  <td className="p-4"><span className="text-blue-600 dark:text-blue-400 font-bold font-mono text-xs">GET</span></td>
                  <td className="p-4 font-mono text-xs font-medium">nacoes_unidas</td>
                  <td className="p-4 text-muted-foreground">Retorna os dados de mortalidade das nações unidas.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}