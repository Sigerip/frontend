import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { TabuaMortalidade } from "@/lib/services";

export interface FaixaEtaria {
  id_faixa: number;
  descricao: string;
}

export interface Sexo {
  id_sexo: number;
  descricao: string;
}

export interface LocalDim {
  id_local: number;
  nome_local: string;
}

export interface ModeloDim {
  id_modelo: number;
  descricao: string;
}

interface ExpectativaRechartsChartProps {
  dados: TabuaMortalidade[];
  faixas: FaixaEtaria[];
  sexos: Sexo[];
  locais: LocalDim[];
  modelos?: ModeloDim[];
}

const GLOW_COLORS = [
  "#06b6d4", // Ciano
  "#8b5cf6", // Violeta
  "#10b981", // Esmeralda
  "#f43f5e", // Rose
  "#f59e0b", // Âmbar
  "#d946ef", // Fúcsia
  "#0ea5e9", // Sky
  "#eab308", // Yellow
];

export default function ExpectativaRechartsChart({
  dados = [],
  faixas = [],
  sexos = [],
  locais = [],
  modelos = [],
}: ExpectativaRechartsChartProps) {
  // Cria o pivô dos dados: anos nas linhas, séries comparativas nas colunas
  const pivotData = useMemo(() => {
    if (dados.length === 0) return [];

    const map = new Map<number, any>();
    const todosAnos = [...new Set(dados.map((d) => d.ano))].sort((a, b) => a - b);

    todosAnos.forEach((ano) => {
      map.set(ano, {
        ano,
      });
    });

    dados.forEach((d) => {
      if (d.ex == null || d.ex <= 0) return;
      const localName = locais.find((l) => l.id_local === d.id_local)?.nome_local || String(d.id_local);
      const faixaDesc = faixas.find((f) => f.id_faixa === d.id_faixa)?.descricao || String(d.id_faixa);
      const sexoName = sexos.find((s) => s.id_sexo === d.id_sexo)?.descricao || String(d.id_sexo);
      const modelName = d.id_modelo
        ? modelos.find((m) => m.id_modelo === d.id_modelo)?.descricao || ""
        : "";

      const key = [localName, faixaDesc, modelName, sexoName].filter(Boolean).join(" · ");

      const row = map.get(d.ano);
      if (row) {
        row[key] = parseFloat(d.ex.toFixed(2));
      }
    });

    return Array.from(map.values()).filter((row) => Object.keys(row).length > 1);
  }, [dados, faixas, sexos, locais, modelos]);

  // Coleta as chaves únicas das séries ativas
  const seriesKeys = useMemo(() => {
    const keys = new Set<string>();
    dados.forEach((d) => {
      if (d.ex == null || d.ex <= 0) return;
      const localName = locais.find((l) => l.id_local === d.id_local)?.nome_local || String(d.id_local);
      const faixaDesc = faixas.find((f) => f.id_faixa === d.id_faixa)?.descricao || String(d.id_faixa);
      const sexoName = sexos.find((s) => s.id_sexo === d.id_sexo)?.descricao || String(d.id_sexo);
      const modelName = d.id_modelo
        ? modelos.find((m) => m.id_modelo === d.id_modelo)?.descricao || ""
        : "";

      const key = [localName, faixaDesc, modelName, sexoName].filter(Boolean).join(" · ");
      keys.add(key);
    });
    return Array.from(keys).sort();
  }, [dados, locais, faixas, sexos, modelos]);

  if (dados.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-primary/20 bg-muted/5">
        <p className="text-sm text-muted-foreground">Ajuste os filtros acima para plotar dados no gráfico.</p>
      </div>
    );
  }

  return (
    <div className="h-[460px] w-full bg-background/10 rounded-xl p-2 border border-primary/5">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={pivotData} margin={{ top: 20, right: 20, left: 25, bottom: 35 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="ano"
            stroke="#71717a"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={10}
            label={{
              value: "Ano de Referência",
              position: "insideBottom",
              offset: -10,
              style: { fill: "#71717a", fontSize: 11, fontWeight: 500 },
            }}
          />
          <YAxis
            stroke="#71717a"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dx={-5}
            domain={["auto", "auto"]}
            label={{
              value: "Expectativa de Vida (anos)",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#71717a", fontSize: 11, fontWeight: 500 },
              dx: -10,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(10, 18, 36, 0.95)",
              borderColor: "rgba(59, 130, 246, 0.2)",
              borderRadius: "12px",
              color: "#fff",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(8px)",
              fontSize: "12px",
            }}
            labelStyle={{ fontWeight: "bold", color: "#93c5fd", marginBottom: "4px" }}
          />
          <Legend
            verticalAlign="top"
            height={48}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs text-muted-foreground font-medium hover:text-foreground transition-colors cursor-pointer">
                {value}
              </span>
            )}
          />
          {seriesKeys.map((key, idx) => {
            const color = GLOW_COLORS[idx % GLOW_COLORS.length];
            return (
              <Line
                key={key}
                type="linear"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 2, fill: color, strokeWidth: 0 }}
                activeDot={{ r: 5, stroke: "#fff", strokeWidth: 1.5 }}
                connectNulls
                animationDuration={600}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
