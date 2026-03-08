
DROP POLICY "Authenticated users can manage inventory" ON public.pharmacy_inventory;

CREATE POLICY "Pharmacists can manage inventory"
ON public.pharmacy_inventory
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role IN ('pharmacist', 'admin')
  )
);

CREATE POLICY "Pharmacists can update inventory"
ON public.pharmacy_inventory
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role IN ('pharmacist', 'admin')
  )
);

CREATE POLICY "Pharmacists can delete inventory"
ON public.pharmacy_inventory
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role IN ('pharmacist', 'admin')
  )
);
