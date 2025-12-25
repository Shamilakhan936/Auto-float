import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface EditBankAccountFormProps {
  bankName: string;
  accountLastFour: string;
  isConnected: boolean;
  isPrimary: boolean;
  onBankNameChange: (value: string) => void;
  onAccountLastFourChange: (value: string) => void;
  onIsConnectedChange: (value: boolean) => void;
  onIsPrimaryChange: (value: boolean) => void;
}

export function EditBankAccountForm({
  bankName,
  accountLastFour,
  isConnected,
  isPrimary,
  onBankNameChange,
  onAccountLastFourChange,
  onIsConnectedChange,
  onIsPrimaryChange,
}: EditBankAccountFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          value={bankName}
          onChange={(e) => onBankNameChange(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="accountLastFour">Last 4 Digits</Label>
        <Input
          id="accountLastFour"
          value={accountLastFour}
          onChange={(e) => onAccountLastFourChange(e.target.value)}
          maxLength={4}
          placeholder="1234"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="isConnected">Connected Status</Label>
        <Switch
          id="isConnected"
          checked={isConnected}
          onCheckedChange={onIsConnectedChange}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="isPrimary">Primary Account</Label>
        <Switch
          id="isPrimary"
          checked={isPrimary}
          onCheckedChange={onIsPrimaryChange}
        />
      </div>
    </div>
  );
}


