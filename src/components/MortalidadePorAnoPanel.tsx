import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, MapPin, Sparkles, Users } from "lucide-react";
import type { DimFaixa, DimLocal, DimSexo } from "@/lib/services";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export interface MortalidadePorAnoPanelProps {
  locais: DimLocal[];
  faixas: DimFaixa[];
  sexos: DimSexo[];
  selectedLocalIds: number[];
  onLocalIdsChange: (ids: number[]) => void;
  selectedFaixaIds: number[];
  onFaixaIdsChange: (ids: number[]) => void;
  selectedSexoIds: number[];
  onSexoIdsChange: (ids: number[]) => void;
  disabled?: boolean;
}

function toggleId(list: number[], id: number, minKeep: number): number[] {
  if (list.includes(id)) {
    if (list.length <= minKeep) return list;
    return list.filter((x) => x !== id);
  }
  return [...list, id].sort((a, b) => a - b);
}

export function MortalidadePorAnoPanel({
  locais,
  faixas,
  sexos,
  selectedLocalIds,
  onLocalIdsChange,
  selectedFaixaIds,
  onFaixaIdsChange,
  selectedSexoIds,
  onSexoIdsChange,
  disabled,
}: MortalidadePorAnoPanelProps) {
  const [localOpen, setLocalOpen] = useState(false);
  const [faixaOpen, setFaixaOpen] = useState(false);

  const linhasCombinadas =
    selectedLocalIds.length * selectedFaixaIds.length * selectedSexoIds.length;

  const localResumo = useMemo(() => {
    if (selectedLocalIds.length === 0) return "Nenhum território";
    if (selectedLocalIds.length === locais.length) return "Todos os territórios";
    if (selectedLocalIds.length <= 2) {
      return selectedLocalIds
        .map((id) => locais.find((l) => l.id_local === id)?.nome_local ?? String(id))
        .join(" · ");
    }
    return `${selectedLocalIds.length} territórios selecionados`;
  }, [selectedLocalIds, locais]);

  const faixaResumo = useMemo(() => {
    if (selectedFaixaIds.length === 0) return "Nenhuma faixa";
    if (selectedFaixaIds.length === faixas.length) return "Todas as faixas";
    if (selectedFaixaIds.length <= 2) {
      return selectedFaixaIds
        .map((id) => faixas.find((f) => f.id_faixa === id)?.descricao ?? String(id))
        .join(" · ");
    }
    return `${selectedFaixaIds.length} faixas selecionadas`;
  }, [selectedFaixaIds, faixas]);

  const toggleLocal = (id: number) => {
    onLocalIdsChange(toggleId(selectedLocalIds, id, 1));
  };

  const toggleFaixa = (id: number) => {
    onFaixaIdsChange(toggleId(selectedFaixaIds, id, 1));
  };

  const toggleSexo = (id: number) => {
    onSexoIdsChange(toggleId(selectedSexoIds, id, 1));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-muted/20 shadow-sm">
      <div className="pointer-events-none absolute inset-0" />
      <div className="relative space-y-5 p-4 sm:p-6">

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Territórios
              </Label>
              <span className="text-[0.65rem] tabular-nums text-muted-foreground">
                {selectedLocalIds.length}/{locais.length}
              </span>
            </div>
            <Popover open={localOpen} onOpenChange={setLocalOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled || locais.length === 0}
                  className="h-11 w-full justify-between rounded-xl border-border/80 bg-background/80 px-3 font-normal shadow-none transition-[box-shadow,border-color] hover:border-primary/25"
                >
                  <span className="truncate text-left text-sm">{localResumo}</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[min(calc(100vw-2rem),22rem)] p-0 sm:w-[var(--radix-popover-trigger-width)]"
                align="start"
                sideOffset={6}
              >
                <Command className="rounded-xl">
                  <CommandInput placeholder="Buscar território…" className="h-10" />
                  <CommandList className="max-h-[min(50vh,280px)]">
                    <CommandEmpty className="py-6 text-xs">Nenhum território encontrado.</CommandEmpty>
                    <CommandGroup className="p-1">
                      {locais.map((l) => {
                        const on = selectedLocalIds.includes(l.id_local);
                        return (
                          <CommandItem
                            key={l.id_local}
                            value={`${l.id_local} ${l.nome_local}`}
                            onSelect={() => toggleLocal(l.id_local)}
                            className="cursor-pointer rounded-lg aria-selected:bg-transparent"
                          >
                            <span
                              className={cn(
                                "mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                                on ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/25",
                              )}
                            >
                              {on && <Check className="h-3 w-3" strokeWidth={3} />}
                            </span>
                            <span className="truncate text-sm">{l.nome_local}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                  <div className="flex gap-1 border-t border-border/60 p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 flex-1 rounded-lg text-xs"
                      onClick={() => onLocalIdsChange(locais.map((x) => x.id_local))}
                    >
                      Todos
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 flex-1 rounded-lg text-xs"
                      onClick={() => locais[0] && onLocalIdsChange([locais[0].id_local])}
                    >
                      Só o 1º
                    </Button>
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-xs font-medium text-muted-foreground">Faixas etárias</Label>
              <span className="text-[0.65rem] tabular-nums text-muted-foreground">
                {selectedFaixaIds.length}/{faixas.length}
              </span>
            </div>
            <Popover open={faixaOpen} onOpenChange={setFaixaOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled || faixas.length === 0}
                  className="h-11 w-full justify-between rounded-xl border-border/80 bg-background/80 px-3 font-normal shadow-none transition-[box-shadow,border-color] hover:border-primary/25"
                >
                  <span className="truncate text-left text-sm">{faixaResumo}</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[min(calc(100vw-2rem),22rem)] p-0 sm:w-[var(--radix-popover-trigger-width)]"
                align="start"
                sideOffset={6}
              >
                <Command className="rounded-xl">
                  <CommandInput placeholder="Buscar faixa…" className="h-10" />
                  <CommandList className="max-h-[min(50vh,280px)]">
                    <CommandEmpty className="py-6 text-xs">Nenhuma faixa encontrada.</CommandEmpty>
                    <CommandGroup className="p-1">
                      {faixas.map((f) => {
                        const on = selectedFaixaIds.includes(f.id_faixa);
                        return (
                          <CommandItem
                            key={f.id_faixa}
                            value={`${f.id_faixa} ${f.descricao}`}
                            onSelect={() => toggleFaixa(f.id_faixa)}
                            className="cursor-pointer rounded-lg aria-selected:bg-transparent"
                          >
                            <span
                              className={cn(
                                "mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                                on ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/25",
                              )}
                            >
                              {on && <Check className="h-3 w-3" strokeWidth={3} />}
                            </span>
                            <span className="truncate text-sm">{f.descricao}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                  <div className="flex gap-1 border-t border-border/60 p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 flex-1 rounded-lg text-xs"
                      onClick={() => onFaixaIdsChange(faixas.map((x) => x.id_faixa))}
                    >
                      Todas
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 flex-1 rounded-lg text-xs"
                      onClick={() => faixas[0] && onFaixaIdsChange([faixas[0].id_faixa])}
                    >
                      Só a 1ª
                    </Button>
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Users className="h-3.5 w-3.5" aria-hidden />
              Sexo
            </Label>
            <div className="flex flex-wrap gap-2">
              {sexos.map((s) => {
                const on = selectedSexoIds.includes(s.id_sexo);
                return (
                  <button
                    key={s.id_sexo}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleSexo(s.id_sexo)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-all sm:text-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      on
                        ? "border-primary/40 bg-primary/10 text-foreground shadow-sm"
                        : "border-transparent bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors",
                        on ? "bg-primary" : "bg-muted-foreground/35",
                      )}
                    />
                    {s.descricao}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
