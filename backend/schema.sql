
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, role TEXT NOT NULL, role_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active', two_factor INTEGER DEFAULT 0,
  last_active TEXT, created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, company TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL, phone TEXT NOT NULL, city TEXT NOT NULL,
  properties INTEGER DEFAULT 0, revenue REAL DEFAULT 0, commission_rate REAL DEFAULT 15,
  status TEXT DEFAULT 'Active', joined_at TEXT NOT NULL,
  kyc_pan TEXT, kyc_gst TEXT, kyc_pan_status TEXT DEFAULT 'Pending',
  kyc_gst_status TEXT DEFAULT 'Pending', kyc_bank_name TEXT,
  kyc_account_number TEXT, kyc_ifsc TEXT, kyc_bank_status TEXT DEFAULT 'Pending'
);
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL, state TEXT NOT NULL,
  address TEXT NOT NULL, partner_id TEXT, partner_name TEXT NOT NULL,
  rooms INTEGER DEFAULT 0, occupancy REAL DEFAULT 0, rating REAL DEFAULT 0,
  reviews INTEGER DEFAULT 0, revenue REAL DEFAULT 0, status TEXT DEFAULT 'Active',
  type TEXT NOT NULL, amenities TEXT DEFAULT '[]', images TEXT DEFAULT '[]',
  documents TEXT DEFAULT '[]', onboarded_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY, code TEXT NOT NULL, property_id TEXT, property_name TEXT NOT NULL,
  name TEXT NOT NULL, type TEXT NOT NULL, capacity INTEGER DEFAULT 2,
  base_rate REAL DEFAULT 0, status TEXT DEFAULT 'Available', floor INTEGER DEFAULT 1,
  next_check_in TEXT
);
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
  city TEXT NOT NULL, bookings INTEGER DEFAULT 0, spend REAL DEFAULT 0,
  cancellations INTEGER DEFAULT 0, status TEXT DEFAULT 'Active',
  verified INTEGER DEFAULT 0, joined_at TEXT NOT NULL, last_booking_at TEXT,
  password_hash TEXT, gender TEXT, emergency_name TEXT, emergency_phone TEXT,
  emergency_relation TEXT
);
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY, code TEXT NOT NULL, customer_id TEXT,
  customer_name TEXT NOT NULL, customer_email TEXT NOT NULL, customer_phone TEXT NOT NULL,
  property_id TEXT, property_name TEXT NOT NULL, city TEXT NOT NULL,
  room_name TEXT NOT NULL, room_type TEXT NOT NULL, check_in TEXT NOT NULL,
  check_out TEXT NOT NULL, nights INTEGER DEFAULT 1, guests INTEGER DEFAULT 1,
  amount REAL DEFAULT 0, tax REAL DEFAULT 0, commission REAL DEFAULT 0,
  status TEXT DEFAULT 'Pending', payment_method TEXT DEFAULT 'Online',
  payment_status TEXT DEFAULT 'Paid', transaction_id TEXT,
  source TEXT DEFAULT 'Website', created_at TEXT NOT NULL, timeline TEXT DEFAULT '[]',
  duration INTEGER, slot_time TEXT, otp TEXT, rated INTEGER, hotel_id TEXT,
  base_amount REAL, gst_amount REAL, total REAL, payment_method_type TEXT,
  id_proof TEXT, special_requests TEXT, internal_note TEXT,
  approval_seconds INTEGER, booked_on TEXT, check_in_time TEXT,
  check_out_time TEXT, adults INTEGER DEFAULT 1, children INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS payouts (
  id TEXT PRIMARY KEY, reference TEXT NOT NULL, partner_id TEXT, partner_name TEXT NOT NULL,
  period TEXT NOT NULL, gross REAL DEFAULT 0, commission REAL DEFAULT 0,
  tax REAL DEFAULT 0, net REAL DEFAULT 0, status TEXT DEFAULT 'Pending',
  requested_at TEXT NOT NULL, utr TEXT, bookings INTEGER DEFAULT 0,
  stage TEXT DEFAULT 'Pending', note TEXT
);
CREATE TABLE IF NOT EXISTS refunds (
  id TEXT PRIMARY KEY, reference TEXT NOT NULL, booking_code TEXT NOT NULL,
  customer_name TEXT NOT NULL, property_name TEXT NOT NULL,
  booking_amount REAL DEFAULT 0, refund_amount REAL DEFAULT 0,
  type TEXT NOT NULL, reason TEXT NOT NULL, status TEXT DEFAULT 'Requested',
  requested_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY, property_id TEXT, property_name TEXT NOT NULL,
  customer_name TEXT NOT NULL, rating INTEGER NOT NULL, title TEXT NOT NULL,
  body TEXT NOT NULL, created_at TEXT NOT NULL, status TEXT DEFAULT 'Published',
  response TEXT, room TEXT, duration INTEGER, stayed_on TEXT, categories TEXT,
  image TEXT, guest_stars INTEGER, guest_tags TEXT, replied_on TEXT
);
CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY, reference TEXT NOT NULL, subject TEXT NOT NULL,
  requester TEXT NOT NULL, requester_type TEXT NOT NULL, category TEXT NOT NULL,
  priority TEXT DEFAULT 'Medium', status TEXT DEFAULT 'Open',
  agent TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  messages TEXT DEFAULT '[]'
);
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY, code TEXT NOT NULL, description TEXT NOT NULL,
  type TEXT NOT NULL, value REAL NOT NULL, min_booking REAL DEFAULT 0,
  max_discount REAL, used INTEGER DEFAULT 0, coupon_limit INTEGER DEFAULT 0,
  valid_from TEXT NOT NULL, valid_to TEXT NOT NULL, status TEXT DEFAULT 'Active'
);
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, channel TEXT NOT NULL,
  audience TEXT NOT NULL, sent INTEGER DEFAULT 0, delivered INTEGER DEFAULT 0,
  opened INTEGER DEFAULT 0, status TEXT DEFAULT 'Draft', scheduled_at TEXT
);
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY, actor TEXT NOT NULL, role TEXT NOT NULL,
  action TEXT NOT NULL, category TEXT NOT NULL, target TEXT NOT NULL,
  ip TEXT NOT NULL, at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS fraud_alerts (
  id TEXT PRIMARY KEY, reference TEXT NOT NULL, type TEXT NOT NULL,
  subject TEXT NOT NULL, risk_score INTEGER NOT NULL, detail TEXT NOT NULL,
  amount REAL DEFAULT 0, status TEXT DEFAULT 'Open', detected_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS pricing_rules (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, scope TEXT NOT NULL,
  trigger TEXT NOT NULL, adjustment TEXT NOT NULL, channel TEXT DEFAULT 'All',
  status TEXT DEFAULT 'Active', updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS hotels (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, area TEXT NOT NULL, city TEXT NOT NULL,
  image TEXT NOT NULL, rating REAL DEFAULT 0, reviews_count INTEGER DEFAULT 0,
  landmark TEXT NOT NULL, distance_km REAL DEFAULT 0, intents TEXT DEFAULT '[]',
  amenities TEXT DEFAULT '[]', couple_friendly INTEGER DEFAULT 0,
  local_id_accepted INTEGER DEFAULT 0, instant_confirm INTEGER DEFAULT 0,
  pay_at_hotel INTEGER DEFAULT 0, business_friendly INTEGER DEFAULT 0,
  chain TEXT DEFAULT '', collection TEXT, slots_left INTEGER DEFAULT 0,
  earliest_slot TEXT DEFAULT '00:00', rate_3h INTEGER DEFAULT 0,
  rate_6h INTEGER DEFAULT 0, rate_12h INTEGER DEFAULT 0,
  about TEXT DEFAULT '', policies TEXT DEFAULT '[]', partner_id TEXT
);
CREATE TABLE IF NOT EXISTS customer_bookings (
  id TEXT PRIMARY KEY, reference TEXT NOT NULL, hotel_id TEXT,
  date TEXT NOT NULL, check_in TEXT NOT NULL, duration INTEGER NOT NULL,
  guests INTEGER DEFAULT 1, amount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ongoing', otp TEXT, rated INTEGER, customer_id TEXT
);
CREATE TABLE IF NOT EXISTS partner_users (
  id TEXT PRIMARY KEY, hotel_id TEXT NOT NULL, name TEXT NOT NULL,
  role_id TEXT NOT NULL, password_hash TEXT NOT NULL, phone TEXT NOT NULL,
  active INTEGER DEFAULT 1, last_login TEXT
);
CREATE TABLE IF NOT EXISTS partner_roles (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, level TEXT NOT NULL,
  system INTEGER DEFAULT 0, description TEXT NOT NULL, permissions TEXT DEFAULT '[]'
);
CREATE TABLE IF NOT EXISTS room_profiles (
  id TEXT PRIMARY KEY, property_id TEXT, photos TEXT DEFAULT '[]',
  amenities TEXT DEFAULT '[]', facilities TEXT DEFAULT '[]',
  max_adults INTEGER DEFAULT 2, max_children INTEGER DEFAULT 1,
  extra_guest_allowed INTEGER DEFAULT 0, extra_guest_fee INTEGER DEFAULT 0,
  short_description TEXT DEFAULT '', highlights TEXT DEFAULT '[]',
  landmarks TEXT DEFAULT '[]', availability_status TEXT DEFAULT 'Active'
);
CREATE TABLE IF NOT EXISTS slot_pricing (
  id TEXT PRIMARY KEY, property_id TEXT,
  price_3h INTEGER DEFAULT 0, price_6h INTEGER DEFAULT 0,
  price_12h INTEGER DEFAULT 0, extra_hour INTEGER DEFAULT 0,
  weekend_surcharge INTEGER DEFAULT 0, active_3h INTEGER DEFAULT 1,
  active_6h INTEGER DEFAULT 1, active_12h INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS day_availability (
  id TEXT PRIMARY KEY, property_id TEXT, date TEXT NOT NULL, day TEXT NOT NULL,
  allocated INTEGER DEFAULT 0, booked INTEGER DEFAULT 0, blocked INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS earnings (
  id TEXT PRIMARY KEY, property_id TEXT, date TEXT NOT NULL, booking_id TEXT,
  guest TEXT NOT NULL, duration INTEGER NOT NULL, gross REAL DEFAULT 0,
  commission REAL DEFAULT 0, net REAL DEFAULT 0,
  status TEXT DEFAULT 'Settled'
);
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY, property_id TEXT, category TEXT NOT NULL,
  subject TEXT NOT NULL, created_on TEXT NOT NULL,
  status TEXT DEFAULT 'Open', agent TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS partner_audit_logs (
  id TEXT PRIMARY KEY, property_id TEXT, time TEXT NOT NULL,
  actor TEXT NOT NULL, role TEXT NOT NULL, action TEXT NOT NULL,
  detail TEXT DEFAULT '', category TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS login_activities (
  id TEXT PRIMARY KEY, property_id TEXT, user TEXT NOT NULL, role TEXT NOT NULL,
  login_time TEXT NOT NULL, logout_time TEXT, device TEXT NOT NULL,
  ip TEXT NOT NULL, location TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS property_documents (
  id TEXT PRIMARY KEY, property_id TEXT, label TEXT NOT NULL,
  hint TEXT DEFAULT '', file_name TEXT, uploaded_on TEXT,
  status TEXT DEFAULT 'Missing'
);
CREATE TABLE IF NOT EXISTS property_leads (
  id TEXT PRIMARY KEY, property_name TEXT NOT NULL, contact_name TEXT NOT NULL,
  mobile TEXT NOT NULL, whatsapp TEXT, email TEXT NOT NULL, city TEXT NOT NULL,
  property_type TEXT NOT NULL, total_rooms INTEGER DEFAULT 0,
  short_stay_interest INTEGER DEFAULT 0, couple_friendly INTEGER DEFAULT 0,
  source TEXT DEFAULT '', comments TEXT DEFAULT '', consent INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
