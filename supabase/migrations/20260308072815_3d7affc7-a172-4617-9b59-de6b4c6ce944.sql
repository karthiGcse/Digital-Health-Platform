
CREATE TABLE public.pharmacy_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_name text NOT NULL,
  generic_name text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  brand text DEFAULT '',
  strength text DEFAULT '',
  stock_quantity integer NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'tablets',
  price numeric DEFAULT 0,
  mrp numeric DEFAULT 0,
  expiry_date date,
  batch_number text DEFAULT '',
  supplier text DEFAULT '',
  rack_location text DEFAULT '',
  is_prescription_required boolean DEFAULT false,
  alternative_group text DEFAULT '',
  status text NOT NULL DEFAULT 'in_stock',
  last_restocked_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pharmacy_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view inventory"
ON public.pharmacy_inventory
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage inventory"
ON public.pharmacy_inventory
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE TRIGGER update_pharmacy_inventory_updated_at
  BEFORE UPDATE ON public.pharmacy_inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.pharmacy_inventory;
