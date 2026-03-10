import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { TabuaMortalidade } from "@/lib/services";

// Interfaces para as tabelas dimensão
export interface FaixaEtaria {
  id_faixa: number;
  descricao: string;
}

export interface Sexo {
  id_sexo: number;
  descricao: string;
}

interface ExpectativaVidaChartProps {
  dados: TabuaMortalidade[];
  faixas?: FaixaEtaria[];
  sexos?: Sexo[];
}

// Cores para cada sexo
const CORES_SEXO: Record<string, string> = {
  Masculino: "#3b82f6",    // Azul
  Feminino: "#ec4899",     // Rosa
  Ambos: "#10b981",        // Verde
  "1": "#3b82f6",
  "2": "#ec4899",
  "3": "#10b981"
};

const ExpectativaVidaChart = ({
  dados,
  faixas = [],
  sexos = []
}: ExpectativaVidaChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });

  // --- Funções Auxiliares Seguras ---
  const getFaixaName = (id: number) => {
    if (!faixas || faixas.length === 0) return String(id);
    const faixa = faixas.find((f) => f.id_faixa === id);
    return faixa ? faixa.descricao : String(id);
  };

  const getSexoName = (id: number) => {
    if (!sexos || sexos.length === 0) return String(id);
    const sexo = sexos.find((s) => s.id_sexo === id);
    return sexo ? sexo.descricao : String(id);
  };

  // Hook para detectar redimensionamento
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const isMobile = containerWidth < 640;
        const newHeight = isMobile
          ? Math.min(400, containerWidth * 0.8)
          : Math.min(500, Math.max(350, containerWidth * 0.5));

        setDimensions({
          width: containerWidth,
          height: newHeight
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Hook principal do D3
  useEffect(() => {
    if (!svgRef.current || !dados || dados.length === 0) return;

    const { width, height } = dimensions;
    const isMobile = width < 640;

    // Limpa o SVG anterior
    d3.select(svgRef.current).selectAll("*").remove();

    // Configurações de margem responsivas
    const margin = {
      top: isMobile ? 30 : 40,
      right: isMobile ? 20 : 130,
      bottom: isMobile ? 100 : 80,
      left: isMobile ? 50 : 70
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Filtra dados com ex válido
    const dadosValidos = dados.filter((d) => d.ex != null && d.ex > 0);

    if (dadosValidos.length === 0) return;

    // Agrupa dados por sexo (ID)
    const dadosPorSexo = d3.group(dadosValidos, (d) => d.id_sexo);

    // Obtém lista única de anos ordenados
    const todosAnos = [...new Set(dadosValidos.map((d) => d.ano))]
      .sort((a, b) => a - b);

    // Obtém os IDs dos sexos disponíveis
    const sexosDisponiveisIds = Array.from(dadosPorSexo.keys()).sort();

    // Cria o SVG responsivo
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Grupo principal com margens
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Escala X - Anos
    const xScale = d3
      .scaleBand()
      .domain(todosAnos.map(String))
      .range([0, innerWidth])
      .padding(0.1);

    // Escala Y - Expectativa de vida (ex)
    const yExtent = d3.extent(dadosValidos, (d) => d.ex) as [number, number];
    const yPadding = (yExtent[1] - yExtent[0]) * 0.1 || 5;
    const yScale = d3
      .scaleLinear()
      .domain([Math.max(0, yExtent[0] - yPadding), yExtent[1] + yPadding])
      .range([innerHeight, 0])
      .nice();

    // Grid horizontal
    g.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(yScale.ticks(8))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#e5e7eb")
      .attr("stroke-dasharray", "3,3");

    // --- EIXO X ---
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    xAxis
      .selectAll("text")
      .attr("transform", isMobile ? "rotate(-65)" : "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "0.5em")
      .style("font-size", isMobile ? "9px" : "11px");

    // Label do eixo X
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + (isMobile ? 85 : 65))
      .attr("text-anchor", "middle")
      .style("font-size", isMobile ? "11px" : "13px")
      .style("font-weight", "500")
      .text("Ano");

    // Eixo Y
    g.append("g")
      .call(
        d3.axisLeft(yScale)
          .ticks(isMobile ? 5 : 8)
          .tickFormat((d) => (d as number).toFixed(1))
      )
      .selectAll("text")
      .style("font-size", isMobile ? "9px" : "11px");

    // Label do eixo Y
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", isMobile ? -35 : -50)
      .attr("text-anchor", "middle")
      .style("font-size", isMobile ? "11px" : "13px")
      .style("font-weight", "500")
      .text("Expectativa de Vida (anos)");

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Função geradora de linha
    const lineGenerator = d3
      .line<TabuaMortalidade>()
      .x((d) => (xScale(String(d.ano)) ?? 0) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.ex));

    // Desenha as linhas
    sexosDisponiveisIds.forEach((sexoId, index) => {
      const dadosSexo = (dadosPorSexo.get(sexoId) || [])
        .sort((a, b) => a.ano - b.ano);

      if (dadosSexo.length === 0) return;

      const nomeSexo = getSexoName(sexoId);
      const cor = CORES_SEXO[nomeSexo] || CORES_SEXO[String(sexoId)] || "#6366f1";

      // Linha
      const path = g.append("path")
        .datum(dadosSexo)
        .attr("fill", "none")
        .attr("stroke", cor)
        .attr("stroke-width", 2.5)
        .attr("d", lineGenerator);

      // Animação
      const totalLength = path.node()?.getTotalLength() || 0;
      path
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .delay(index * 300)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      // Pontos interativos
      g.selectAll(`.dot-${sexoId}`)
        .data(dadosSexo)
        .enter()
        .append("circle")
        .attr("class", `dot-${sexoId}`)
        .attr("cx", (d) => (xScale(String(d.ano)) ?? 0) + xScale.bandwidth() / 2)
        .attr("cy", (d) => yScale(d.ex))
        .attr("r", 4)
        .attr("fill", cor)
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .style("opacity", 0)
        .transition()
        .delay(1000 + index * 300)
        .duration(300)
        .style("opacity", 1);

      // Tooltip nos pontos
      g.selectAll(`.dot-${sexoId}`)
        .on("mouseover", function (event: MouseEvent, d: unknown) {
          const data = d as TabuaMortalidade;
          d3.select(this as Element)
            .transition()
            .duration(150)
            .attr("r", 6);

          tooltip
            .style("opacity", "1")
            .html(
              `<div style="font-weight:600;margin-bottom:4px">${nomeSexo}</div>
               <div><strong>Ano:</strong> ${data.ano}</div>
               <div><strong>Expectativa:</strong> ${data.ex?.toFixed(2)} anos</div>`
            )
            .style("left", `${event.pageX + 12}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mousemove", function (event: MouseEvent) {
          tooltip
            .style("left", `${event.pageX + 12}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", function () {
          d3.select(this as Element)
            .transition()
            .duration(150)
            .attr("r", 4);

          tooltip.style("opacity", "0");
        });
    });

    // --- LEGENDA ---
    const legenda = svg
      .append("g")
      .attr("transform", isMobile
        ? `translate(${margin.left}, ${height - 15})`
        : `translate(${width - margin.right + 10}, ${margin.top + 20})`
      );

    if (!isMobile) {
      legenda
        .append("text")
        .attr("x", 0)
        .attr("y", -5)
        .style("font-size", "12px")
        .style("font-weight", "600")
        .text("Sexo");
    }

    sexosDisponiveisIds.forEach((sexoId, index) => {
      const nomeSexo = getSexoName(sexoId);
      const cor = CORES_SEXO[nomeSexo] || CORES_SEXO[String(sexoId)] || "#6366f1";

      const xPos = isMobile ? index * 90 : 0;
      const yPos = isMobile ? 0 : index * 25 + 15;

      legenda
        .append("line")
        .attr("x1", xPos)
        .attr("x2", xPos + 20)
        .attr("y1", yPos)
        .attr("y2", yPos)
        .attr("stroke", cor)
        .attr("stroke-width", 2.5);

      legenda
        .append("circle")
        .attr("cx", xPos + 10)
        .attr("cy", yPos)
        .attr("r", 3)
        .attr("fill", cor)
        .attr("stroke", "white")
        .attr("stroke-width", 0.5);

      legenda
        .append("text")
        .attr("x", xPos + 26)
        .attr("y", yPos + 4)
        .style("font-size", isMobile ? "10px" : "12px")
        .text(nomeSexo);
    });

  }, [dados, dimensions, faixas, sexos]);

  if (!dados || dados.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg w-full">
        <p className="text-muted-foreground">Nenhum dado disponível para visualização</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        ref={svgRef}
        className="w-full h-auto"
        style={{ minHeight: '300px', maxHeight: '600px' }}
      />
      <div
        ref={tooltipRef}
        className="fixed z-50 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-lg pointer-events-none opacity-0 transition-opacity duration-150"
        style={{ maxWidth: "220px" }}
      />
    </div>
  );
};

export default ExpectativaVidaChart;
