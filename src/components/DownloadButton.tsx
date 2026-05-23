import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Database, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export type ExportFormat = "csv" | "xlsx" | "parquet";

interface DownloadButtonProps<T> {
  dados: T[];
  filename?: string;
  onDownloadComplete?: () => void;
  disabled?: boolean;

  // Listas de dimensões opcionais para tradução
  locais?: Array<{ id_local: number; nome_local: string }>;
  faixas?: Array<{ id_faixa: number; descricao: string }>;
  sexos?: Array<{ id_sexo: number; descricao: string }>;
  modelos?: Array<{ id_modelo: number; descricao: string }>;

  // Filtro de colunas para exportar exatamente o que está no frontend
  colunas?: string[];
  columns?: string[];
}

// Função para sanitizar o nome de arquivo
function sanitizeFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9_.-]/g, "_")  // Substitui caracteres especiais por _
    .replace(/__+/g, "_")            // Remove múltiplos underscores
    .replace(/^_+|_+$/g, "");        // Limpa underscores no início/fim
}

// Função para converter dados para CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) return "";
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escapa valores que contêm vírgulas ou aspas
        if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? "";
      }).join(",")
    )
  ];
  
  return csvRows.join("\n");
}

// Função para baixar arquivo
function downloadFile(content: string | Blob, filename: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Função para converter para XLSX (usando biblioteca xlsx com import dinâmico)
async function convertToXLSX(data: any[]): Promise<Blob> {
  try {
    const XLSX = await import("xlsx");
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
    
    const xlsxBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    return new Blob([xlsxBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  } catch (err) {
    console.warn("Biblioteca xlsx não encontrada. Usando fallback CSV.", err);
    const csv = convertToCSV(data);
    return new Blob([csv], { type: "text/csv" });
  }
}

// Função para converter para Parquet (mock estruturado JSON com metadados)
async function convertToParquet(data: any[]): Promise<Blob> {
  const firstRow = data[0] as object;
  const parquetLike = {
    schema: data.length > 0 ? Object.keys(firstRow).map(key => ({
      name: key,
      type: typeof (firstRow as Record<string, unknown>)[key]
    })) : [],
    data: data,
    metadata: {
      rowCount: data.length,
      createdAt: new Date().toISOString(),
      format: "parquet-json"
    }
  };
  
  return new Blob([JSON.stringify(parquetLike, null, 2)], { type: "application/json" });
}

export function DownloadButton<T extends object>({
  dados,
  filename = "dados_mortalidade",
  onDownloadComplete,
  disabled = false,
  locais,
  faixas,
  sexos,
  modelos,
  colunas,
  columns,
}: DownloadButtonProps<T>) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<string | null>(null);

  // Mapeia e higieniza os dados em tempo de execução para a exportação
  const transformDataForExport = (data: T[]): any[] => {
    const columnsToExport = colunas || columns;

    return data.map((row: any) => {
      const newRow: any = {};

      if (columnsToExport && columnsToExport.length > 0) {
        // Constrói a linha na ordem exata especificada em columnsToExport
        columnsToExport.forEach((col: string) => {
          const colLower = col.toLowerCase();

          if (colLower === "ano") {
            newRow[col] = row.ano !== undefined ? row.ano : row.Ano;
          } else if (colLower === "local" || colLower === "localidade") {
            if ("id_local" in row && locais) {
              const matched = locais.find(l => l.id_local === Number(row.id_local));
              newRow[col] = matched ? matched.nome_local : row.id_local;
            } else if ("local" in row) {
              newRow[col] = row.local;
            } else if ("nome_local" in row) {
              newRow[col] = row.nome_local;
            }
          } else if (colLower === "sexo") {
            if ("id_sexo" in row && sexos) {
              const matched = sexos.find(s => s.id_sexo === Number(row.id_sexo));
              newRow[col] = matched ? matched.descricao : row.id_sexo;
            } else if ("sexo" in row) {
              newRow[col] = row.sexo;
            }
          } else if (colLower === "faixa" || colLower === "faixa etária" || colLower === "faixa_etaria") {
            if ("id_faixa" in row && faixas) {
              const matched = faixas.find(f => f.id_faixa === Number(row.id_faixa));
              newRow[col] = matched ? matched.descricao : row.id_faixa;
            } else if ("faixa" in row) {
              newRow[col] = row.faixa;
            } else if ("descricao_faixa" in row) {
              newRow[col] = row.descricao_faixa;
            }
          } else if (colLower === "modelo" || colLower === "modelo_projecao" || colLower === "modelo preditivo") {
            if ("id_modelo" in row && modelos) {
              const matched = modelos.find(m => m.id_modelo === Number(row.id_modelo));
              newRow[col] = matched ? matched.descricao : row.id_modelo;
            } else if ("modelo" in row) {
              newRow[col] = row.modelo;
            }
          } else {
            // Outros campos técnicos (e.g. nMx, ex, Taxa, cod_IBGE, codigo_DataSUS, etc.)
            // Busca a chave com correspondência insensível a maiúsculas/minúsculas
            const actualKey = Object.keys(row).find(k => k.toLowerCase() === colLower) || col;
            if (row[actualKey] !== undefined) {
              newRow[col] = row[actualKey];
            }
          }
        });
      } else {
        // Fallback para o comportamento padrão anterior (se nenhuma coluna for especificada)
        // 1. Ano (Primeira coluna se existir)
        if ("ano" in row) {
          newRow["ano"] = row.ano;
        } else if ("Ano" in row) {
          newRow["ano"] = row.Ano;
        }

        // 2. Local (Substitui ID numérico por texto)
        if ("id_local" in row && locais) {
          const matched = locais.find(l => l.id_local === Number(row.id_local));
          newRow["local"] = matched ? matched.nome_local : row.id_local;
        } else if ("local" in row) {
          newRow["local"] = row.local;
        }

        // 3. Sexo (Substitui ID numérico por texto)
        if ("id_sexo" in row && sexos) {
          const matched = sexos.find(s => s.id_sexo === Number(row.id_sexo));
          newRow["sexo"] = matched ? matched.descricao : row.id_sexo;
        } else if ("sexo" in row) {
          newRow["sexo"] = row.sexo;
        }

        // 4. Faixa Etária (Substitui ID numérico por texto)
        if ("id_faixa" in row && faixas) {
          const matched = faixas.find(f => f.id_faixa === Number(row.id_faixa));
          newRow["faixa"] = matched ? matched.descricao : row.id_faixa;
        } else if ("faixa" in row) {
          newRow["faixa"] = row.faixa;
        }

        // 5. Modelo de Projeção (Substitui ID numérico por texto)
        if ("id_modelo" in row && modelos) {
          const matched = modelos.find(m => m.id_modelo === Number(row.id_modelo));
          newRow["modelo"] = matched ? matched.descricao : row.id_modelo;
        } else if ("modelo" in row) {
          newRow["modelo"] = row.modelo;
        }

        // 6. Copia as demais chaves mantendo a nomenclatura técnica e removendo IDs numéricos brutos
        Object.keys(row).forEach(key => {
          const normalizedKey = key.toLowerCase();
          if (
            key !== "id" &&
            normalizedKey !== "id_local" &&
            normalizedKey !== "id_sexo" &&
            normalizedKey !== "id_faixa" &&
            normalizedKey !== "id_modelo" &&
            normalizedKey !== "local" &&
            normalizedKey !== "sexo" &&
            normalizedKey !== "faixa" &&
            normalizedKey !== "modelo" &&
            normalizedKey !== "ano"
          ) {
            newRow[key] = row[key];
          }
        });
      }

      return newRow;
    });
  };

  const handleDownload = async (format: ExportFormat) => {
    setIsDownloading(true);
    setDownloadType(format);

    try {
      if (dados.length === 0) {
        alert("Não há dados para exportar");
        return;
      }

      // Transforma os dados para remover IDs e colocar descrições por extenso
      const dataToExport = transformDataForExport(dados);
      
      const timestamp = new Date().toISOString().split("T")[0];
      const cleanName = sanitizeFilename(filename);
      const fullFilename = `${cleanName}_${timestamp}`;

      switch (format) {
        case "csv": {
          const csv = convertToCSV(dataToExport);
          downloadFile(csv, `${fullFilename}.csv`, "text/csv;charset=utf-8;");
          break;
        }
        case "xlsx": {
          const xlsxBlob = await convertToXLSX(dataToExport);
          downloadFile(xlsxBlob, `${fullFilename}.xlsx`, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
          break;
        }
        case "parquet": {
          const parquetBlob = await convertToParquet(dataToExport);
          downloadFile(parquetBlob, `${fullFilename}.parquet.json`, "application/json");
          break;
        }
      }

      onDownloadComplete?.();
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      alert("Erro ao exportar dados. Tente novamente.");
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  const formatIcons = {
    csv: <FileText className="h-4 w-4" />,
    xlsx: <FileSpreadsheet className="h-4 w-4" />,
    parquet: <Database className="h-4 w-4" />,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          disabled={disabled || isDownloading || dados.length === 0}
          className="gap-2 border-primary/20 hover:border-primary/50 bg-background/50 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-primary/5"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Download className="h-4 w-4 text-primary" />
          )}
          {isDownloading ? "Exportando..." : "Baixar"}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md border-primary/10 shadow-xl">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
          Exportar Filtrados ({dados.length})
        </DropdownMenuLabel>
        
        <DropdownMenuItem 
          onClick={() => handleDownload("csv")}
          disabled={isDownloading}
          className="gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors py-2 px-3"
        >
          {downloadType === "csv" ? <Loader2 className="h-4 w-4 animate-spin" /> : formatIcons.csv}
          <span>Exportar CSV</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleDownload("xlsx")}
          disabled={isDownloading}
          className="gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors py-2 px-3"
        >
          {downloadType === "xlsx" ? <Loader2 className="h-4 w-4 animate-spin" /> : formatIcons.xlsx}
          <span>Exportar Excel (.xlsx)</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleDownload("parquet")}
          disabled={isDownloading}
          className="gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors py-2 px-3"
        >
          {downloadType === "parquet" ? <Loader2 className="h-4 w-4 animate-spin" /> : formatIcons.parquet}
          <span>Exportar Parquet</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DownloadButton;
