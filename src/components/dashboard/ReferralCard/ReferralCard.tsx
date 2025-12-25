import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Copy, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReferralCardProps {
  referralCode: string | null;
  referralCount: number;
  totalEarnings: number;
}

export function ReferralCard({ referralCode, referralCount, totalEarnings }: ReferralCardProps) {
  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast({ title: "Copied!", description: "Referral code copied to clipboard." });
    }
  };

  const shareReferral = () => {
    const shareText = `Join AutoFloat and get help with your bills! Use my referral code: ${referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Join AutoFloat',
        text: shareText,
        url: window.location.origin,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({ title: "Copied!", description: "Share message copied to clipboard." });
    }
  };

  return (
    <Card className="animate-fade-in [animation-delay:500ms] opacity-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Gift className="h-5 w-5 text-accent" />
          Refer & Earn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm text-muted-foreground mb-2">Your referral code</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-lg font-mono font-bold text-accent">
                {referralCode || 'Loading...'}
              </code>
              <Button variant="ghost" size="icon" onClick={copyReferralCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-secondary/30 text-center">
              <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold">{referralCount}</p>
              <p className="text-xs text-muted-foreground">Referrals</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30 text-center">
              <Gift className="h-5 w-5 mx-auto mb-1 text-accent" />
              <p className="text-2xl font-bold text-accent">${totalEarnings}</p>
              <p className="text-xs text-muted-foreground">Earned</p>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" onClick={shareReferral}>
            Share & Earn $5
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Earn $5 for each friend who signs up
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

