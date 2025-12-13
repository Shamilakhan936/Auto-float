-- Create a table for payment plans (repayment tracking for covered bills)
CREATE TABLE public.payment_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bill_id UUID REFERENCES public.bills(id) ON DELETE CASCADE,
  total_amount NUMERIC NOT NULL,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  installment_amount NUMERIC NOT NULL,
  installments_total INTEGER NOT NULL DEFAULT 1,
  installments_paid INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'defaulted')),
  next_payment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for individual payment installments
CREATE TABLE public.payment_installments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_plan_id UUID NOT NULL REFERENCES public.payment_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_installments ENABLE ROW LEVEL SECURITY;

-- RLS policies for payment_plans
CREATE POLICY "Users can view their own payment plans" 
ON public.payment_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment plans" 
ON public.payment_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment plans" 
ON public.payment_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for payment_installments
CREATE POLICY "Users can view their own installments" 
ON public.payment_installments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own installments" 
ON public.payment_installments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own installments" 
ON public.payment_installments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_payment_plans_updated_at
BEFORE UPDATE ON public.payment_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();