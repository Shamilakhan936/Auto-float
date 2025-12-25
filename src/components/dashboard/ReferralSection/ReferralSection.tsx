import { Card, CardContent } from "@/components/ui/card";
import { ReferralSectionContent } from "./ReferralSectionContent";

interface ReferralSectionProps {
  referralCode: string | null;
  userId: string | undefined;
}

export function ReferralSection({ referralCode, userId }: ReferralSectionProps) {
  return (
    <Card className="mb-8 animate-fade-in [animation-delay:280ms] opacity-0 border-accent/30 bg-gradient-to-r from-accent/5 to-transparent">
      <CardContent className="py-6">
        <ReferralSectionContent referralCode={referralCode} userId={userId} />
      </CardContent>
    </Card>
  );
}
