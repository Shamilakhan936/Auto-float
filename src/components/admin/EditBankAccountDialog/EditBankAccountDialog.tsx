import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EditBankAccountForm } from "./EditBankAccountForm";
import { EditBankAccountHeader } from "./EditBankAccountHeader";

interface BankAccount {
  id: string;
  user_id: string;
  bank_name: string;
  account_last_four: string | null;
  is_connected: boolean;
  is_primary: boolean;
  created_at: string;
}

interface EditBankAccountDialogProps {
  account: BankAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (account: BankAccount) => void;
}

export function EditBankAccountDialog({
  account,
  open,
  onOpenChange,
  onUpdate
}: EditBankAccountDialogProps) {
  const [bankName, setBankName] = useState("");
  const [accountLastFour, setAccountLastFour] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [isPrimary, setIsPrimary] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (account) {
      setBankName(account.bank_name);
      setAccountLastFour(account.account_last_four || "");
      setIsConnected(account.is_connected);
      setIsPrimary(account.is_primary);
    }
  }, [account]);

  const handleSave = async () => {
    if (!account) return;
    
    setSaving(true);
    const { error } = await supabase
      .from("bank_accounts")
      .update({
        bank_name: bankName,
        account_last_four: accountLastFour || null,
        is_connected: isConnected,
        is_primary: isPrimary
      })
      .eq("id", account.id);

    setSaving(false);

    if (error) {
      toast.error("Failed to update bank account");
      return;
    }

    toast.success("Bank account updated successfully");
    onUpdate({
      ...account,
      bank_name: bankName,
      account_last_four: accountLastFour || null,
      is_connected: isConnected,
      is_primary: isPrimary
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <EditBankAccountHeader />
        <EditBankAccountForm
          bankName={bankName}
          accountLastFour={accountLastFour}
          isConnected={isConnected}
          isPrimary={isPrimary}
          onBankNameChange={setBankName}
          onAccountLastFourChange={setAccountLastFour}
          onIsConnectedChange={setIsConnected}
          onIsPrimaryChange={setIsPrimary}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


