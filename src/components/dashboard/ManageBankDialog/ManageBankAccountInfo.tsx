import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import type { BankAccount } from "../types";

interface ManageBankAccountInfoProps {
  bankAccount: BankAccount;
}

export function ManageBankAccountInfo({ bankAccount }: ManageBankAccountInfoProps) {
  return (
    <div className="rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <CreditCard className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">{bankAccount.bank_name}</p>
            <p className="text-sm text-muted-foreground">
              ••••{bankAccount.account_last_four || "4567"}
            </p>
          </div>
        </div>
        <Badge variant={bankAccount.is_connected ? "success" : "outline"}>
          {bankAccount.is_connected ? "Connected" : "Disconnected"}
        </Badge>
      </div>
    </div>
  );
}


