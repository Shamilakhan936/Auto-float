-- Add referral_code to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by TEXT;

CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL,
  referred_id UUID NOT NULL,
  referral_code TEXT NOT NULL,
  reward_amount NUMERIC NOT NULL DEFAULT 5,
  reward_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Referrals policies
CREATE POLICY "Users can view their own referrals"
ON public.referrals
FOR SELECT
USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can insert referrals"
ON public.referrals
FOR INSERT
WITH CHECK (auth.uid() = referred_id);

-- Add settlement_frequency to subscriptions if not exists
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS settlement_frequency TEXT DEFAULT 'bi-weekly';

-- Function to generate referral code on new user
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles 
  SET referral_code = UPPER(SUBSTRING(MD5(NEW.user_id::text || NOW()::text) FROM 1 FOR 8))
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Trigger to auto-generate referral code
CREATE TRIGGER on_profile_created_generate_code
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_referral_code();

-- Add document fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS drivers_license_url TEXT,
ADD COLUMN IF NOT EXISTS paystub_url TEXT,
ADD COLUMN IF NOT EXISTS documents_verified BOOLEAN DEFAULT false;