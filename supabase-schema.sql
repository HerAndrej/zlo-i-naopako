-- ============================================================
-- ZLO I NAOPAKO - SUPABASE SQL SCHEMA
-- Pokreni ovaj ceo kod u Supabase SQL Editor-u
-- ============================================================

-- 1. TABELA: orders (narudžbine)
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  total_amount INTEGER NOT NULL, -- u RSD
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA: order_items (stavke narudžbine)
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL, -- cena po komadu u RSD
  total_price INTEGER NOT NULL, -- quantity * unit_price
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index za brže pretrage po order_id
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 3. TABELA: admin_users (admin korisnici)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FUNKCIJA: Provera da li je korisnik admin
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. FUNKCIJA: Auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 6. RLS (Row Level Security) POLITIKE
-- ============================================================

-- Uključi RLS na svim tabelama
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ORDERS: Anonimni/ulogovani korisnici mogu da KREIRAJU narudžbine
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- ORDERS: Samo admini mogu da ČITAJU narudžbine
CREATE POLICY "Admins can read all orders"
  ON orders FOR SELECT
  USING (is_admin());

-- ORDERS: Samo admini mogu da AŽURIRAJU narudžbine (npr. status)
CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (is_admin());

-- ORDER_ITEMS: Anonimni/ulogovani korisnici mogu da KREIRAJU stavke
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- ORDER_ITEMS: Samo admini mogu da ČITAJU stavke
CREATE POLICY "Admins can read all order items"
  ON order_items FOR SELECT
  USING (is_admin());

-- ADMIN_USERS: Admini mogu da čitaju svoju tabelu (za proveru)
CREATE POLICY "Admins can read admin_users"
  ON admin_users FOR SELECT
  USING (id = auth.uid());

-- 7. VIEW: Pregled narudžbina sa stavkama (za dashboard)
-- ============================================================
CREATE OR REPLACE VIEW order_summary AS
SELECT
  o.id,
  o.customer_name,
  o.customer_phone,
  o.customer_city,
  o.customer_address,
  o.total_amount,
  o.status,
  o.created_at,
  o.updated_at,
  COALESCE(
    json_agg(
      json_build_object(
        'product_name', oi.product_name,
        'product_id', oi.product_id,
        'quantity', oi.quantity,
        'unit_price', oi.unit_price,
        'total_price', oi.total_price
      )
    ) FILTER (WHERE oi.id IS NOT NULL),
    '[]'::json
  ) AS items
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.customer_name, o.customer_phone, o.customer_city,
         o.customer_address, o.total_amount, o.status, o.created_at, o.updated_at
ORDER BY o.created_at DESC;

-- ============================================================
-- 8. DODAJ ADMIN KORISNIKA
-- ============================================================
-- VAŽNO: Prvo registruj korisnika u Supabase Dashboard:
--   Authentication → Users → Add User
--   Email: tvoj@email.com, Password: tvoja_sifra
--
-- Zatim pokreni ovo (zameni email sa tvojim):
-- 
-- INSERT INTO admin_users (id, email)
-- SELECT id, email FROM auth.users WHERE email = 'tvoj@email.com';
-- ============================================================
