import { useState } from "react";

const BASE_URL = "https://backend-weld-five-44.vercel.app/oiatuarial_api";

interface Table {
  id: string;
  label: string;
  desc: string;
  icon: string;
}

interface LangColor {
  [key: string]: string;
}

const TABLES: Table[] = [
  {
    id: "dados_mortalidade1",
    label: "Tábua de Mortalidade",
    desc: "Dados históricos de mortalidade por sexo, faixa etária e localidade.",
    icon: "📊",
  },
  {
    id: "projecoes",
    label: "Projeções",
    desc: "Projeções atuariais de mortalidade por modelos estatísticos.",
    icon: "📈",
  },
  {
    id: "metricas_erro",
    label: "Métricas de Erro",
    desc: "Métricas de avaliação dos modelos de projeção (MAE, RMSE, etc).",
    icon: "🎯",
  },
  {
    id: "nacoes_unidas",
    label: "Nações Unidas",
    desc: "Dados de mortalidade da base das Nações Unidas (WPP).",
    icon: "🌍",
  },
];

const LANGS = ["Python", "R", "JavaScript", "Julia", "cURL"];

const langColors: LangColor = {
  Python: "#1a56a0",
  R: "#2a7f62",
  JavaScript: "#b07d12",
  Julia: "#6B46C1",
  cURL: "#c0392b",
};

function getCode(lang: string, table: string, apiKey: string): string {
  const key = apiKey || "sua_api_key_aqui";
  const url = `${BASE_URL}/${table}`;
  switch (lang) {
    case "Python":
      return `import requests
import pandas as pd

API_KEY = "${key}"

# 1. Obtém a URL do arquivo Parquet
response = requests.get(
    "${url}",
    headers={"Authorization": f"Bearer {API_KEY}"}
)

data = response.json()
parquet_url = data["url_download"]

# 2. Lê o Parquet diretamente com pandas
df = pd.read_parquet(parquet_url)
print(df.head())`;

    case "R":
      return `library(httr)
library(arrow)

api_key <- "${key}"

# 1. Obtém a URL do arquivo Parquet
response <- GET(
  "${url}",
  add_headers(Authorization = paste("Bearer", api_key))
)

data <- content(response, "parsed")
parquet_url <- data$url_download

# 2. Lê o Parquet com arrow
df <- read_parquet(parquet_url)
head(df)`;

    case "JavaScript":
      return `const API_KEY = "${key}";

// 1. Obtém a URL do arquivo Parquet
const response = await fetch("${url}", {
  headers: { Authorization: \`Bearer \${API_KEY}\` }
});

const data = await response.json();
const parquetUrl = data.url_download;

// 2. Use a URL para download ou leitura direta
console.log("Download URL:", parquetUrl);`;

    case "Julia":
      return `using HTTP, JSON, Parquet2, DataFrames

api_key = "${key}"

# 1. Obtém a URL do arquivo Parquet
response = HTTP.get(
    "${url}",
    headers = ["Authorization" => "Bearer \$api_key"]
)

data = JSON.parse(String(response.body))
parquet_url = data["url_download"]

# 2. Baixa e lê o Parquet
tmp = download(parquet_url, tempname() * ".parquet")
df = DataFrame(Parquet2.Dataset(tmp))
println(first(df, 5))`;

    case "cURL":
      return `# Obtém o link do arquivo Parquet
curl -X GET "${url}" \\
  -H "Authorization: Bearer ${key}"

# Resposta:
# {
#   "status": "sucesso",
#   "tabela": "${table}",
#   "url_download": "https://...",
#   "mensagem": "Use este link no pandas.read_parquet() ..."
# }

# Baixar o arquivo:
curl -L "<url_download>" -o ${table}.parquet`;

    default:
      return "";
  }
}

