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
        <DialogHeader>
          <DialogTitle>Edit Bank Account</DialogTitle>
          <DialogDescription>
            Update bank account details
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="accountLastFour">Last 4 Digits</Label>
            <Input
              id="accountLastFour"
              value={accountLastFour}
              onChange={(e) => setAccountLastFour(e.target.value)}
              maxLength={4}
              placeholder="1234"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isConnected">Connected Status</Label>
            <Switch
              id="isConnected"
              checked={isConnected}
              onCheckedChange={setIsConnected}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isPrimary">Primary Account</Label>
            <Switch
              id="isPrimary"
              checked={isPrimary}
              onCheckedChange={setIsPrimary}
            />
          </div>
        </div>
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
