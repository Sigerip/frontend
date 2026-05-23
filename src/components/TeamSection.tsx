import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Linkedin, Mail, ChevronRight, GraduationCap, Briefcase, Award } from "lucide-react";

// Array com os dados da equipe
const teamMembers = [
  {
    name: "Prof. Dr. Filipe C. L. Duarte",
    role: "Coordenador Geral",
    subrole: "Modelagem Atuarial",
    category: "coordination",
    linkedin: "https://www.linkedin.com/in/filipeclduarte/",
    email: "filipe_pb_duarte@hotmail.com"
  },
  {
    name: "Prof. Dr. Gustavo C. Xavier",
    role: "Coordenador Adjunto",
    subrole: "Desenvolvimento de Sistemas",
    category: "coordination",
    linkedin: "https://www.linkedin.com/in/gcxavier/",
    email: "gustavocorreiaxavier@gmail.com"
  },
  {
    name: "Prof. Me. Yuri M. S. Santos",
    role: "Pesquisador Colaborador",
    subrole: "Validação de Modelos",
    category: "collaboration",
    linkedin: "",
    email: ""
  },
  {
    name: "Hugo V. S. F. Gomes",
    role: "Pesquisador Colaborador",
    subrole: "Mortalidade Infantil",
    category: "collaboration",
    linkedin: "https://www.linkedin.com/in/hugo-gomes96/",
    email: ""
  },
  {
    name: "Cleo D. Anacleto",
    role: "Pesquisador Colaborador",
    subrole: "Modelagem Atuarial",
    category: "collaboration",
    linkedin: "https://www.linkedin.com/in/cleo-decker-anacleto-66a69b133/",
    email: "cleodecker@hotmail.com"
  },
  {
    name: "Isaias F. S. Sousa",
    role: "Desenvolvimento de Sistemas",
    subrole: "Desenvolvimento de Sistemas",
    category: "student",
    linkedin: "https://www.linkedin.com/in/isa%C3%ADas-felipe-silva-de-sousa-453902327/",
    email: "isaias.felipe@academico.ufpb.br"
  },
  {
    name: "Igor B. Kutelak",
    role: "Voluntário",
    subrole: "Modelagem Atuarial",
    category: "student",
    linkedin: "https://www.linkedin.com/in/igor-kutelak-20b10a194/",
    email: "Kutelak.igor@gmail.com"
  },
  {
    name: "Felipe L. Almeida",
    role: "Voluntário",
    subrole: "Mortalidade Infantil",
    category: "student",
    linkedin: "",
    email: ""
  },
  {
    name: "Kelvin R. C. H. Silva",
    role: "Voluntário",
    subrole: "Desenvolvimento de Sistemas",
    category: "student",
    linkedin: "",
    email: ""
  },
  {
    name: "Tatiane P. L. S. Alves",
    role: "Voluntária",
    subrole: "Validação de Modelos",
    category: "student",
    linkedin: "",
    email: ""
  }
];

// Função sofisticada para extrair iniciais de nomes científicos, removendo títulos acadêmicos
const getInitials = (name: string) => {
  const cleanName = name
    .replace(/(Prof\.|Dr\.|Me\.)/g, "") // Remove títulos acadêmicos comuns
    .trim();
  
  const parts = cleanName.split(/\s+/).filter(part => part.length > 0);
  if (parts.length === 0) return "OI";
  
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || "";
  return (first + last).toUpperCase();
};

export function TeamSection() {
  const [isTeamVisible, setIsTeamVisible] = useState(false);

  const toggleTeamVisibility = () => {
    setIsTeamVisible(!isTeamVisible);
  };

  // Agrupamento para maior organização e visual sofisticado (editorial/acadêmico)
  const coordinators = teamMembers.filter(m => m.category === 'coordination');
  const collaborators = teamMembers.filter(m => m.category === 'collaboration');
  const students = teamMembers.filter(m => m.category === 'student');

  return (
    <section className="py-24 bg-slate-50/30 dark:bg-slate-900/10 border-t border-slate-200/50 dark:border-slate-800/40">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header da Seção */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="inline-block rounded-full bg-blue-500/10 px-4 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Capital Humano
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Corpo Docente & Pesquisadores
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Uma equipe multidisciplinar de estatísticos, atuários e desenvolvedores dedicados à excelência em modelagem demográfica.
          </p>
        </div>
        
        {/* Botão de Toggle Estilizado e Discreto */}
        <div className="flex justify-center mb-6">
          <Button 
            onClick={toggleTeamVisibility} 
            variant="outline" 
            size="lg"
            className="rounded-full px-8 border-slate-200 hover:border-blue-500/30 dark:border-slate-800 dark:hover:border-blue-400/30 transition-all duration-300 font-medium text-slate-700 dark:text-slate-200"
          >
            {isTeamVisible ? 'Ocultar Estrutura de Equipe' : 'Visualizar Membros da Equipe'}
            <ChevronRight className={`h-4 w-4 ml-2 transition-transform duration-300 ${isTeamVisible ? 'rotate-90' : ''}`} />
          </Button>
        </div>

        {/* Container da equipe com transições suaves e design refinado */}
        <div 
          className={`
            transition-all duration-700 ease-in-out overflow-hidden
            ${isTeamVisible ? 'max-h-[3000px] opacity-100 mt-16' : 'max-h-0 opacity-0 pointer-events-none'}
          `}
        >
          <div className="space-y-16">
            
            {/* 1. SEÇÃO: COORDENAÇÃO CIENTÍFICA */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                  Coordenação Geral
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl">
                {coordinators.map((member, index) => (
                  <MemberCard key={index} member={member} isCoordinator={true} />
                ))}
              </div>
            </div>

            {/* 2. SEÇÃO: PESQUISADORES COLABORADORES */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <Briefcase className="h-5 w-5 text-indigo-500" />
                <h3 className="text-base font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                  Pesquisadores Colaboradores
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {collaborators.map((member, index) => (
                  <MemberCard key={index} member={member} />
                ))}
              </div>
            </div>

            {/* 3. SEÇÃO: CORPO TÉCNICO & BOLSISTAS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <GraduationCap className="h-5 w-5 text-emerald-500" />
                <h3 className="text-base font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                  Bolsistas & Corpo Técnico
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {students.map((member, index) => (
                  <MemberCard key={index} member={member} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// Subcomponente de Card de Membro Minimalista e Altamente Sofisticado
function MemberCard({ member, isCoordinator = false }: { member: any; isCoordinator?: boolean }) {
  const initials = getInitials(member.name);

  return (
    <Card className="flex items-center gap-4 p-4 border border-slate-200/80 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/60 transition-all duration-300">
      
      {/* Dynamic Initials Badge */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm tracking-wide transition-transform ${
        isCoordinator
          ? "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
      }`}>
        {initials}
      </div>

      {/* Text Details & Contacts */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {member.name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-normal">
            {member.role}
          </p>
          {member.subrole && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">
              {member.subrole}
            </p>
          )}
        </div>

        {/* Miniature Row of Links */}
        {(member.linkedin || member.email) && (
          <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            )}
            {member.email && (
              <a 
                href={`mailto:${member.email}`} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                title={member.email}
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

    </Card>
  );
}