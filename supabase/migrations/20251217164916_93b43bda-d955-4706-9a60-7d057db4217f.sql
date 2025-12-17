-- Add RLS policy for admins to view all vehicles
CREATE POLICY "Admins can view all vehicles"
ON public.vehicles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policy for admins to update vehicles
CREATE POLICY "Admins can update all vehicles"
ON public.vehicles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));