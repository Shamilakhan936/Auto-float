import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, CheckCircle, XCircle } from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  onBulkDelete?: () => void;
  onBulkVerify?: () => void;
  onBulkUnverify?: () => void;
  showVerifyActions?: boolean;
}

export function BulkActions({
  selectedCount,
  totalCount,
  onSelectAll,
  allSelected,
  onBulkDelete,
  onBulkVerify,
  onBulkUnverify,
  showVerifyActions = false
}: BulkActionsProps) {
  if (selectedCount === 0) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-lg border border-border/50">
        <Checkbox 
          checked={allSelected} 
          onCheckedChange={onSelectAll}
          className="data-[state=checked]:bg-primary"
        />
        <span className="text-sm text-muted-foreground">
          Select all ({totalCount} items)
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
      <Checkbox 
        checked={allSelected} 
        onCheckedChange={onSelectAll}
        className="data-[state=checked]:bg-primary"
      />
      <span className="text-sm font-medium text-primary">
        {selectedCount} selected
      </span>
      <div className="flex items-center gap-2 ml-auto">
        {showVerifyActions && onBulkVerify && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkVerify}
            className="h-7 text-xs border-primary/50 text-primary hover:bg-primary/10"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Verify
          </Button>
        )}
        {showVerifyActions && onBulkUnverify && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkUnverify}
            className="h-7 text-xs"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Unverify
          </Button>
        )}
        {onBulkDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkDelete}
            className="h-7 text-xs border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
