-- Allow public/anonymous read access to profiles for admin panel
CREATE POLICY "Allow public read access to profiles" 
ON public.profiles 
FOR SELECT 
TO anon
USING (true);

-- Allow public/anonymous read access to bills for admin panel
CREATE POLICY "Allow public read access to bills" 
ON public.bills 
FOR SELECT 
TO anon
USING (true);

-- Allow public/anonymous read access to subscriptions for admin panel
CREATE POLICY "Allow public read access to subscriptions" 
ON public.subscriptions 
FOR SELECT 
TO anon
USING (true);

-- Allow public/anonymous read access to vehicles for admin panel
CREATE POLICY "Allow public read access to vehicles" 
ON public.vehicles 
FOR SELECT 
TO anon
USING (true);