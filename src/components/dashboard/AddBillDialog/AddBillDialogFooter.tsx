import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AddBillDialogFooterProps {
  onClose: () => void;
  submitting: boolean;
}

export function AddBillDialogFooter({ onClose, submitting }: AddBillDialogFooterProps) {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" variant="accent" className="flex-1" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Add Bill
      </Button>
    </DialogFooter>
  );
}


