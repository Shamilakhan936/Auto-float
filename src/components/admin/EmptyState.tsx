import { TableCell, TableRow } from "@/components/ui/table";
import { FileX } from "lucide-react";

interface EmptyStateProps {
  colSpan: number;
  message?: string;
}

export const EmptyState = ({ colSpan, message = "No data found" }: EmptyStateProps) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-32">
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <FileX className="h-8 w-8 opacity-50" />
          <span className="text-sm">{message}</span>
        </div>
      </TableCell>
    </TableRow>
  );
};
