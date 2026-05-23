import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface MultiSelectOption {
  value: string | number;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: (string | number)[];
  onChange: (values: any[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  maxBadges?: number;
}

export function MultiSelect({
  options = [],
  selectedValues = [],
  onChange,
  placeholder = "Selecionar...",
  emptyMessage = "Nenhum item encontrado.",
  className,
  maxBadges = 2,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string | number) => {
    const isSelected = selectedValues.includes(value);
    let newValues: (string | number)[];

    if (isSelected) {
      // Evita desmarcar se for o último item restante (mantém pelo menos 1 para comparação válida)
      if (selectedValues.length <= 1) return;
      newValues = selectedValues.filter((v) => v !== value);
    } else {
      newValues = [...selectedValues, value];
    }
    onChange(newValues);
  };

  const handleSelectAll = () => {
    onChange(options.map((o) => o.value));
  };

  const handleClearAll = () => {
    // Mantém apenas o primeiro item selecionado para não esvaziar de forma inconsistente
    if (options.length > 0) {
      onChange([options[0].value]);
    } else {
      onChange([]);
    }
  };

  const selectedLabels = React.useMemo(() => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === options.length) return "Todos selecionados";
    
    if (selectedValues.length <= maxBadges) {
      return selectedValues
        .map((val) => options.find((o) => o.value === val)?.label ?? String(val))
        .join(" · ");
    }
    
    return `${selectedValues.length} selecionados`;
  }, [selectedValues, options, placeholder, maxBadges]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-11 w-full justify-between rounded-lg border border-primary/10 bg-background/50 backdrop-blur-md px-3.5 py-2.5 font-normal text-left text-sm transition-all duration-300 hover:border-primary/30 hover:bg-background/80 shadow-inner focus:outline-none focus:ring-1 focus:ring-primary/40",
            className
          )}
        >
          <span className="truncate pr-2 font-medium text-foreground/90">{selectedLabels}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(calc(100vw-2rem),24rem)] p-0 bg-card/95 backdrop-blur-xl border border-primary/15 shadow-2xl rounded-xl z-50"
        align="start"
        sideOffset={6}
      >
        <Command className="bg-transparent">
          <CommandInput 
            placeholder="Buscar..." 
            className="h-10 border-none focus:ring-0 text-sm placeholder:text-muted-foreground"
          />
          <CommandList className="max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 p-1">
            <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={String(option.label)}
                    onSelect={() => handleSelect(option.value)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-primary/10 aria-selected:bg-primary/5 transition-colors"
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-200",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground scale-105 shadow-sm shadow-primary/30"
                          : "border-muted-foreground/30 hover:border-primary/40"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className={cn(
                      "text-sm truncate text-foreground/90",
                      isSelected && "font-medium text-primary"
                    )}>
                      {option.label}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          
          <div className="flex items-center justify-between gap-2 border-t border-primary/10 p-2 bg-muted/20">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 flex-1 rounded-lg text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-all duration-200"
              onClick={handleSelectAll}
            >
              Todos
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 flex-1 rounded-lg text-xs font-semibold hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              onClick={handleClearAll}
            >
              Resetar (1º)
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
