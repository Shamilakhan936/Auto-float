import { TableHead } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableTableHeadProps {
  column: string;
  label: string;
  currentSort: { column: string; direction: 'asc' | 'desc' } | null;
  onSort: (column: string) => void;
  className?: string;
}

export function SortableTableHead({ 
  column, 
  label, 
  currentSort, 
  onSort,
  className 
}: SortableTableHeadProps) {
  const isActive = currentSort?.column === column;
  
  return (
    <TableHead 
      className={cn(
        "text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none",
        className
      )}
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive ? (
          currentSort.direction === 'asc' ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        )}
      </div>
    </TableHead>
  );
}
