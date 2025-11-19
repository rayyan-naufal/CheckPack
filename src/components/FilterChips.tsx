import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface FilterChip {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

interface FilterChipsProps {
  chips: FilterChip[];
  activeChip: string | null;
  onChipClick: (id: string) => void;
  label: string;
}

export const FilterChips = ({ chips, activeChip, onChipClick, label }: FilterChipsProps) => {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
        {label}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Badge
          variant={activeChip === null ? "default" : "outline"}
          className={cn(
            "touch-target px-4 cursor-pointer whitespace-nowrap mobile-transition",
            activeChip === null
              ? "bg-primary text-primary-foreground"
              : "bg-card hover:bg-muted"
          )}
          onClick={() => onChipClick("")}
        >
          All
        </Badge>
        {chips.map((chip) => (
          <Badge
            key={chip.id}
            variant={activeChip === chip.label ? "default" : "outline"}
            className={cn(
              "touch-target px-4 cursor-pointer whitespace-nowrap mobile-transition",
              activeChip === chip.label
                ? "bg-primary text-primary-foreground"
                : "bg-card hover:bg-muted"
            )}
            onClick={() => onChipClick(chip.label)}
          >
            {chip.icon && <span className="mr-1.5">{chip.icon}</span>}
            {chip.label}
            {chip.count !== undefined && (
              <span className="ml-1.5 text-xs opacity-70">({chip.count})</span>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};