export default function UsarAPI() {
  const [selectedTable, setSelectedTable] = useState<string>("dados_mortalidade1");
  const [selectedLang, setSelectedLang] = useState<string>("Python");
  const [copied, setCopied] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");

  const code = getCode(selectedLang, selectedTable, apiKey);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedTableData = TABLES.find((t) => t.id === selectedTable);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f5f7fa", minHeight: "100vh", color: "#1a2340" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Outfit:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f5f7fa; }
        ::-webkit-scrollbar-thumb { background: #c2cedf; border-radius: 3px; }

        .hero-section {
          background: linear-gradient(135deg, #0d47a1 0%, #1565c0 40%, #1976d2 70%, #1e88e5 100%);
          position: relative;
          overflow: hidden;
        }

        .hero-pattern {
          position: absolute; inset: 0;
          background-image:
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 40%),
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 48px 48px, 48px 48px;
          pointer-events: none;
        }

        .step-card {
          background: #fff;
          border: 1px solid #e3eaf5;
          border-radius: 14px;
          padding: 24px;
          position: relative;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .step-card:hover { box-shadow: 0 4px 20px rgba(21,101,192,0.1); border-color: #90b4e8; }

        .step-num {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700;
          font-family: 'Outfit', sans-serif;
          flex-shrink: 0;
        }

        .table-card {
          cursor: pointer;
          background: #fff;
          border: 2px solid #e3eaf5;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.18s ease;
        }
        .table-card:hover { border-color: #1565c0; box-shadow: 0 2px 12px rgba(21,101,192,0.12); }
        .table-card.active { border-color: #1565c0; background: #e8f0fb; box-shadow: 0 2px 16px rgba(21,101,192,0.18); }

        .lang-btn {
          cursor: pointer;
          border: 1.5px solid #d0daea;
          background: #fff;
          color: #4a6080;
          padding: 8px 18px;
          border-radius: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.15s ease;
        }
        .lang-btn:hover { border-color: #1565c0; color: #1565c0; background: #edf3fc; }
        .lang-btn.active { border-color: transparent; color: #fff; }

        .code-block {
          background: #0f1c36;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #1e3060;
          box-shadow: 0 8px 32px rgba(13,71,161,0.2);
        }

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background: #0a1428;
          border-bottom: 1px solid #1e3060;
        }

        pre {
          padding: 24px;
          overflow-x: auto;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.8;
          color: #a8c4e8;
          tab-size: 2;
          white-space: pre;
        }

        .copy-btn {
          cursor: pointer;
          border: 1px solid #2a4070;
          background: #162040;
          color: #6a8fc0;
          padding: 6px 14px;
          border-radius: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          transition: all 0.15s;
        }
        .copy-btn:hover { border-color: #4a8fe0; color: #4a8fe0; }
        .copy-btn.copied { border-color: #27ae60; color: #27ae60; }

        .key-input {
          background: #fff;
          border: 1.5px solid #d0daea;
          color: #1a2340;
          padding: 11px 16px;
          border-radius: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          width: 100%;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .key-input:focus { border-color: #1565c0; box-shadow: 0 0 0 3px rgba(21,101,192,0.12); }
        .key-input::placeholder { color: #9aadca; }

        .response-box {
          background: #0f1c36;
          border-radius: 14px;
          padding: 24px 28px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.9;
          border: 1px solid #1e3060;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.35s ease forwards; }

        .section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #0d2860;
          margin-bottom: 6px;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #d0daea 20%, #d0daea 80%, transparent);
          margin: 56px 0;
        }

        .endpoint-bar {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          padding: 12px 20px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
        }

        .error-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 16px;
          border-radius: 10px;
          background: #fff;
          border: 1px solid #e3eaf5;
        }

        .table-ref-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: #fff;
          transition: background 0.15s;
        }
        .table-ref-row:hover { background: #f0f5fd; }
        .table-ref-row + .table-ref-row { border-top: 1px solid #e8eef7; }

        .pill-blue {
          background: #e8f0fb;
          color: #1565c0;
          border: 1px solid #b3cfee;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .nav-bar {
          background: #fff;
          border-bottom: 1px solid #e3eaf5;
          padding: 14px 32px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: sticky; top: 0; z-index: 100;
          box-shadow: 0 1px 8px rgba(0,0,0,0.06);
        }

        .info-banner {
          background: #e8f5e9;
          border: 1px solid #a5d6a7;
          border-radius: 10px;
          padding: 12px 18px;
          font-size: 13px;
          color: #2e7d32;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          line-height: 1.6;
        }
      `}</style>

      {/* Hero */}
      <div className="hero-section">
        <div className="hero-pattern" />
        <div style={{ position: "relative", maxWidth: 820, margin: "0 auto", padding: "72px 24px 64px", textAlign: "center" }}>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 800, color: "#fff", lineHeight: 1.12, marginBottom: 18, letterSpacing: "-0.02em" }}>
            API de Dados para<br />
            <span style={{ color: "#90caf9" }}>Análise Atuarial</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 16, maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.75 }}>
            Acesse tábuas de mortalidade, projeções e dados das Nações Unidas diretamente em Python, R, Julia e muito mais.
          </p>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="endpoint-bar">
              <span style={{ background: "rgba(39,174,96,0.25)", color: "#69f0ae", border: "1px solid rgba(39,174,96,0.4)", padding: "2px 10px", borderRadius: 5, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>GET</span>
              <code style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                <span style={{ color: "rgba(255,255,255,0.45)" }}>{BASE_URL}</span>
                <span style={{ color: "#90caf9" }}>/oiatuarial_api/</span>
                <span style={{ color: "#ffd54f" }}>{"{"+"tabela"+"}"}</span>
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "64px 24px" }}>

        {/* Como funciona */}
        <section style={{ marginBottom: 64 }}>
          <div className="section-title">Como funciona</div>
          <p style={{ color: "#6b82a0", marginBottom: 32, fontSize: 14, lineHeight: 1.6 }}>Três passos para ter seus dados prontos para análise.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                n: "1",
                color: "#1565c0",
                bg: "#e8f0fb",
                title: "Autentique-se com sua API Key",
                desc: "Envie sua chave no header Authorization como Bearer Token em toda requisição à API.",
                extra: (
                  <div style={{ marginTop: 14, background: "#0f1c36", borderRadius: 8, padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                    <span style={{ color: "#6a8fc0" }}>Authorization: </span>
                    <span style={{ color: "#69c0f0" }}>Bearer </span>
                    <span style={{ color: "#ffd54f" }}>sua_api_key</span>
                  </div>
                ),
              },
              {
                n: "2",
                color: "#1976d2",
                bg: "#e3f2fd",
                title: "Faça GET com o nome da tabela",
                desc: "A API retorna um JSON com a URL do arquivo .parquet hospedado em nossa CDN.",
                extra: null,
              },
              {
                n: "3",
                color: "#2a7f62",
                bg: "#e8f5e9",
                title: "Leia o Parquet diretamente",
                desc: "Use a url_download no pandas, arrow, ou qualquer biblioteca que suporte Parquet — sem salvar no disco.",
                extra: null,
              },
            ].map((s) => (
              <div key={s.n} className="step-card" style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div className="step-num" style={{ background: s.bg, color: s.color }}>0{s.n}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#0d2860", marginBottom: 5 }}>{s.title}</div>
                  <div style={{ color: "#6b82a0", fontSize: 13, lineHeight: 1.65 }}>{s.desc}</div>
                  {s.extra}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* Resposta */}
        <section style={{ marginBottom: 64 }}>
          <div className="section-title">Resposta da API</div>
          <p style={{ color: "#6b82a0", marginBottom: 28, fontSize: 14 }}>JSON retornado em uma chamada bem-sucedida (HTTP 200).</p>

          <div className="response-box">
            <div style={{ color: "#4a6a9a" }}>{"{"}</div>
            {[
              { k: "status", v: '"sucesso"', c: "#69c0a0" },
              { k: "tabela", v: '"dados_mortalidade1"', c: "#ffd54f" },
              { k: "url_download", v: '"https://cdn.oiatuarial.com.br/dados_mortalidade1.parquet"', c: "#90caf9" },
              { k: "mensagem", v: '"Use este link no pandas.read_parquet() para baixar os dados."', c: "#a8c4e8" },
            ].map(({ k, v, c }) => (
              <div key={k} style={{ paddingLeft: 24 }}>
                <span style={{ color: "#c792ea" }}>"{k}"</span>
                <span style={{ color: "#4a6a9a" }}>: </span>
                <span style={{ color: c }}>{v}</span>
                <span style={{ color: "#4a6a9a" }}>,</span>
              </div>
            ))}
            <div style={{ color: "#4a6a9a" }}>{"}"}</div>
          </div>

          {/* Status codes */}
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { code: "200", label: "OK", msg: "Sucesso — url_download disponível", color: "#2e7d32", bg: "#e8f5e9", border: "#a5d6a7" },
              { code: "401", label: "Unauthorized", msg: "Chave de API ausente ou inválida", color: "#c0392b", bg: "#fdecea", border: "#ef9a9a" },
              { code: "400", label: "Bad Request", msg: "Tabela não existe ou inválida", color: "#b07d12", bg: "#fff8e1", border: "#ffe082" },
              { code: "429", label: "Too Many Requests", msg: "Limite de 20 req/min excedido", color: "#6B46C1", bg: "#f3e8ff", border: "#c4b5fd" },
            ].map((e) => (
              <div key={e.code} className="error-row" style={{ borderColor: e.border }}>
                <span style={{ background: e.bg, color: e.color, border: `1px solid ${e.border}`, padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", whiteSpace: "nowrap" }}>{e.code}</span>
                <span style={{ color: "#4a6080", fontSize: 13 }}>{e.msg}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* Playground */}
        <section>
          <div className="section-title">Exemplos de código</div>
          <p style={{ color: "#6b82a0", marginBottom: 32, fontSize: 14 }}>Selecione a tabela e a linguagem. Cole sua API Key para personalizar o snippet.</p>

          {/* API Key */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 12, color: "#6b82a0", display: "block", marginBottom: 8, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Sua API Key <span style={{ color: "#b0bec5", fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              className="key-input"
              type="password"
              placeholder="Cole sua chave aqui para personalizar o código..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          {/* Tabelas */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 12, color: "#6b82a0", display: "block", marginBottom: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Tabelas</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))", gap: 10 }}>
              {TABLES.map((t) => (
                <div
                  key={t.id}
                  className={`table-card ${selectedTable === t.id ? "active" : ""}`}
                  onClick={() => setSelectedTable(t.id)}
                >
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{t.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: selectedTable === t.id ? "#1565c0" : "#0d2860" }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: "#9aadca", fontFamily: "'JetBrains Mono',monospace" }}>{t.id}</div>
                </div>
              ))}
            </div>
            {selectedTableData && (
              <div style={{ marginTop: 12, padding: "10px 16px", background: "#e8f0fb", borderRadius: 8, fontSize: 13, color: "#1a4a90", borderLeft: "3px solid #1565c0", lineHeight: 1.6 }}>
                {selectedTableData.desc}
              </div>
            )}
          </div>

          {/* Linguagens */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: "#6b82a0", display: "block", marginBottom: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Linguagems</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {LANGS.map((l) => (
                <button
                  key={l}
                  className={`lang-btn ${selectedLang === l ? "active" : ""}`}
                  onClick={() => setSelectedLang(l)}
                  style={selectedLang === l ? { background: langColors[l] } : {}}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Code */}
          <div className="code-block fade-up" key={selectedTable + selectedLang}>
            <div className="code-header">
              <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
                <span style={{ marginLeft: 14, fontSize: 12, color: "#4a6a9a", fontFamily: "'JetBrains Mono',monospace" }}>
                  {selectedLang === "cURL" ? "terminal" : selectedLang === "Python" ? "script.py" : selectedLang === "R" ? "script.R" : selectedLang === "Julia" ? "script.jl" : "script.js"}
                </span>
              </div>
              <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
                {copied ? "✓ copiado" : "copiar"}
              </button>
            </div>
            <pre>{code}</pre>
          </div>

          <div className="info-banner" style={{ marginTop: 16 }}>
            <span>ℹ️</span>
            <span>
              A <code style={{ background: "rgba(0,0,0,0.08)", padding: "1px 6px", borderRadius: 4 }}>url_download</code> retornada é um link direto para o arquivo <strong>.parquet</strong>. Você pode lê-lo sem precisar salvá-lo no disco — o pandas e o arrow suportam URLs remotas nativamente.
            </span>
          </div>
        </section>

        <div className="divider" />

        {/* Tabelas disponíveis */}
        <section>
          <div className="section-title">Tabelas disponíveis</div>
          <p style={{ color: "#6b82a0", marginBottom: 24, fontSize: 14 }}>Todas as tabelas acessíveis via <code style={{ background: "#e8f0fb", color: "#1565c0", padding: "2px 8px", borderRadius: 5, fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>/oiatuarial_api/{"<tabela>"}</code></p>

          <div style={{ border: "1px solid #e3eaf5", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
            {TABLES.map((t, i) => (
              <div key={t.id} className="table-ref-row">
                <span style={{ fontSize: 22, width: 36, textAlign: "center", flexShrink: 0 }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                    <code style={{ color: "#1565c0", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600 }}>{t.id}</code>
                    <span className="pill-blue">{t.label}</span>
                  </div>
                  <div style={{ color: "#6b82a0", fontSize: 13 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}