import React, { useState } from 'react';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MultiLangCodeBlock = () => {
  const [activeTab, setActiveTab] = useState('python');
  const [isCopied, setIsCopied] = useState(false);

  const snippets = {
    python: {
      name: 'Python',
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

token <- "SEU TOKEN AQUI"
endpoint <- "ENDPOINT AQUI"

url <- paste0("https://backend-weld-five-44.vercel.app/oiatuarial_api/", endpoint)
headers <- add_headers(Authorization = paste0("Bearer ", token))


response <- GET(url, headers)
data <- content(response, "parsed")

dados <- read_parquet(data$url_download)

print(head(dados))`
    }
  };

  const handleCopy = async () => {
    try {
      const currentCode = snippets[activeTab as keyof typeof snippets].code;

      await navigator.clipboard.writeText(currentCode);
      setIsCopied(true);
      
      // Retorna ao estado original após 2 segundos
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      
    } catch (err) {
      console.error('Falha ao copiar o texto: ', err);
    }
  }

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-zinc-800 shadow-lg">
      
      {/* Cabeçalho com as Abas e Botão */}
      <div className="flex items-center justify-between bg-zinc-900 border-b border-zinc-800 pr-3">
        
        {/* Lado esquerdo: Abas */}
        <div className="flex">
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

        {/* Lado direito: Botão de Copiar com Animação Garantida */}
        <button
          onClick={handleCopy}
          className="relative flex items-center justify-center w-8 h-8 rounded-md transition-colors hover:bg-zinc-800/50 focus:outline-none"
          aria-label="Copiar código"
          title="Copiar código"
        >
          {/* AnimatePresence gerencia a entrada e saída suave dos ícones */}
          <AnimatePresence mode="wait" initial={false}>
            {isCopied ? (
              <motion.div
                key="check" // Chave única para o Framer Motion saber que é um elemento novo
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute"
              >
                <ClipboardCheck size={18} className="text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                key="clipboard" // Chave única do ícone normal
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute"
              >
                <Clipboard size={18} className="text-zinc-400 hover:text-zinc-200" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

      </div>

      {/* Área do código */}
      <pre className="p-4 bg-[#1e1e1e] text-zinc-100 overflow-x-auto text-sm">
        <code>{snippets[activeTab as keyof typeof snippets].code}</code>
      </pre>
    </div>
  );
};

export default MultiLangCodeBlock;