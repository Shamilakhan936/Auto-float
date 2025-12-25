import { ReferralIcon } from "./ReferralIcon";
import { ReferralText } from "./ReferralText";
import { ReferralActions } from "./ReferralActions";

interface ReferralSectionContentProps {
  referralCode: string | null;
  userId: string | undefined;
}

export function ReferralSectionContent({ referralCode, userId }: ReferralSectionContentProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <ReferralIcon />
      <ReferralText />
      <ReferralActions referralCode={referralCode} userId={userId} />
    </div>
  );
}


