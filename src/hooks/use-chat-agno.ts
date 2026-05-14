import { useState } from "react";
import { api } from "@/lib/api";

export type ChatSender = "user" | "ia";

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  isError?: boolean;
}

interface UseChatAgnoOptions {
  chartData: any;
}

export function useChatAgno({ chartData }: UseChatAgnoOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "ia",
      text: "Olá! Sou seu assistente atuarial. Como posso ajudar hoje com os dados visíveis?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userMessage: string) => {
    const text = userMessage.trim();
    if (!text) return;

    // 1. Adiciona a mensagem do usuário na tela
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", text },
    ]);
    
    setIsLoading(true);

    try {
      // 2. Envia para a API APENAS a mensagem e o contexto atual
      const response = await api.fetchChatIA({
        mensagem: text,
        contexto: chartData,
      });

      // 3. Adiciona a resposta da IA na tela
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ia",
          text: response.resposta || "Desculpe, não consegui formular uma resposta.",
        },
      ]);
    } catch (error) {
      // 4. Tratamento de erro simplificado
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ia",
          text: "Ocorreu um erro ao conectar com o assistente. Tente novamente.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
}