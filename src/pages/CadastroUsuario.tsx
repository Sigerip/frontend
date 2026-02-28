"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Key, Mail, Code, Activity } from "lucide-react";

const formSchema = z.object({
    nome: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Email inválido"),
    uso: z.enum(["academico", "profissional", "pessoal"], {
        errorMap: () => ({ message: "Selecione um uso válido" })
    })
});

type FormData = z.infer<typeof formSchema>;

const CriarUsuario = () => {
    const navigate = useNavigate();
    
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: "",
            email: "",
            uso: "academico"
        }
    });

    const onSubmit = async (values: FormData) => {
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/cadastro`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ text: data.mensagem, type: 'success' });
                
                setTimeout(() => {
                    navigate("/usar-api"); 
                }, 4000);
                
                form.reset();
            } else {
                setMessage({ text: data.mensagem || "Erro ao cadastrar.", type: 'error' });
            }
        } catch (error) {
            setMessage({ text: "Erro de conexão com o servidor.", type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 md:p-8">
            {/* Container que segura os dois cards lado a lado */}
            <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-6 items-stretch">
                
                {/* CARD ESQUERDO: Informações e Dicas */}
                <Card className="flex-1 shadow-sm border-slate-200">
                    <CardContent className="p-8 flex flex-col h-full justify-center">
                        
                        {/* Espaço para a sua logo (substitua o ícone pela tag <img src="sua-logo.png" />) */}
                        <div className="flex items-center gap-3 mb-8">
                            <img src="/img/logo.jpg" alt="Logo" className="h-10 w-10 object-contain " /> {/* Remova o hidden quando tiver a imagem */}
                            
                            <span className="text-xl font-bold text-slate-800">API OI Atuarial</span>
                        </div>

                        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                            Acesso à API
                        </h2>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            Preencha o formulário ao lado para solicitar seu token de acesso à nossa API.
                        </p>

                        {/* Passo a passo usando o exato mesmo estilo visual dos seus cards do print */}
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 flex-shrink-0">
                                    <Mail className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">1. Confirmação por Email</h4>
                                    <p className="text-sm text-slate-500 mt-1">O token será enviado para a sua caixa de entrada (verifique a pasta de spam).</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 flex-shrink-0">
                                    <Key className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">2. Autenticação Segura</h4>
                                    <p className="text-sm text-slate-500 mt-1">Insira o token recebido no cabeçalho das requisições para acessar os dados.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 flex-shrink-0">
                                    <Code className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">3. Integração Simples</h4>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Consulte as <a href="/usar-api" className="text-blue-500 font-medium hover:underline">Instruções de Uso</a> para ver a documentação.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CARD DIREITO: Formulário de Cadastro */}
                <Card className="flex-1 shadow-sm border-slate-200">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-2xl font-bold text-slate-800">Cadastrar Usuário</CardTitle>
                        <CardDescription className="text-slate-500">
                            Preencha os dados abaixo para gerar suas credenciais.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-8 pt-0">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                
                                <FormField
                                    control={form.control}
                                    name="nome"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-medium">Nome Completo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Seu nome" {...field} className="border-slate-300 focus-visible:ring-blue-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-medium">Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="exemplo@email.com" {...field} className="border-slate-300 focus-visible:ring-blue-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="uso"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-medium">Finalidade de Uso</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="border-slate-300 focus:ring-blue-500">
                                                        <SelectValue placeholder="Selecione uma opção" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="academico">Acadêmico</SelectItem>
                                                    <SelectItem value="profissional">Profissional</SelectItem>
                                                    <SelectItem value="pessoal">Pessoal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {message && (
                                    <Alert variant={message.type === 'error' ? "destructive" : "default"} className={`mt-4 ${message.type === 'success' ? "border-green-500 bg-green-50 text-green-900" : ""}`}>
                                        {message.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4" />}
                                        <AlertTitle>{message.type === 'success' ? "Sucesso!" : "Erro!"}</AlertTitle>
                                        <AlertDescription>
                                            {message.text}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Botão azul combinando com a paleta do seu site */}
                                <Button 
                                    type="submit" 
                                    className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-sm transition-colors" 
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Processando..." : "Gerar Token de Acesso"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

            </div>
        </main>
    );
};

export default CriarUsuario;