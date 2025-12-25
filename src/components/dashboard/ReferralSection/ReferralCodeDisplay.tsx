import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReferralCodeDisplayProps {
  code: string;
}

export function ReferralCodeDisplay({ code }: ReferralCodeDisplayProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border">
      <span className="text-sm font-mono text-foreground">
        {code}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={handleCopy}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}


