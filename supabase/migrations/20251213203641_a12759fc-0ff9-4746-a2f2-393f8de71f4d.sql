ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS settlement_timing TEXT DEFAULT 'month-end',
ADD COLUMN IF NOT EXISTS next_settlement_date DATE;