import { Button } from "@/components/ui/button";
import { Users, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ReferralCodeDisplay } from "./ReferralCodeDisplay";

interface ReferralActionsProps {
  referralCode: string | null;
  userId: string | undefined;
}

export function ReferralActions({ referralCode, userId }: ReferralActionsProps) {
  const code = referralCode || `REF-${userId?.slice(0, 8).toUpperCase()}`;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
      <ReferralCodeDisplay code={code} />
      <Button variant="accent">
        <Users className="h-4 w-4 mr-2" />
        Share Link
      </Button>
    </div>
  );
}


