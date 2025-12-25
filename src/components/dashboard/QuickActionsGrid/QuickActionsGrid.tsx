import { QuickActionCard } from "./QuickActionCard";
import { QuickActionLink } from "./QuickActionLink";

interface QuickActionsGridProps {
  onAddBill: () => void;
  onManageBank: () => void;
  onManageVehicle: () => void;
  bankAccount: { bank_name: string } | null;
  isVerified: boolean;
}

export function QuickActionsGrid({
  onAddBill,
  onManageBank,
  onManageVehicle,
  bankAccount,
  isVerified,
}: QuickActionsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
      <QuickActionCard
        icon="Plus"
        title="Add Bill"
        description="Schedule new payment"
        onClick={onAddBill}
        delay="300ms"
      />
      <QuickActionCard
        icon="CreditCard"
        title="Bank Account"
        description={bankAccount ? bankAccount.bank_name : "Connect bank"}
        onClick={onManageBank}
        delay="400ms"
      />
      <QuickActionCard
        icon="Car"
        title="Vehicle Info"
        description={isVerified ? "Verified" : "Not verified"}
        onClick={onManageVehicle}
        delay="500ms"
      />
      <QuickActionLink
        to="/settings"
        icon="Shield"
        title="Settings"
        description="Manage account"
        delay="550ms"
      />
      <QuickActionLink
        to="/plans"
        icon="ArrowUpRight"
        title="Upgrade Plan"
        description="Increase your limit"
        delay="600ms"
      />
    </div>
  );
}
