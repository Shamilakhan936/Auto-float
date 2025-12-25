-- Allow public/anonymous read access to bank_accounts for admin panel
CREATE POLICY "Allow public read access to bank_accounts" 
ON public.bank_accounts 
FOR SELECT 
TO anon
USING (true);

-- Allow public/anonymous read access to referrals for admin panel
CREATE POLICY "Allow public read access to referrals" 
ON public.referrals 
FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Allow public read access to payment_plans" 
ON public.payment_plans 
FOR SELECT 
TO anon
USING (true);

-- Allow public/anonymous read access to payment_installments for admin panel
CREATE POLICY "Allow public read access to payment_installments" 
ON public.payment_installments 
FOR SELECT 
TO anon
USING (true);

-- Allow public/anonymous UPDATE access to profiles for admin verification
CREATE POLICY "Allow public update to profiles for admin" 
ON public.profiles 
FOR UPDATE 
TO anon
USING (true);

-- Allow public/anonymous UPDATE access to vehicles for admin verification
CREATE POLICY "Allow public update to vehicles for admin" 
ON public.vehicles 
FOR UPDATE 
TO anon
USING (true);

-- Allow public/anonymous UPDATE access to bills for admin status changes
CREATE POLICY "Allow public update to bills for admin" 
ON public.bills 
FOR UPDATE 
TO anon
USING (true);