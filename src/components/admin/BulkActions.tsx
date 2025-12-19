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
      <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-muted/40 to-muted/20 rounded-2xl mb-4">
        <Checkbox 
          checked={allSelected} 
          onCheckedChange={onSelectAll}
          className="data-[state=checked]:bg-primary border-muted-foreground/30"
        />
        <span className="text-sm text-muted-foreground">
          Select all ({totalCount} items)
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-primary/15 to-primary/5 rounded-2xl mb-4 shadow-lg shadow-primary/5">
      <Checkbox 
        checked={allSelected} 
        onCheckedChange={onSelectAll}
        className="data-[state=checked]:bg-primary"
      />
      <span className="text-sm font-semibold text-primary">
        {selectedCount} selected
      </span>
      <div className="flex items-center gap-2 ml-auto">
        {showVerifyActions && onBulkVerify && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBulkVerify}
            className="h-8 text-xs text-primary hover:bg-primary/20 rounded-xl"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Verify
          </Button>
        )}
        {showVerifyActions && onBulkUnverify && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBulkUnverify}
            className="h-8 text-xs hover:bg-muted/50 rounded-xl"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Unverify
          </Button>
        )}
        {onBulkDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBulkDelete}
            className="h-8 text-xs text-destructive hover:bg-destructive/15 rounded-xl"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
