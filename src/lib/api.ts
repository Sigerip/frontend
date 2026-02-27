// src/services/api.ts
const API_URL = "https://backend-weld-five-44.vercel.app";
const TOKEN = "sKuHU5d4SdQG8odtbnbSOGpKb_KgjZej_JJMD3mRCvQ";

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

export async function fetchDimensoes() {
  const [locais, faixas, sexos, modelos, anos_original, anos_projecoes] = await Promise.all([
    fetch(`${API_URL}/dimensoes/locais`, { headers }).then(r => r.json()),
    fetch(`${API_URL}/dimensoes/faixas`, { headers }).then(r => r.json()),
    fetch(`${API_URL}/dimensoes/sexos`, { headers }).then(r => r.json()),
    fetch(`${API_URL}/dimensoes/modelos`, { headers }).then(r => r.json()),
    fetch(`${API_URL}/dimensoes/anos_original`, { headers }).then(r => r.json()),
    fetch(`${API_URL}/dimensoes/anos_projecoes`, { headers }).then(r => r.json()),
  ]);

  return { locais, faixas, sexos, modelos, anos_original, anos_projecoes };
}

interface FilterParams {
  page?: number;
  local?: number; // Enviamos o ID
  ano?: number;
  sexo?: number;  // Enviamos o ID
  faixa?: number; // Enviamos o ID
}

export async function fetchTabuaOriginal(params: FilterParams) {
  // Converte objeto de parametros em query string (ex: ?page=1&ano=2022)
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value.toString());
  });

  const res = await fetch(`${API_URL}/original?${query.toString()}`, { headers });
  if (!res.ok) throw new Error("Falha ao buscar dados");
  return res.json();
}

export async function fetchTabuaProjecoes(params: FilterParams) {
  // Converte objeto de parametros em query string (ex: ?page=1&ano=2022)
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value.toString());
  });

  const res = await fetch(`${API_URL}/previsoes?${query.toString()}`, { headers });
  if (!res.ok) throw new Error("Falha ao buscar dados");
  return res.json();
}

const api = {
    fetchDimensoes,
    fetchTabuaOriginal,
    fetchTabuaProjecoes
    // adicione outras funções aqui se houver
};

export { api }; // Isso resolve o "export named 'api'"
export default api; // Isso resolve se você usar "import api from..."