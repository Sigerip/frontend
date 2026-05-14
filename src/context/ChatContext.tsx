import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Tipagem das mensagens
export interface ChatMessage {
  sender: 'user' | 'ia';
  text: string;
}

// 2. O que o contexto vai guardar?
interface ChatContextData {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isOpen: boolean; // Opcional: mantém o chat aberto mesmo ao trocar de tela
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData);

export function ChatProvider({ children }: { children: ReactNode }) {
  // Histórico inicial
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ia', text: 'Olá! Sou seu assistente atuarial. Como posso ajudar hoje?' }
  ]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <ChatContext.Provider value={{ messages, setMessages, isOpen, setIsOpen }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChatContext deve ser usado dentro de um ChatProvider');
  return context;
};