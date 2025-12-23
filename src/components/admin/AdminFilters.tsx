import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Filter, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AdminFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  statusOptions: { value: string; label: string }[];
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onDateFromChange: (date: Date | undefined) => void;
  onDateToChange: (date: Date | undefined) => void;
  onClearFilters: () => void;
}

export function AdminFilters({
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClearFilters
}: AdminFiltersProps) {
  const hasActiveFilters = statusFilter !== "all" || dateFrom || dateTo;

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-gradient-to-r from-card/80 to-card/60 rounded-2xl shadow-lg">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-muted/50">
          <Filter className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">Filters:</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Label className="text-xs text-muted-foreground">Status</Label>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[140px] h-9 text-sm bg-background/50 border-0 shadow-sm rounded-xl">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-0 shadow-xl bg-card">
            <SelectItem value="all">All</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-xs text-muted-foreground">From</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-[130px] h-9 text-sm justify-start text-left font-normal bg-background/50 shadow-sm rounded-xl hover:bg-background/80",
                !dateFrom && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-3 w-3" />
              {dateFrom ? format(dateFrom, "MMM d, yyyy") : "Pick date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto border-0 shadow-xl rounded-xl" align="start">
            <CalendarComponent
              mode="single"
              selected={dateFrom}
              onSelect={onDateFromChange}
              initialFocus
              className="pointer-events-auto rounded-xl"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-xs text-muted-foreground">To</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-[130px] h-9 text-sm justify-start text-left font-normal bg-background/50 shadow-sm rounded-xl hover:bg-background/80",
                !dateTo && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-3 w-3" />
              {dateTo ? format(dateTo, "MMM d, yyyy") : "Pick date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto border-0 shadow-xl rounded-xl" align="start">
            <CalendarComponent
              mode="single"
              selected={dateTo}
              onSelect={onDateToChange}
              initialFocus
              className="pointer-events-auto rounded-xl"
            />
          </PopoverContent>
        </Popover>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-9 px-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl"
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
