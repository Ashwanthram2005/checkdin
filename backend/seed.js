#!/usr/bin/env node
"use strict";

const { Pool } = require("pg");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const SCHEMA = path.join(__dirname, "schema.sql");

// ── Seeded PRNG (mulberry32) ──────────────────────────────────────────────
let _seed = 42;
function srand(s) { _seed = s | 0; }
function _next() {
  _seed |= 0; _seed = _seed + 0x6D2B79F5 | 0;
  let t = Math.imul(_seed ^ _seed >>> 15, 1 | _seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function randInt(lo, hi) { return lo + Math.floor(_next() * (hi - lo + 1)); }
function randChoice(arr) { return arr[randInt(0, arr.length - 1)]; }
function randFloat(lo, hi) { return lo + _next() * (hi - lo); }

// ── Helpers ───────────────────────────────────────────────────────────────
function sha256(t) { return crypto.createHash("sha256").update(t).digest("hex"); }
function ts(y, m, d, h, mi) {
  h = h === undefined ? 10 : h;
  mi = mi === undefined ? 0 : mi;
  const pad = (n) => String(n).padStart(2, "0");
  return `${y}-${pad(m)}-${pad(d)}T${pad(h)}:${pad(mi)}:00`;
}

// ── Seeding functions ─────────────────────────────────────────────────────

async function seedAdminUsers(c) {
  const rows = [
    ["au1","Super Admin","superadmin@checkdin.com","Super@123","superadmin","Super Admin"],
    ["au2","Operations Head","operations@checkdin.com","Ops@123","operations","Operations Head"],
    ["au3","Finance Manager","finance@checkdin.com","Finance@123","finance","Finance Manager"],
    ["au4","Support Lead","support@checkdin.com","Support@123","support","Support Lead"],
    ["au5","Marketing Head","marketing@checkdin.com","Marketing@123","marketing","Marketing Head"],
  ];
  for (const [id, name, email, pw, role, roleName] of rows) {
    await c.query(
      `INSERT INTO admin_users (id,name,email,password_hash,role,role_name,status,two_factor,last_active,created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id, name, email, sha256(pw), role, roleName, "Active", 0, ts(2025,1,1), ts(2025,7,1)]
    );
  }
}

async function seedPartners(c) {
  const banks = ["HDFC","ICICI","SBI","Axis","Kotak"];
  const data = [
    ["p1","Rajesh Mehta","Mehta Hospitality","rajesh@mehta.in","+919876543210","Chennai",3],
    ["p2","Priya Sharma","Sharma Stays","priya@sharma.in","+919876543211","Bangalore",2],
    ["p3","Arjun Reddy","Reddy Hotels","arjun@reddy.in","+919876543212","Hyderabad",2],
    ["p4","Vikram Patel","Patel Resorts","vikram@patel.in","+919876543213","Chennai",1],
    ["p5","Sneha Nair","Nair Stays","sneha@nair.in","+919876543214","Bangalore",1],
    ["p6","Karthik Iyer","Iyer Hotels","karthik@iyer.in","+919876543215","Hyderabad",1],
    ["p7","Divya Gupta","Gupta Lodges","divya@gupta.in","+919876543216","Chennai",1],
    ["p8","Suresh Kumar","Kumar Inn","suresh@kumar.in","+919876543217","Bangalore",1],
    ["p9","Ananya Das","Das Collection","ananya@das.in","+919876543218","Hyderabad",1],
  ];
  for (let i = 0; i < data.length; i++) {
    const [pid, name, co, email, phone, city, np] = data[i];
    const revenue = Math.round(randFloat(50000, 500000) * 100) / 100;
    const commRate = randChoice([12,15,18,20]);
    const joinedAt = ts(2025, 1, 15 + i);
    const pan = `ABCPM${randInt(1000,9999)}${String.fromCharCode(65 + i)}`;
    const gst = `22AAAAA${randInt(100,999)}A1Z`;
    const acctNum = String(randInt(1e9, 1e10 - 1));
    const ifsc = `HDFC0${randInt(1000,9999)}`;
    await c.query(
      `INSERT INTO partners (id,name,company,email,phone,city,properties,revenue,commission_rate,status,joined_at,kyc_pan,kyc_gst,kyc_pan_status,kyc_gst_status,kyc_bank_name,kyc_account_number,kyc_ifsc,kyc_bank_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
      [pid, name, co, email, phone, city, np, revenue, commRate, "Active", joinedAt, pan, gst, "Verified", "Verified", banks[i % 5], acctNum, ifsc, "Verified"]
    );
  }
}

async function seedProperties(c) {
  const props = [
    ["pr1","CheckDin Empire","Chennai","Tamil Nadu","123 Anna Salai, T Nagar","p1","Mehta Hospitality",25,78.5,4.3,128,245000,"Hotel",ts(2025,2,1)],
    ["pr2","CheckDin Royal","Chennai","Tamil Nadu","45 GN Chetty Road","p1","Mehta Hospitality",20,82.1,4.5,95,189000,"Hotel",ts(2025,3,10)],
    ["pr3","CheckDin Comforts","Chennai","Tamil Nadu","78 Velachery Main Road","p1","Mehta Hospitality",15,65.3,4.1,67,98000,"Hotel",ts(2025,4,5)],
    ["pr4","CheckDin Pearl","Bangalore","Karnataka","56 MG Road","p2","Sharma Stays",30,85.2,4.6,210,345000,"Hotel",ts(2025,2,20)],
    ["pr5","CheckDin Suites","Bangalore","Karnataka","89 Koramangala 5th Block","p2","Sharma Stays",22,72.4,4.2,156,210000,"Hotel",ts(2025,3,15)],
    ["pr6","CheckDin Grand","Hyderabad","Telangana","34 Banjara Hills Road 12","p3","Reddy Hotels",28,88.7,4.7,189,312000,"Hotel",ts(2025,2,25)],
    ["pr7","CheckDin Residency","Hyderabad","Telangana","67 Ameerpet Main Road","p3","Reddy Hotels",18,69.8,4.0,88,124000,"Hotel",ts(2025,4,10)],
    ["pr8","CheckDin Beachview","Chennai","Tamil Nadu","12 Elliot Beach Road","p4","Patel Resorts",12,91.2,4.8,234,278000,"Resort",ts(2025,3,1)],
    ["pr9","CheckDin Metro","Bangalore","Karnataka","23 Whitefield Main Road","p5","Nair Stays",16,58.9,3.9,72,89000,"Hotel",ts(2025,5,1)],
    ["pr10","CheckDin City","Hyderabad","Telangana","45 Secunderabad Station Road","p6","Iyer Hotels",14,63.5,4.1,91,112000,"Hotel",ts(2025,5,15)],
  ];
  for (const p of props) {
    const amenities = JSON.stringify(["WiFi","AC","Room Service","TV","Parking"]);
    const images = JSON.stringify([`https://images.checkdin.com/${p[0]}/1.jpg`]);
    const docs = JSON.stringify(["Registration Certificate"]);
    await c.query(
      `INSERT INTO properties (id,name,city,state,address,partner_id,partner_name,rooms,occupancy,rating,reviews,revenue,status,type,amenities,images,documents,onboarded_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      [p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7],p[8],p[9],p[10],p[11],"Active",p[12],amenities,images,docs,p[13]]
    );
  }
}

async function seedRooms(c) {
  const rooms = [
    ["r1","EM-101","pr1","CheckDin Empire","Deluxe Room 101","Deluxe",2,2500,"Available",1],
    ["r2","EM-102","pr1","CheckDin Empire","Deluxe Room 102","Deluxe",2,2500,"Occupied",1],
    ["r3","EM-201","pr1","CheckDin Empire","Premium Suite 201","Suite",3,4500,"Available",2],
    ["r4","EM-202","pr1","CheckDin Empire","Premium Suite 202","Suite",3,4500,"Available",2],
    ["r29","EM-301","pr1","CheckDin Empire","Economy Room 301","Economy",2,1800,"Available",3],
    ["r30","EM-302","pr1","CheckDin Empire","Economy Room 302","Economy",2,1800,"Available",3],
    ["r5","RY-101","pr2","CheckDin Royal","Classic Room 101","Classic",2,2000,"Available",1],
    ["r6","RY-102","pr2","CheckDin Royal","Classic Room 102","Classic",2,2000,"Maintenance",1],
    ["r7","RY-201","pr2","CheckDin Royal","Royal Suite 201","Suite",4,5500,"Available",2],
    ["r8","CF-101","pr3","CheckDin Comforts","Standard Room 101","Standard",2,1500,"Available",1],
    ["r9","CF-102","pr3","CheckDin Comforts","Standard Room 102","Standard",2,1500,"Occupied",1],
    ["r10","PL-101","pr4","CheckDin Pearl","Pearl Room 101","Deluxe",2,3000,"Available",1],
    ["r11","PL-102","pr4","CheckDin Pearl","Pearl Room 102","Deluxe",2,3000,"Available",1],
    ["r12","PL-201","pr4","CheckDin Pearl","Pearl Suite 201","Suite",3,5000,"Occupied",2],
    ["r13","PL-202","pr4","CheckDin Pearl","Pearl Suite 202","Suite",3,5000,"Available",2],
    ["r14","ST-101","pr5","CheckDin Suites","Suite Room 101","Suite",2,3500,"Available",1],
    ["r15","ST-102","pr5","CheckDin Suites","Suite Room 102","Suite",2,3500,"Available",1],
    ["r16","GR-101","pr6","CheckDin Grand","Grand Room 101","Deluxe",2,3800,"Available",1],
    ["r17","GR-102","pr6","CheckDin Grand","Grand Room 102","Deluxe",2,3800,"Occupied",1],
    ["r18","GR-201","pr6","CheckDin Grand","Grand Suite 201","Suite",3,6000,"Available",2],
    ["r19","GR-202","pr6","CheckDin Grand","Grand Suite 202","Suite",3,6000,"Available",2],
    ["r20","RS-101","pr7","CheckDin Residency","Residency Room 101","Standard",2,1800,"Available",1],
    ["r21","RS-102","pr7","CheckDin Residency","Residency Room 102","Standard",2,1800,"Available",1],
    ["r22","BV-101","pr8","CheckDin Beachview","Beach Room 101","Deluxe",2,4000,"Available",1],
    ["r23","BV-102","pr8","CheckDin Beachview","Beach Room 102","Deluxe",2,4000,"Occupied",1],
    ["r24","BV-201","pr8","CheckDin Beachview","Beach Suite 201","Suite",3,6500,"Available",2],
    ["r25","MT-101","pr9","CheckDin Metro","Metro Room 101","Standard",2,1600,"Available",1],
    ["r26","MT-102","pr9","CheckDin Metro","Metro Room 102","Standard",2,1600,"Available",1],
    ["r27","CT-101","pr10","CheckDin City","City Room 101","Classic",2,1700,"Available",1],
    ["r28","CT-102","pr10","CheckDin City","City Room 102","Classic",2,1700,"Occupied",1],
  ];
  for (const r of rooms) {
    await c.query(
      `INSERT INTO rooms (id,code,property_id,property_name,name,type,capacity,base_rate,status,floor,next_check_in)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [...r, null]
    );
  }
}

async function seedCustomers(c) {
  const rows = [
    ["c1","Arun Vijay","arun@gmail.com","+919000000001","Chennai",8,32000,1,"Active",1,ts(2025,1,20),ts(2025,7,4),"Male","Vijay","+919000000011","Father"],
    ["c2","Meena Kumari","meena@gmail.com","+919000000002","Bangalore",12,56000,0,"Active",1,ts(2025,2,5),ts(2025,5,24),"Female","Kumar","+919000000012","Husband"],
    ["c3","Ravi Teja","ravi@yahoo.com","+919000000003","Hyderabad",5,18500,2,"Active",1,ts(2025,3,1),ts(2025,6,8),"Male","Teja","+919000000013","Father"],
    ["c4","Priyanka Das","priyanka@outlook.com","+919000000004","Chennai",3,12000,0,"Active",1,ts(2025,3,15),ts(2025,5,5),"Female","Das","+919000000014","Brother"],
    ["c5","Sanjay Rao","sanjay@gmail.com","+919000000005","Mumbai",7,28000,1,"Active",1,ts(2025,2,20),ts(2025,7,4),"Male","Rao","+919000000015","Father"],
    ["c6","Lakshmi Devi","lakshmi@gmail.com","+919000000006","Chennai",2,8500,0,"Active",0,ts(2025,4,1),ts(2025,7,24),"Female","Devi","+919000000016","Husband"],
    ["c7","Mohammed Ali","ali@hotmail.com","+919000000007","Delhi",15,72000,3,"Active",1,ts(2025,1,10),ts(2025,7,3),"Male","Hussain","+919000000017","Father"],
    ["c8","Deepa Nair","deepa@gmail.com","+919000000008","Bangalore",4,16000,0,"Active",1,ts(2025,5,1),ts(2025,7,14),"Female","Nair","+919000000018","Husband"],
    ["c9","Karthik Menon","karthik@rediffmail.com","+919000000009","Kochi",1,3500,1,"Inactive",0,ts(2025,6,1),null,"Male","Menon","+919000000019","Father"],
    ["c10","Anjali Sharma","anjali@gmail.com","+919000000010","Pune",6,24000,0,"Active",1,ts(2025,3,20),ts(2025,5,1),"Female","Sharma","+919000000020","Husband"],
    ["c11","Vignesh Raj","vignesh@gmail.com","+919000000021","Chennai",0,0,0,"Active",0,ts(2025,7,1),null,"Male","Raj","+919000000021","Father"],
    ["c12","Pradeep Singh","pradeep@outlook.com","+919000000022","Hyderabad",9,41000,2,"Blocked",1,ts(2025,2,1),ts(2025,5,7),"Male","Singh","+919000000022","Brother"],
  ];
  for (const x of rows) {
    const pwHash = sha256("password123");
    // x = [id,name,email,phone,city,bookings,spend,cancellations,status,verified,joined_at,last_booking_at,gender,emergency_name,emergency_phone,emergency_relation]
    await c.query(
      `INSERT INTO customers (id,name,email,phone,city,bookings,spend,cancellations,status,verified,joined_at,last_booking_at,password_hash,gender,emergency_name,emergency_phone,emergency_relation)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
      [x[0],x[1],x[2],x[3],x[4],x[5],x[6],x[7],x[8],x[9],x[10],x[11],pwHash,x[12],x[13],x[14],x[15]]
    );
  }
}

async function seedBookings(c) {
  const st = ["Confirmed","Completed","Cancelled","Pending","Checked-In","Checked-Out"];
  const sr = ["Website","App","Walk-in","Phone","OTA-Goibibo","OTA-MakeMyTrip"];
  const nm = ["Arun Vijay","Meena Kumari","Ravi Teja","Priyanka Das","Sanjay Rao","Mohammed Ali","Deepa Nair","Anjali Sharma"];
  const em = ["arun@gmail.com","meena@gmail.com","ravi@yahoo.com","priyanka@outlook.com","sanjay@gmail.com","ali@hotmail.com","deepa@gmail.com","anjali@gmail.com"];
  const ht = ["CheckDin Empire","CheckDin Royal","CheckDin Grand","CheckDin Pearl","CheckDin Comforts","CheckDin Suites","CheckDin Beachview"];
  const rm = ["Deluxe","Suite","Standard","Classic","Economy"];
  const tl = JSON.stringify([{action:"Created",time:ts(2025,7,1,10),by:"System"}]);
  const SQL = `INSERT INTO bookings (id,code,customer_id,customer_name,customer_email,customer_phone,property_id,property_name,city,room_name,room_type,check_in,check_out,nights,guests,amount,tax,commission,status,payment_method,payment_status,transaction_id,source,created_at,timeline,duration,slot_time,otp,rated,hotel_id,base_amount,gst_amount,total,payment_method_type,id_proof,special_requests,internal_note,approval_seconds,booked_on,check_in_time,check_out_time,adults,children) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43)`;

  for (let i = 1; i <= 30; i++) {
    const ni = i - 1;
    const amt = randInt(2000, 15000);
    const mo = randChoice([6, 7]);
    const day = randInt(1, 28);
    const hour = randInt(8, 14);
    const ci = ts(2025, mo, day, hour);
    // parse ci to compute co
    const ciDate = new Date(ci);
    ciDate.setDate(ciDate.getDate() + randInt(1, 3));
    const coPad = (n) => String(n).padStart(2, "0");
    const co = `${ciDate.getFullYear()}-${coPad(ciDate.getMonth()+1)}-${coPad(ciDate.getDate())}T${coPad(ciDate.getHours())}:${coPad(ciDate.getMinutes())}:00`;

    await c.query(SQL, [
      `bk${i}`, `CHK${1000+i}`, `c${randInt(1,12)}`,
      nm[ni % nm.length], em[ni % em.length], "+919000000001",
      `pr${randInt(1,10)}`, ht[ni % ht.length], "Chennai",
      `Room ${randInt(101,302)}`, rm[ni % rm.length],
      ci, co, randInt(1,3), randInt(1,3),
      amt, Math.round(amt * 0.12), Math.round(amt * 0.15), randChoice(st),
      randChoice(["Online","Cash","UPI"]), "Paid",
      `TXN${randInt(100000,999999)}`, randChoice(sr),
      ci, tl, randChoice([3,6,12]), `${randInt(10,22)}:00`,
      `${randInt(1000,9999)}`, randChoice([0,1,1]),
      `pr${randInt(1,10)}`, amt, Math.round(amt * 0.12), Math.round(amt * 1.12),
      randChoice(["Online","Cash","UPI"]), "Aadhaar", "", "", 0, ci,
      null, null, randInt(1,2), 0
    ]);
  }
}

async function seedPayouts(c) {
  const pnames = ["Mehta Hospitality","Sharma Stays","Reddy Hotels","Patel Resorts","Nair Stays","Iyer Hotels","Gupta Lodges","Kumar Inn","Das Collection"];
  for (let i = 1; i <= 12; i++) {
    const g = Math.round(randFloat(5000, 50000) * 100) / 100;
    const cm = Math.round(g * 0.15 * 100) / 100;
    const tx = Math.round(cm * 0.18 * 100) / 100;
    const n = Math.round((g - cm - tx) * 100) / 100;
    const pi = randInt(0, 8);
    const ut = _next() > 0.3 ? `UTR${randInt(1e11, 1e12 - 1)}` : null;
    await c.query(
      `INSERT INTO payouts (id,reference,partner_id,partner_name,period,gross,commission,tax,net,status,requested_at,utr,bookings,stage,note)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        `pay${i}`, `PAY-2025${String(i).padStart(3,"0")}`, `p${pi+1}`, pnames[pi],
        randChoice(["Jun 2025","Jul 2025"]), g, cm, tx, n,
        randChoice(["Pending","Processed","Paid"]),
        ts(2025, randChoice([6,7]), randInt(1, 28)),
        ut, randInt(5, 25),
        randChoice(["Pending","Processing","Settled"]), null
      ]
    );
  }
}

async function seedRefunds(c) {
  for (let i = 1; i <= 10; i++) {
    await c.query(
      `INSERT INTO refunds (id,reference,booking_code,customer_name,property_name,booking_amount,refund_amount,type,reason,status,requested_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        `rf${i}`, `REF-2025${String(i).padStart(3,"0")}`,
        `CHK${randInt(1001,1030)}`,
        randChoice(["Arun Vijay","Meena Kumari","Ravi Teja","Sanjay Rao"]),
        `CheckDin ${randChoice(["Empire","Royal","Grand"])}`,
        randInt(3000, 12000), randInt(1000, 8000),
        randChoice(["Full","Partial","Cancellation"]),
        randChoice(["Guest cancellation","Property issue","Duplicate charge","No show"]),
        randChoice(["Requested","Approved","Processed","Rejected"]),
        ts(2025, randChoice([6,7]), randInt(1, 28))
      ]
    );
  }
}

async function seedReviews(c) {
  const ti = ["Great stay!","Excellent service","Average experience","Very comfortable","Would recommend","Needs improvement","Perfect location","Value for money"];
  const bo = [
    "Had a wonderful experience. Staff was very cooperative.",
    "Room was clean and well-maintained. Will visit again.",
    "Location is great but room service could be better.",
    "Loved the ambiance and food quality.",
    "Check-in was smooth. Checkout was quick.",
    "Not bad for the price. Basic amenities available.",
    "Best hotel in the area. Highly recommended.",
    "Good stay but WiFi was slow."
  ];
  const na = ["Arun Vijay","Meena Kumari","Ravi Teja","Priyanka Das","Deepa Nair"];
  for (let i = 1; i <= 8; i++) {
    const categories = JSON.stringify({
      cleanliness: randInt(3,5),
      service: randInt(3,5),
      value: randInt(3,5)
    });
    const resp = _next() > 0.5 ? null : "Thank you for your feedback!";
    const tags = JSON.stringify(["Clean","Friendly staff"]);
    await c.query(
      `INSERT INTO reviews (id,property_id,property_name,customer_name,rating,title,body,created_at,status,response,room,duration,stayed_on,categories,image,guest_stars,guest_tags,replied_on)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      [
        `rev${i}`, `pr${randInt(1,10)}`,
        `CheckDin ${randChoice(["Empire","Royal","Grand","Pearl","Comforts"])}`,
        na[(i-1) % na.length], randChoice([3,4,4,5,5]),
        ti[i-1], bo[i-1],
        ts(2025, randChoice([5,6,7]), randInt(1, 28)),
        randChoice(["Published","Published","Pending"]),
        resp,
        `Room ${randInt(101,302)}`, randChoice([3,6,12]),
        ts(2025, randChoice([5,6,7]), randInt(1, 28)),
        categories, null, randInt(4,5),
        tags, null
      ]
    );
  }
}

async function seedTickets(c) {
  const su = ["Booking modification request","Refund not received","Room not clean","Check-in OTP issue","Partner payout delay","Customer complaint escalation"];
  const ca = ["Booking","Refund","Property","Technical","Finance","Escalation"];
  for (let i = 1; i <= 6; i++) {
    const cr = ts(2025, randChoice([6,7]), randInt(1, 28));
    const msgs = JSON.stringify([{from:"Customer",msg:"Please help with this issue.",time:cr}]);
    await c.query(
      `INSERT INTO tickets (id,reference,subject,requester,requester_type,category,priority,status,agent,created_at,updated_at,messages)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        `tk${i}`, `TKT-2025${String(i).padStart(3,"0")}`, su[i-1],
        randChoice(["Arun Vijay","Rajesh Mehta","Meena Kumari"]),
        randChoice(["Customer","Partner"]), ca[i-1],
        randChoice(["Low","Medium","High","Critical"]),
        randChoice(["Open","In-Progress","Resolved","Closed"]),
        randChoice(["Agent Priya","Agent Rahul","Agent Neha"]),
        cr, cr, msgs
      ]
    );
  }
}

async function seedCoupons(c) {
  const rows = [
    ["cp1","WELCOME10","10% off on first booking","Percentage",10,1000,500,45,100],
    ["cp2","FLAT500","Flat 500 off","Flat",500,2000,500,32,80],
    ["cp3","WEEKEND20","20% off on weekends","Percentage",20,1500,800,18,50],
    ["cp4","SUMMER30","30% summer special","Percentage",30,2000,1000,25,60],
    ["cp5","LOYALTY15","15% loyalty discount","Percentage",15,1000,400,55,200],
  ];
  for (const x of rows) {
    await c.query(
      `INSERT INTO coupons (id,code,description,type,value,min_booking,max_discount,used,coupon_limit,valid_from,valid_to,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [...x, ts(2025,1,1), ts(2025,12,31), "Active"]
    );
  }
}

async function seedCampaigns(c) {
  const rows = [
    ["cm1","Summer Sale Blast","Email","All Customers",5000,4800,3200,"Sent",ts(2025,4,1)],
    ["cm2","Monsoon Getaway","SMS","Active Customers",3000,2900,1800,"Sent",ts(2025,6,15)],
    ["cm3","Weekend Deals Push","Push","Lapsed Users",2000,1900,950,"Sent",ts(2025,7,1)],
    ["cm4","Partner Onboarding Drive","Email","Potential Partners",500,480,200,"Draft",null],
    ["cm5","Festival Special 2025","WhatsApp","All Customers",4000,3800,2500,"Scheduled",ts(2025,10,15)],
  ];
  for (const x of rows) {
    await c.query(
      `INSERT INTO campaigns (id,title,channel,audience,sent,delivered,opened,status,scheduled_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      x
    );
  }
}

async function seedAuditLogs(c) {
  const ac = ["superadmin@checkdin.com","operations@checkdin.com","finance@checkdin.com","support@checkdin.com","marketing@checkdin.com"];
  const rl = ["superadmin","operations","finance","support","marketing"];
  const at = ["User Login","Booking Approved","Payout Processed","Refund Approved","Property Updated","Room Status Changed","Coupon Created","Review Moderated"];
  const tg = [
    ...Array.from({length:10}, (_, i) => `pr${i+1}`),
    ...Array.from({length:10}, (_, i) => `bk${i+1}`),
    ...Array.from({length:9}, (_, i) => `p${i+1}`)
  ];
  const ca = ["Auth","Booking","Finance","Finance","Property","Room","Marketing","Content"];
  for (let i = 1; i <= 42; i++) {
    const idx = (i-1) % ac.length;
    const aidx = (i-1) % at.length;
    await c.query(
      `INSERT INTO audit_logs (id,actor,role,action,category,target,ip,at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        `al${i}`, ac[idx], rl[idx], at[aidx], ca[aidx % ca.length],
        randChoice(tg), `10.0.${randInt(1,254)}.${randInt(1,254)}`,
        ts(2025, randChoice([5,6,7]), randInt(1, 28), randInt(8, 22))
      ]
    );
  }
}

async function seedFraudAlerts(c) {
  const rows = [
    ["fa1","FA-001","Duplicate Payment","Multiple bookings from same IP",78,"192.168.1.105 made 3 bookings in 5 mins",12000,"Open",ts(2025,7,10,14,30)],
    ["fa2","FA-002","Suspicious Cancellation","Rapid book-cancel pattern",65,"Customer c7 cancelled 3 bookings in 2 days",8500,"Reviewed",ts(2025,7,12,9,15)],
    ["fa3","FA-003","Refund Abuse","Multiple refund requests same booking",82,"Customer c12 requested refund twice for CHK1005",5500,"Open",ts(2025,7,15,11,45)],
    ["fa4","FA-004","Fake Review","Review from non-booked customer",45,"Review from unknown user for pr3",0,"Resolved",ts(2025,6,28,16,20)],
    ["fa5","FA-005","Bot Booking","Automated booking pattern detected",91,"10 bookings from same fingerprint in 1 min",42000,"Open",ts(2025,7,20,8,0)],
    ["fa6","FA-006","Price Manipulation","Partner altering rates mid-booking",58,"pr6 rate changed 3 times in 1 hour",0,"Reviewed",ts(2025,7,18,13,10)],
  ];
  for (const x of rows) {
    await c.query(
      `INSERT INTO fraud_alerts (id,reference,type,subject,risk_score,detail,amount,status,detected_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      x
    );
  }
}

async function seedPricingRules(c) {
  const rows = [
    ["pr1","Weekend Surge","Property","Saturday-Sunday","+15%","All","Active",ts(2025,5,1)],
    ["pr2","Festival Premium","All","Diwali Season","+25%","All","Active",ts(2025,6,1)],
    ["pr3","Early Bird Discount","All","7+ days advance","-10%","All","Active",ts(2025,5,15)],
    ["pr4","Last Minute Deal","All","Same day check-in","-20%","App","Active",ts(2025,6,15)],
    ["pr5","Loyalty Reward","All","Repeat customer","-5%","All","Active",ts(2025,7,1)],
  ];
  for (const x of rows) {
    await c.query(
      `INSERT INTO pricing_rules (id,name,scope,trigger,adjustment,channel,status,updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      x
    );
  }
}

async function seedHotels(c) {
  const hotelsData = [
    ["h1","The Grand Chennai","Porur","Chennai","porur_hotel1.jpg",4.2,134,"Porur Lake",3.5,"WiFi|AC|Parking|Room Service","Free WiFi, AC, Parking",1,1,1,0,0,"","Premium",4,"00:00",850,1200,2200,"","p1"],
    ["h2","Sakthi Residency","Virugambakkam","Chennai","virugambakkam_hotel1.jpg",4.0,98,"Vadapalani Temple",2.1,"WiFi|AC|TV|Room Service","Free WiFi, AC, TV",1,1,1,0,0,"","Budget",3,"00:00",750,1050,1900,"","p1"],
    ["h3","Royal Inn Chennai","Nungambakkam","Chennai","nungambakkam_hotel1.jpg",4.3,167,"Nungambakkam High Road",1.8,"WiFi|AC|Gym|Spa|Room Service","Free WiFi, AC, Gym, Spa",1,1,0,0,1,"","Premium",5,"00:00",950,1400,2500,"","p1"],
    ["h4","Comfort Stay","Adyar","Chennai","adyar_hotel1.jpg",4.1,112,"Adyar Theosophical Society",4.2,"WiFi|AC|Parking","Free WiFi, AC, Parking",1,1,1,0,0,"","Mid-Range",2,"00:00",800,1100,2000,"","p1"],
    ["h5","City Lodge","T. Nagar","Chennai","tnagar_hotel1.jpg",3.9,76,"Pondy Bazaar",0.8,"WiFi|AC|TV","Free WiFi, AC, TV",1,0,1,0,0,"","Budget",6,"00:00",700,1000,1800,"","p1"],
    ["h6","Pearl Residency","Anna Nagar","Chennai","annanagar_hotel1.jpg",4.4,189,"Anna Nagar Tower Park",5.1,"WiFi|AC|Pool|Gym|Room Service","Free WiFi, AC, Pool, Gym",1,1,0,0,1,"","Premium",3,"00:00",1000,1500,2700,"","p1"],
    ["h7","Budget Inn Chennai","Tambaram","Chennai","tambaram_hotel1.jpg",3.8,54,"Tambaram Bus Stand",12.0,"WiFi|AC","Free WiFi, AC",1,1,1,1,0,"","Budget",8,"00:00",600,850,1500,"","p1"],
    ["h8","Chennai Comforts","Sholinganallur","Chennai","sholinganallur_hotel1.jpg",4.0,87,"OMR IT Corridor",15.2,"WiFi|AC|Parking|Room Service","Free WiFi, AC, Parking",1,1,1,0,0,"","Mid-Range",4,"00:00",850,1200,2100,"","p1"],
    ["h9","The Grand Inn","Chromepet","Chennai","chromepet_hotel1.jpg",4.1,103,"Chromepet Junction",10.5,"WiFi|AC|TV|Room Service","Free WiFi, AC, TV",1,1,1,0,0,"","Mid-Range",5,"00:00",750,1050,1900,"","p1"],
    ["h10","Royal Stay Chennai","Velachery","Chennai","velachery_hotel1.jpg",4.3,156,"Velachery Bus Depot",8.3,"WiFi|AC|Gym|Parking|Room Service","Free WiFi, AC, Gym, Parking",1,1,0,0,1,"","Premium",3,"00:00",900,1300,2300,"","p1"],
    ["h11","Sunrise Hotel","Guindy","Chennai","guindy_hotel1.jpg",4.0,91,"Guindy National Park",7.0,"WiFi|AC|Parking","Free WiFi, AC, Parking",1,1,1,0,0,"","Mid-Range",6,"00:00",800,1100,2000,"","p1"],
    ["h12","Comfort Homes","Pallavaram","Chennai","pallavaram_hotel1.jpg",3.9,68,"Pallavaram Market",11.2,"WiFi|AC","Free WiFi, AC",1,0,1,1,0,"","Budget",7,"00:00",650,900,1600,"","p1"],
    ["h13","Metro Lodge Chennai","Mylapore","Chennai","mylapore_hotel1.jpg",4.2,121,"Kapaleeshwarar Temple",1.5,"WiFi|AC|TV|Room Service","Free WiFi, AC, TV",1,1,0,0,0,"","Mid-Range",4,"00:00",900,1300,2300,"","p1"],
    ["h14","Green Park Hotel","Thiruvanmiyur","Chennai","thiruvanmiyur_hotel1.jpg",4.1,97,"Marina Beach",6.8,"WiFi|AC|Pool|Parking","Free WiFi, AC, Pool",1,1,1,0,0,"","Premium",5,"00:00",850,1200,2100,"","p1"],
    ["h15","City Center Stay","Egmore","Chennai","egmore_hotel1.jpg",4.0,108,"Egmore Museum",2.3,"WiFi|AC|Room Service","Free WiFi, AC",1,1,0,0,0,"","Mid-Range",3,"00:00",800,1100,2000,"","p1"],
    ["h16","Harbour View Hotel","Mylapore","Chennai","mylapore_hotel2.jpg",4.3,145,"Santhome Cathedral",3.0,"WiFi|AC|Gym|Spa|Room Service","Free WiFi, AC, Gym, Spa",1,1,0,0,1,"","Premium",2,"00:00",950,1400,2500,"","p1"],
    ["h17","Airport Rest","Meenambakkam","Chennai","meenambakkam_hotel1.jpg",3.7,42,"Chennai Airport",5.5,"WiFi|AC|Parking","Free WiFi, AC, Parking",1,1,1,0,0,"","Budget",9,"00:00",600,850,1500,"","p1"],
  ];
  for (const h of hotelsData) {
    const amenities = JSON.stringify(h[9].split("|"));
    await c.query(
      `INSERT INTO hotels (id,name,area,city,image,rating,reviews_count,landmark,distance_km,intents,amenities,couple_friendly,local_id_accepted,instant_confirm,pay_at_hotel,business_friendly,chain,collection,slots_left,earliest_slot,rate_3h,rate_6h,rate_12h,about,policies,partner_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)`,
      [
        h[0],h[1],h[2],h[3],h[4],h[5],h[6],h[7],h[8],
        "[]",amenities,h[11],h[12],h[13],h[14],h[15],
        h[16],h[17],h[18],h[19],h[20],h[21],h[22],h[10],"[]",h[23]
      ]
    );
  }
}

async function seedCustomerBookings(c) {
  for (let i = 1; i <= 5; i++) {
    await c.query(
      `INSERT INTO customer_bookings (id,reference,hotel_id,date,check_in,duration,guests,amount,status,otp,rated,customer_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        `cb${i}`, `CBK-2025${String(i).padStart(4,"0")}`, `h${randInt(1,17)}`,
        ts(2025, randChoice([7,8]), randInt(1, 28)),
        `${randInt(10,22)}:00`, randChoice([3,6,12]),
        randInt(1,3), randInt(800, 3000),
        randChoice(["ongoing","completed","cancelled"]),
        `${randInt(1000,9999)}`, randChoice([null,0,1]),
        `c${randInt(1,12)}`
      ]
    );
  }
}

async function seedPartnerRoles(c) {
  const rows = [
    ["prole1","Owner","High",1,"Full access to all hotel operations",JSON.stringify(["all"])],
    ["prole2","Manager","Medium",0,"Manage daily operations and staff",JSON.stringify(["bookings","rooms","staff","reports"])],
    ["prole3","Receptionist","Low",0,"Handle check-in/check-out and guest queries",JSON.stringify(["bookings","checkin","checkout"])],
    ["prole4","Housekeeping","Low",0,"Manage room cleaning and maintenance",JSON.stringify(["rooms","maintenance"])],
    ["prole5","Night Auditor","Medium",0,"Overnight operations and report generation",JSON.stringify(["bookings","reports","finance"])],
  ];
  for (const x of rows) {
    await c.query(
      `INSERT INTO partner_roles (id,name,level,system,description,permissions)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      x
    );
  }
}

async function seedPartnerUsers(c) {
  await c.query(
    `INSERT INTO partner_users (id,hotel_id,name,role_id,password_hash,phone,active,last_login)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    ["pu1","CHK-EMPIRE-017","Empire Admin","prole1",sha256("1234"),"+919876543210",1,ts(2025,7,20)]
  );
}

async function seedSettings(c) {
  const rows = [
    ["site_name", "CheckDin"],
    ["currency", "INR"],
    ["tax_rate", "18"],
    ["commission_rate", "15"],
    ["min_booking_amount", "100"],
    ["support_email", "support@checkdin.com"],
    ["maintenance_mode", "false"],
    ["default_checkin", "14:00"],
    ["default_checkout", "11:00"],
    ["timezone", "Asia/Kolkata"],
  ];
  for (const [key, value] of rows) {
    await c.query("INSERT INTO settings (key,value,updated_at) VALUES ($1,$2,$3)", [key, value, ts(2025,7,1)]);
  }
}

async function seedCmsContent(c) {
  const banners = [
    ["cms1","banner","Monsoon Special — 20% off","{\"image\":\"monsoon.jpg\",\"link\":\"/deals\"}",0],
    ["cms2","banner","Weekend Getaway Deals","{\"image\":\"weekend.jpg\",\"link\":\"/weekend\"}",1],
    ["cms3","banner","New Year Celebration Packages","{\"image\":\"newyear.jpg\",\"link\":\"/newyear\"}",2],
  ];
  for (const [id, type, title, data, sort] of banners) {
    await c.query("INSERT INTO cms_content (id,type,title,data,status,sort_order,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [id, type, title, data, "Active", sort, ts(2025,6,1), ts(2025,6,1)]);
  }
  const cities = [
    ["cms10","city","Chennai","{\"seoTitle\":\"Hotels in Chennai by the hour\",\"featured\":true}",3],
    ["cms11","city","Bangalore","{\"seoTitle\":\"Short stay hotels in Bangalore\",\"featured\":true}",4],
    ["cms12","city","Hyderabad","{\"seoTitle\":\"Budget hotels in Hyderabad\",\"featured\":false}",5],
  ];
  for (const [id, type, title, data, sort] of cities) {
    await c.query("INSERT INTO cms_content (id,type,title,data,status,sort_order,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [id, type, title, data, "Active", sort, ts(2025,6,1), ts(2025,6,1)]);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  srand(42);

  console.log("Connecting to PostgreSQL...");
  const pool = new Pool({
    host: process.env.PGHOST || "localhost",
    port: parseInt(process.env.PGPORT, 10) || 5432,
    database: process.env.PGDATABASE || "checkdin",
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    max: 20,
  });

  const client = await pool.connect();
  try {
    console.log("Dropping existing tables...");
    const tableNames = [
      "property_leads","property_documents","login_activities","partner_audit_logs",
      "support_tickets","earnings","day_availability","slot_pricing","room_profiles",
      "partner_users","partner_roles","customer_bookings","hotels",
      "pricing_rules","fraud_alerts","audit_logs","campaigns","coupons",
      "tickets","reviews","refunds","payouts","bookings","customers",
      "rooms","properties","partners","admin_users","settings","cms_content"
    ];
    for (const t of tableNames) {
      await client.query(`DROP TABLE IF EXISTS ${t} CASCADE`);
    }
    console.log("Creating tables...");
    const schema = fs.readFileSync(SCHEMA, "utf8");
    await client.query(schema);

    const seeds = [
      ["admin_users", seedAdminUsers],
      ["partners", seedPartners],
      ["properties", seedProperties],
      ["rooms", seedRooms],
      ["customers", seedCustomers],
      ["bookings", seedBookings],
      ["payouts", seedPayouts],
      ["refunds", seedRefunds],
      ["reviews", seedReviews],
      ["tickets", seedTickets],
      ["coupons", seedCoupons],
      ["campaigns", seedCampaigns],
      ["audit_logs", seedAuditLogs],
      ["fraud_alerts", seedFraudAlerts],
      ["pricing_rules", seedPricingRules],
      ["hotels", seedHotels],
      ["customer_bookings", seedCustomerBookings],
      ["partner_roles", seedPartnerRoles],
      ["partner_users", seedPartnerUsers],
      ["settings", seedSettings],
      ["cms_content", seedCmsContent],
    ];

    for (const [name, fn] of seeds) {
      console.log(`  Seeding ${name}...`);
      await fn(client);
    }

    console.log("Done! Database seeded successfully.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
