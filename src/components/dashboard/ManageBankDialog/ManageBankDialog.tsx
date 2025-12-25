import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { BankAccount } from "../types";
import { ManageBankDialogHeader } from "./ManageBankDialogHeader";
import { ManageBankAccountInfo } from "./ManageBankAccountInfo";
import { ManageBankEmpty } from "./ManageBankEmpty";

interface ManageBankDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bankAccount: BankAccount | null;
}

export function ManageBankDialog({ open, onOpenChange, bankAccount }: ManageBankDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <ManageBankDialogHeader />
        <div className="space-y-4">
          {bankAccount ? (
            <ManageBankAccountInfo bankAccount={bankAccount} />
          ) : (
            <ManageBankEmpty />
          )}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Link to="/connect-bank" className="flex-1">
              <Button variant="accent" className="w-full">
                {bankAccount ? "Update Bank" : "Connect Bank"}
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
