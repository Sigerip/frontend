// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = import.meta.env.VITE_TOKEN;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

export class ChatApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ChatApiError";
    this.status = status;
  }
}

export interface ChatAgnoRequest {
  user_message: string;
  //chart_title: string;
  chart_data: Record<string, unknown> | unknown[];
  session_context?: {
    conversation_id?: string;
    route_path?: string;
    timestamp_iso?: string;
    timezone?: string;
    client_context?: Record<string, unknown>;
    recent_messages?: Array<{
      sender: "user" | "ia";
      text: string;
      timestamp: number;
    }>;
  };
}

export interface ChatAgnoResponse {
  reply: string;
  table_used?: string;
  model?: string;
}

interface ChatAgnoErrorResponse {
  erro?: string;
  error?: string;
  message?: string;
}

function composeAbortSignal(
  externalSignal: AbortSignal | undefined,
  timeoutMs: number,
): { signal: AbortSignal; clear: () => void; didTimeout: () => boolean } {
  const internalController = new AbortController();
  let timedOut = false;

  const timeoutId = window.setTimeout(() => {
    timedOut = true;
    internalController.abort();
  }, timeoutMs);

  const onExternalAbort = () => {
    internalController.abort();
  };

  if (externalSignal) {
    if (externalSignal.aborted) {
      internalController.abort();
    } else {
      externalSignal.addEventListener("abort", onExternalAbort);
    }
  }

  return {
    signal: internalController.signal,
    clear: () => {
      window.clearTimeout(timeoutId);
      if (externalSignal) {
        externalSignal.removeEventListener("abort", onExternalAbort);
      }
    },
    didTimeout: () => timedOut,
  };
}

async function parseChatError(res: Response): Promise<string> {
  const fallback = "Não foi possível obter resposta agora. Tente novamente.";

  try {
    const data = (await res.json()) as ChatAgnoErrorResponse;
    return data.erro || data.error || data.message || fallback;
  } catch {
    return fallback;
  }
}

export async function postChatAgno(
  payload: ChatAgnoRequest,
  options?: { signal?: AbortSignal; timeoutMs?: number },
): Promise<ChatAgnoResponse> {
  const timeoutMs = options?.timeoutMs ?? 20_000;
  const { signal, clear, didTimeout } = composeAbortSignal(options?.signal, timeoutMs);

  try {
    const request = {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal,
    } satisfies RequestInit;

    const primaryResponse = await fetch(`${API_URL}/api/chat`, request);
    if (primaryResponse.ok) {
      return (await primaryResponse.json()) as ChatAgnoResponse;
    }

    if (primaryResponse.status !== 404 && primaryResponse.status !== 405) {
      const message = await parseChatError(primaryResponse);
      throw new ChatApiError(message, primaryResponse.status);
    }

    const fallbackResponse = await fetch(`${API_URL}/api/chatagno`, request);
    if (!fallbackResponse.ok) {
      const message = await parseChatError(fallbackResponse);
      throw new ChatApiError(message, fallbackResponse.status);
    }

    return (await fallbackResponse.json()) as ChatAgnoResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      if (didTimeout()) {
        throw new Error("A resposta demorou mais do que o esperado. Tente novamente.");
      }
      throw new Error("Solicitação cancelada.");
    }
    throw error;
  } finally {
    clear();
  }
}

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

// Tipagem simples para o payload da IA
export interface ChatPayload {
  mensagem: string;
  contexto: any;
}

export async function fetchChatIA(payload: ChatPayload) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Falha na comunicação com a API de Chat");
  }

  // Espera que o backend retorne { "resposta": "texto da ia" }
  return res.json(); 
}

const api = {
    fetchDimensoes,
    fetchTabuaOriginal,
    fetchTabuaProjecoes,
    fetchChatIA
};

export { api };
export default api;