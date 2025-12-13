-- Create subscription tier enum
CREATE TYPE public.subscription_tier AS ENUM ('basic', 'plus', 'auto_plus');

-- Create bill status enum
CREATE TYPE public.bill_status AS ENUM ('pending', 'scheduled', 'paid', 'failed');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tier subscription_tier NOT NULL DEFAULT 'basic',
  access_limit INTEGER NOT NULL DEFAULT 500,
  access_used INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  settlement_timing TEXT DEFAULT 'month-end',
  next_settlement_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicles table for auto verification
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vin TEXT,
  license_plate TEXT,
  make TEXT,
  model TEXT,
  year INTEGER,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  insurance_provider TEXT,
  insurance_verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bank accounts table
CREATE TABLE public.bank_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bank_name TEXT NOT NULL,
  account_last_four TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  is_connected BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bills table
CREATE TABLE public.bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status bill_status NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscription"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
ON public.subscriptions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
ON public.subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for vehicles
CREATE POLICY "Users can view their own vehicles"
ON public.vehicles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own vehicles"
ON public.vehicles FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for bank_accounts
CREATE POLICY "Users can view their own bank accounts"
ON public.bank_accounts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bank accounts"
ON public.bank_accounts FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for bills
CREATE POLICY "Users can view their own bills"
ON public.bills FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bills"
ON public.bills FOR ALL
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bank_accounts_updated_at
BEFORE UPDATE ON public.bank_accounts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bills_updated_at
BEFORE UPDATE ON public.bills
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  INSERT INTO public.subscriptions (user_id, tier, access_limit)
  VALUES (NEW.id, 'basic', 500);
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile and subscription on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();