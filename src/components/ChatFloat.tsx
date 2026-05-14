import React, { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChatAgno } from "@/hooks/use-chat-agno";

interface FloatingChatProps {
  chartData: Record<string, unknown> | unknown[];
  chartTitle: string;
}

export default function FloatingChat({ chartData, chartTitle }: FloatingChatProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Hook simplificado
  const { messages, isLoading, sendMessage } = useChatAgno({ chartData });

  const rotasOcultas = ["/", "/solicitar-token", "/usar-api"];

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  if (rotasOcultas.includes(location.pathname)) {
    return null;
  }

  const handleSendMessage = async () => {
    const userMessage = message.trim();
    if (!userMessage) return;
    
    setMessage("");
    await sendMessage(userMessage);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      void handleSendMessage();
    }
  };
  console.log()

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-[420px] h-[520px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300">
          
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
              </svg>
              <div>
                <h3 className="font-semibold text-sm">Assistente Atuarial</h3>
                <p className="text-[11px] opacity-90">Contexto atual: {chartTitle}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[88%] p-3 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white self-end rounded-br-none shadow-sm"
                    : `bg-white border text-gray-800 self-start rounded-bl-none shadow-sm ${
                        msg.isError ? "border-red-300 bg-red-50 text-red-800" : "border-gray-200"
                      }`
                }`}
              >
                {msg.sender === "user" ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-pre:my-1 prose-ul:my-1 prose-ol:my-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="bg-white border border-gray-200 text-gray-500 self-start p-3 rounded-lg rounded-bl-none text-sm shadow-sm flex gap-1 items-center">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>●</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200 flex gap-2 items-center z-10">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Digite sua dúvida sobre o gráfico visível..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              onClick={() => void handleSendMessage()}
              disabled={isLoading || !message.trim()}
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"} text-white p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105 active:scale-95`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.221-1.15-2.136-2.389-2.307a48.667 48.667 0 00-7.312 0c-1.238.171-2.389 1.086-2.389 2.307v1.131m12 10.336c-1.18.16-2.367.27-3.558.322" />
          </svg>
        )}
      </button>
    </div>
  );
}