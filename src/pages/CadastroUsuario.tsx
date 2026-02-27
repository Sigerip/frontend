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

// Importações novas para o Alerta visual
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react"; // Ícones padrão do lucide-react (vem com shadcn)

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
    
    // Mudamos o estado para facilitar a lógica visual
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
        setMessage(null); // Limpa mensagem anterior

        try {
            const response = await fetch("http://127.0.0.1:8001/cadastro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            });

            const data = await response.json();

            if (response.ok) {
                // Sucesso: Define mensagem verde
                //setMessage({ text: "Usuário cadastrado com sucesso! Redirecionando...", type: 'success' });
                setMessage({ text: data.mensagem, type: 'success' });
                
                setTimeout(() => {
                    navigate("/metodologia"); 
                }, 2000);
                
                form.reset();
            } else {
                // Erro: Define mensagem vermelha
                setMessage({ text: data.mensagem || "Erro ao cadastrar.", type: 'error' });
            }
        } catch (error) {
            setMessage({ text: "Erro de conexão com o servidor.", type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Cadastrar Usuário</CardTitle>
                    <CardDescription>
                        Preencha os dados abaixo para acessar a API.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            
                            {/* Seus campos (Nome, Email, Uso) continuam aqui igual antes... */}
                            <FormField
                                control={form.control}
                                name="nome"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome Completo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome" {...field} />
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
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="exemplo@email.com" {...field} />
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
                                        <FormLabel>Finalidade de Uso</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
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

                            {/* MENSAGEM DE ALERTA AQUI */}
                            {message && (
                                <Alert variant={message.type === 'error' ? "destructive" : "default"} className={message.type === 'success' ? "border-green-500 bg-green-50 text-green-900" : ""}>
                                    {message.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4" />}
                                    <AlertTitle>{message.type === 'success' ? "Sucesso!" : "Erro!"}</AlertTitle>
                                    <AlertDescription>
                                        {message.text}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                                {isLoading ? "Cadastrando..." : "Cadastrar"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
};

export default CriarUsuario;