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
import { motion } from "motion/react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Key, Mail, Code, Activity } from "lucide-react";
import { Description } from "@radix-ui/react-toast";



const formSchema = z.object({
    nome: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Email inválido"),
    uso: z.enum(["academico", "profissional", "pessoal"], {
        errorMap: () => ({ message: "Selecione um uso válido" })
    }),
    descricao: z.string().min(1, "Este campo é obrigatório"),
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
            uso: "academico",
            descricao: "",
        }
    });

    const usoSelecionado = form.watch("uso");

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
        <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background via-background/95 to-background/90 text-foreground p-4 md:p-8 relative overflow-hidden"
        >
            {/* Glowing background shapes */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-6 items-stretch relative">
                
                {/* CARD ESQUERDO: Informações e Dicas */}
                <Card className="flex-1 border-primary/10 bg-card/30 backdrop-blur-md shadow-xl flex flex-col justify-center">
                    <CardContent className="p-8 flex flex-col h-full justify-center">
                        
                        <div className="flex items-center gap-3 mb-8">
                            <img src="/img/logo.jpg" alt="Logo" className="h-10 w-10 object-contain rounded-lg border border-primary/20" />
                            <span className="text-xl font-bold bg-gradient-to-r from-primary via-blue-400 to-cyan-300 bg-clip-text text-transparent">API OI Atuarial</span>
                        </div>

                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            Acesso à API
                        </h2>
                        <p className="text-muted-foreground mb-8 leading-relaxed text-justify">
                            Preencha o formulário ao lado para solicitar seu token de acesso à nossa API de alta precisão atuarial e demográfica.
                        </p>

                        {/* Passo a passo */}
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start hover:translate-x-1 transition-transform duration-300">
                                <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 flex-shrink-0 text-primary">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">1. Confirmação por Email</h4>
                                    <p className="text-sm text-muted-foreground mt-1">O token será enviado para a sua caixa de entrada (verifique a pasta de spam).</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 items-start hover:translate-x-1 transition-transform duration-300">
                                <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 flex-shrink-0 text-primary">
                                    <Key className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">2. Autenticação Segura</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Insira o token recebido no cabeçalho das requisições para acessar os dados.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start hover:translate-x-1 transition-transform duration-300">
                                <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 flex-shrink-0 text-primary">
                                    <Code className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">3. Integração Simples</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Consulte as <a href="/usar-api" className="text-primary font-semibold hover:underline">Instruções de Uso</a> para ver a documentação técnica completa.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CARD DIREITO: Formulário de Cadastro */}
                <Card className="flex-1 border-primary/10 bg-card/30 backdrop-blur-md shadow-xl">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-2xl font-bold text-foreground">Cadastrar Usuário</CardTitle>
                        <CardDescription className="text-muted-foreground">
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
                                            <FormLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Nome Completo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Seu nome" {...field} className="bg-background/50 border border-primary/10 focus-visible:ring-primary focus-visible:border-primary/40 focus:outline-none transition-all duration-300" />
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
                                            <FormLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="exemplo@email.com" {...field} className="bg-background/50 border border-primary/10 focus-visible:ring-primary focus-visible:border-primary/40 focus:outline-none transition-all duration-300" />
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
                                            <FormLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Finalidade de Uso</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-background/50 border border-primary/10 focus:ring-primary focus:border-primary/40 focus:outline-none transition-all duration-300">
                                                        <SelectValue placeholder="Selecione uma opção" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-background/95 backdrop-blur-md border border-primary/10">
                                                    <SelectItem value="academico">Acadêmico</SelectItem>
                                                    <SelectItem value="profissional">Profissional</SelectItem>
                                                    <SelectItem value="pessoal">Pessoal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="descricao"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                                                {usoSelecionado === "pessoal" ? "Descrição" : "Instituição/Empresa"}
                                            </FormLabel>
                                            
                                            <FormControl>
                                                <Input 
                                                    placeholder={usoSelecionado === "pessoal" ? "Descreva brevemente o uso..." : "Nome da Instituição ou Empresa"} 
                                                    {...field} 
                                                    className="bg-background/50 border border-primary/10 focus-visible:ring-primary focus-visible:border-primary/40 focus:outline-none transition-all duration-300" 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {message && (
                                    <Alert variant={message.type === 'error' ? "destructive" : "default"} className={`mt-4 backdrop-blur-md shadow-md ${message.type === 'success' ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-red-500/20 bg-red-500/10 text-red-300"}`}>
                                        {message.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4 text-red-400" />}
                                        <AlertTitle className="font-semibold">{message.type === 'success' ? "Sucesso!" : "Erro!"}</AlertTitle>
                                        <AlertDescription className="text-sm">
                                            {message.text}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <Button 
                                    type="submit" 
                                    className="w-full mt-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-blue-700 text-white font-medium shadow-lg shadow-primary/25 hover:shadow-primary/30 transition-all duration-300 transform active:scale-[0.98]" 
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Processando..." : "Gerar Token de Acesso"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

            </div>
        </motion.main>
    );
};

export default CriarUsuario;