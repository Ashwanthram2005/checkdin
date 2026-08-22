#!/usr/bin/env python3
import sqlite3, hashlib, json, random, uuid, os
from datetime import datetime, timedelta

random.seed(42)
DB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database.sqlite")
SCHEMA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "schema.sql")

def sha256(t): return hashlib.sha256(t.encode()).hexdigest()
def ts(y,m,d,h=10,mi=0): return datetime(y,m,d,h,mi).isoformat()

def setup_db():
    if os.path.exists(DB): os.remove(DB)
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    with open(SCHEMA) as f: c.executescript(f.read())
    return conn

def seed_admin_users(c):
    for i,(role,name,pw,email) in enumerate([
        ("superadmin","Super Admin","Super@123","superadmin@checkdin.com"),
        ("operations","Operations Head","Ops@123","operations@checkdin.com"),
        ("finance","Finance Manager","Finance@123","finance@checkdin.com"),
        ("support","Support Lead","Support@123","support@checkdin.com"),
        ("marketing","Marketing Head","Marketing@123","marketing@checkdin.com"),
    ],1):
        c.execute("INSERT INTO admin_users (id,name,email,password_hash,role,role_name,status,two_factor,last_active,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
            (f"au{i}",name,email,sha256(pw),role,name,"Active",0,ts(2025,1,1),ts(2025,7,1)))

def seed_partners(c):
    banks=["HDFC","ICICI","SBI","Axis","Kotak"]
    for i,(pid,name,co,email,phone,city,np) in enumerate([
        ("p1","Rajesh Mehta","Mehta Hospitality","rajesh@mehta.in","+919876543210","Chennai",3),
        ("p2","Priya Sharma","Sharma Stays","priya@sharma.in","+919876543211","Bangalore",2),
        ("p3","Arjun Reddy","Reddy Hotels","arjun@reddy.in","+919876543212","Hyderabad",2),
        ("p4","Vikram Patel","Patel Resorts","vikram@patel.in","+919876543213","Chennai",1),
        ("p5","Sneha Nair","Nair Stays","sneha@nair.in","+919876543214","Bangalore",1),
        ("p6","Karthik Iyer","Iyer Hotels","karthik@iyer.in","+919876543215","Hyderabad",1),
        ("p7","Divya Gupta","Gupta Lodges","divya@gupta.in","+919876543216","Chennai",1),
        ("p8","Suresh Kumar","Kumar Inn","suresh@kumar.in","+919876543217","Bangalore",1),
        ("p9","Ananya Das","Das Collection","ananya@das.in","+919876543218","Hyderabad",1),
    ]):
        c.execute("INSERT INTO partners VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",(
            pid,name,co,email,phone,city,np,
            round(random.uniform(50000,500000),2),
            random.choice([12,15,18,20]),"Active",ts(2025,1,15+i),
            f"ABCPM{random.randint(1000,9999)}{chr(65+i)}",
            f"22AAAAA{random.randint(100,999)}A1Z",
            "Verified","Verified",banks[i%5],
            f"{random.randint(10**9,10**10-1)}",
            f"HDFC0{random.randint(1000,9999)}","Verified"))

def seed_properties(c):
    for p in [
        ("pr1","CheckDin Empire","Chennai","Tamil Nadu","123 Anna Salai, T Nagar","p1","Mehta Hospitality",25,78.5,4.3,128,245000,"Hotel",ts(2025,2,1)),
        ("pr2","CheckDin Royal","Chennai","Tamil Nadu","45 GN Chetty Road","p1","Mehta Hospitality",20,82.1,4.5,95,189000,"Hotel",ts(2025,3,10)),
        ("pr3","CheckDin Comforts","Chennai","Tamil Nadu","78 Velachery Main Road","p1","Mehta Hospitality",15,65.3,4.1,67,98000,"Hotel",ts(2025,4,5)),
        ("pr4","CheckDin Pearl","Bangalore","Karnataka","56 MG Road","p2","Sharma Stays",30,85.2,4.6,210,345000,"Hotel",ts(2025,2,20)),
        ("pr5","CheckDin Suites","Bangalore","Karnataka","89 Koramangala 5th Block","p2","Sharma Stays",22,72.4,4.2,156,210000,"Hotel",ts(2025,3,15)),
        ("pr6","CheckDin Grand","Hyderabad","Telangana","34 Banjara Hills Road 12","p3","Reddy Hotels",28,88.7,4.7,189,312000,"Hotel",ts(2025,2,25)),
        ("pr7","CheckDin Residency","Hyderabad","Telangana","67 Ameerpet Main Road","p3","Reddy Hotels",18,69.8,4.0,88,124000,"Hotel",ts(2025,4,10)),
        ("pr8","CheckDin Beachview","Chennai","Tamil Nadu","12 Elliot Beach Road","p4","Patel Resorts",12,91.2,4.8,234,278000,"Resort",ts(2025,3,1)),
        ("pr9","CheckDin Metro","Bangalore","Karnataka","23 Whitefield Main Road","p5","Nair Stays",16,58.9,3.9,72,89000,"Hotel",ts(2025,5,1)),
        ("pr10","CheckDin City","Hyderabad","Telangana","45 Secunderabad Station Road","p6","Iyer Hotels",14,63.5,4.1,91,112000,"Hotel",ts(2025,5,15)),
    ]:
        a=json.dumps(["WiFi","AC","Room Service","TV","Parking"])
        im=json.dumps([f"https://images.checkdin.com/{p[0]}/1.jpg"])
        dc=json.dumps(["Registration Certificate"])
        c.execute("INSERT INTO properties VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",(*p[:12],"Active",p[12],a,im,dc,p[13]))

def seed_rooms(c):
    for r in [
        ("r1","EM-101","pr1","CheckDin Empire","Deluxe Room 101","Deluxe",2,2500,"Available",1),
        ("r2","EM-102","pr1","CheckDin Empire","Deluxe Room 102","Deluxe",2,2500,"Occupied",1),
        ("r3","EM-201","pr1","CheckDin Empire","Premium Suite 201","Suite",3,4500,"Available",2),
        ("r4","EM-202","pr1","CheckDin Empire","Premium Suite 202","Suite",3,4500,"Available",2),
        ("r29","EM-301","pr1","CheckDin Empire","Economy Room 301","Economy",2,1800,"Available",3),
        ("r30","EM-302","pr1","CheckDin Empire","Economy Room 302","Economy",2,1800,"Available",3),
        ("r5","RY-101","pr2","CheckDin Royal","Classic Room 101","Classic",2,2000,"Available",1),
        ("r6","RY-102","pr2","CheckDin Royal","Classic Room 102","Classic",2,2000,"Maintenance",1),
        ("r7","RY-201","pr2","CheckDin Royal","Royal Suite 201","Suite",4,5500,"Available",2),
        ("r8","CF-101","pr3","CheckDin Comforts","Standard Room 101","Standard",2,1500,"Available",1),
        ("r9","CF-102","pr3","CheckDin Comforts","Standard Room 102","Standard",2,1500,"Occupied",1),
        ("r10","PL-101","pr4","CheckDin Pearl","Pearl Room 101","Deluxe",2,3000,"Available",1),
        ("r11","PL-102","pr4","CheckDin Pearl","Pearl Room 102","Deluxe",2,3000,"Available",1),
        ("r12","PL-201","pr4","CheckDin Pearl","Pearl Suite 201","Suite",3,5000,"Occupied",2),
        ("r13","PL-202","pr4","CheckDin Pearl","Pearl Suite 202","Suite",3,5000,"Available",2),
        ("r14","ST-101","pr5","CheckDin Suites","Suite Room 101","Suite",2,3500,"Available",1),
        ("r15","ST-102","pr5","CheckDin Suites","Suite Room 102","Suite",2,3500,"Available",1),
        ("r16","GR-101","pr6","CheckDin Grand","Grand Room 101","Deluxe",2,3800,"Available",1),
        ("r17","GR-102","pr6","CheckDin Grand","Grand Room 102","Deluxe",2,3800,"Occupied",1),
        ("r18","GR-201","pr6","CheckDin Grand","Grand Suite 201","Suite",3,6000,"Available",2),
        ("r19","GR-202","pr6","CheckDin Grand","Grand Suite 202","Suite",3,6000,"Available",2),
        ("r20","RS-101","pr7","CheckDin Residency","Residency Room 101","Standard",2,1800,"Available",1),
        ("r21","RS-102","pr7","CheckDin Residency","Residency Room 102","Standard",2,1800,"Available",1),
        ("r22","BV-101","pr8","CheckDin Beachview","Beach Room 101","Deluxe",2,4000,"Available",1),
        ("r23","BV-102","pr8","CheckDin Beachview","Beach Room 102","Deluxe",2,4000,"Occupied",1),
        ("r24","BV-201","pr8","CheckDin Beachview","Beach Suite 201","Suite",3,6500,"Available",2),
        ("r25","MT-101","pr9","CheckDin Metro","Metro Room 101","Standard",2,1600,"Available",1),
        ("r26","MT-102","pr9","CheckDin Metro","Metro Room 102","Standard",2,1600,"Available",1),
        ("r27","CT-101","pr10","CheckDin City","City Room 101","Classic",2,1700,"Available",1),
        ("r28","CT-102","pr10","CheckDin City","City Room 102","Classic",2,1700,"Occupied",1),
    ]:
        c.execute("INSERT INTO rooms VALUES (?,?,?,?,?,?,?,?,?,?,?)",(*r,None))

def seed_customers(c):
    for x in [
        ("c1","Arun Vijay","arun@gmail.com","+919000000001","Chennai",8,32000,1,"Active",1,ts(2025,1,20),ts(2025,7,4),sha256("password123"),"Male","Vijay","+919000000011","Father"),
        ("c2","Meena Kumari","meena@gmail.com","+919000000002","Bangalore",12,56000,0,"Active",1,ts(2025,2,5),ts(2025,5,24),sha256("password123"),"Female","Kumar","+919000000012","Husband"),
        ("c3","Ravi Teja","ravi@yahoo.com","+919000000003","Hyderabad",5,18500,2,"Active",1,ts(2025,3,1),ts(2025,6,8),sha256("password123"),"Male","Teja","+919000000013","Father"),
        ("c4","Priyanka Das","priyanka@outlook.com","+919000000004","Chennai",3,12000,0,"Active",1,ts(2025,3,15),ts(2025,5,5),sha256("password123"),"Female","Das","+919000000014","Brother"),
        ("c5","Sanjay Rao","sanjay@gmail.com","+919000000005","Mumbai",7,28000,1,"Active",1,ts(2025,2,20),ts(2025,7,4),sha256("password123"),"Male","Rao","+919000000015","Father"),
        ("c6","Lakshmi Devi","lakshmi@gmail.com","+919000000006","Chennai",2,8500,0,"Active",0,ts(2025,4,1),ts(2025,7,24),sha256("password123"),"Female","Devi","+919000000016","Husband"),
        ("c7","Mohammed Ali","ali@hotmail.com","+919000000007","Delhi",15,72000,3,"Active",1,ts(2025,1,10),ts(2025,7,3),sha256("password123"),"Male","Hussain","+919000000017","Father"),
        ("c8","Deepa Nair","deepa@gmail.com","+919000000008","Bangalore",4,16000,0,"Active",1,ts(2025,5,1),ts(2025,7,14),sha256("password123"),"Female","Nair","+919000000018","Husband"),
        ("c9","Karthik Menon","karthik@rediffmail.com","+919000000009","Kochi",1,3500,1,"Inactive",0,ts(2025,6,1),None,sha256("password123"),"Male","Menon","+919000000019","Father"),
        ("c10","Anjali Sharma","anjali@gmail.com","+919000000010","Pune",6,24000,0,"Active",1,ts(2025,3,20),ts(2025,5,1),sha256("password123"),"Female","Sharma","+919000000020","Husband"),
        ("c11","Vignesh Raj","vignesh@gmail.com","+919000000021","Chennai",0,0,0,"Active",0,ts(2025,7,1),None,sha256("password123"),"Male","Raj","+919000000021","Father"),
        ("c12","Pradeep Singh","pradeep@outlook.com","+919000000022","Hyderabad",9,41000,2,"Blocked",1,ts(2025,2,1),ts(2025,5,7),sha256("password123"),"Male","Singh","+919000000022","Brother"),
    ]:
        c.execute("INSERT INTO customers VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",x)

def seed_bookings(c):
    st=["Confirmed","Completed","Cancelled","Pending","Checked-In","Checked-Out"]
    sr=["Website","App","Walk-in","Phone","OTA-Goibibo","OTA-MakeMyTrip"]
    nm=["Arun Vijay","Meena Kumari","Ravi Teja","Priyanka Das","Sanjay Rao","Mohammed Ali","Deepa Nair","Anjali Sharma"]
    em=["arun@gmail.com","meena@gmail.com","ravi@yahoo.com","priyanka@outlook.com","sanjay@gmail.com","ali@hotmail.com","deepa@gmail.com","anjali@gmail.com"]
    ht=["CheckDin Empire","CheckDin Royal","CheckDin Grand","CheckDin Pearl","CheckDin Comforts","CheckDin Suites","CheckDin Beachview"]
    rm=["Deluxe","Suite","Standard","Classic","Economy"]
    tl=json.dumps([{"action":"Created","time":ts(2025,7,1,10),"by":"System"}])
    SQL="INSERT INTO bookings (id,code,customer_id,customer_name,customer_email,customer_phone,property_id,property_name,city,room_name,room_type,check_in,check_out,nights,guests,amount,tax,commission,status,payment_method,payment_status,transaction_id,source,created_at,timeline,duration,slot_time,otp,rated,hotel_id,base_amount,gst_amount,total,payment_method_type,id_proof,special_requests,internal_note,approval_seconds,booked_on,check_in_time,check_out_time,adults,children) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    for i in range(1,31):
        ni=i-1; amt=random.randint(2000,15000)
        ci=ts(2025,random.choice([6,7]),random.randint(1,28),random.randint(8,14))
        co=(datetime.fromisoformat(ci)+timedelta(days=random.randint(1,3))).isoformat()
        c.execute(SQL,(
            f"bk{i}",f"CHK{1000+i}",f"c{random.randint(1,12)}",
            nm[ni%len(nm)],em[ni%len(em)],"+919000000001",
            f"pr{random.randint(1,10)}",ht[ni%len(ht)],"Chennai",
            f"Room {random.randint(101,302)}",rm[ni%len(rm)],
            ci,co,random.randint(1,3),random.randint(1,3),
            amt,round(amt*0.12),round(amt*0.15),random.choice(st),
            random.choice(["Online","Cash","UPI"]),"Paid",
            f"TXN{random.randint(100000,999999)}",random.choice(sr),
            ci,tl,random.choice([3,6,12]),f"{random.randint(10,22)}:00",
            f"{random.randint(1000,9999)}",random.choice([0,1,1]),
            f"pr{random.randint(1,10)}",amt,round(amt*0.12),round(amt*1.12),
            random.choice(["Online","Cash","UPI"]),"Aadhaar","","",0,ci,
            None,None,random.randint(1,2),0))

def seed_payouts(c):
    pnames=["Mehta Hospitality","Sharma Stays","Reddy Hotels","Patel Resorts","Nair Stays","Iyer Hotels","Gupta Lodges","Kumar Inn","Das Collection"]
    for i in range(1,13):
        g=round(random.uniform(5000,50000),2); cm=round(g*0.15,2); tx=round(cm*0.18,2); n=round(g-cm-tx,2)
        ut=f"UTR{random.randint(10**11,10**12-1)}" if random.random()>0.3 else None
        pi=random.randint(0,8)
        c.execute("INSERT INTO payouts VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",(
            f"pay{i}",f"PAY-2025{i:03d}",f"p{pi+1}",pnames[pi],
            random.choice(["Jun 2025","Jul 2025"]),g,cm,tx,n,
            random.choice(["Pending","Processed","Paid"]),
            ts(2025,random.choice([6,7]),random.randint(1,28)),
            ut,random.randint(5,25),
            random.choice(["Pending","Processing","Settled"]),None))

def seed_refunds(c):
    for i in range(1,11):
        c.execute("INSERT INTO refunds VALUES (?,?,?,?,?,?,?,?,?,?,?)",(
            f"rf{i}",f"REF-2025{i:03d}",f"CHK{random.randint(1001,1030)}",
            random.choice(["Arun Vijay","Meena Kumari","Ravi Teja","Sanjay Rao"]),
            f"CheckDin {random.choice(["Empire","Royal","Grand"])}",
            random.randint(3000,12000),random.randint(1000,8000),
            random.choice(["Full","Partial","Cancellation"]),
            random.choice(["Guest cancellation","Property issue","Duplicate charge","No show"]),
            random.choice(["Requested","Approved","Processed","Rejected"]),
            ts(2025,random.choice([6,7]),random.randint(1,28))))

def seed_reviews(c):
    ti=["Great stay!","Excellent service","Average experience","Very comfortable","Would recommend","Needs improvement","Perfect location","Value for money"]
    bo=["Had a wonderful experience. Staff was very cooperative.","Room was clean and well-maintained. Will visit again.","Location is great but room service could be better.","Loved the ambiance and food quality.","Check-in was smooth. Checkout was quick.","Not bad for the price. Basic amenities available.","Best hotel in the area. Highly recommended.","Good stay but WiFi was slow."]
    na=["Arun Vijay","Meena Kumari","Ravi Teja","Priyanka Das","Deepa Nair"]
    for i in range(1,9):
        cat={x:random.randint(3,5) for x in ["cleanliness","service","value"]}
        c.execute("INSERT INTO reviews VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",(
            f"rev{i}",f"pr{random.randint(1,10)}",
            f"CheckDin {random.choice(['Empire','Royal','Grand','Pearl','Comforts'])}",
            na[(i-1)%len(na)],random.choice([3,4,4,5,5]),
            ti[i-1],bo[i-1],
            ts(2025,random.choice([5,6,7]),random.randint(1,28)),
            random.choice(["Published","Published","Pending"]),
            random.choice([None,"Thank you for your feedback!"]),
            f"Room {random.randint(101,302)}",random.choice([3,6,12]),
            ts(2025,random.choice([5,6,7]),random.randint(1,28)),
            json.dumps(cat),None,random.randint(4,5),
            json.dumps(["Clean","Friendly staff"]),None))

def seed_tickets(c):
    su=["Booking modification request","Refund not received","Room not clean","Check-in OTP issue","Partner payout delay","Customer complaint escalation"]
    ca=["Booking","Refund","Property","Technical","Finance","Escalation"]
    for i in range(1,7):
        cr=ts(2025,random.choice([6,7]),random.randint(1,28))
        c.execute("INSERT INTO tickets VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",(
            f"tk{i}",f"TKT-2025{i:03d}",su[i-1],
            random.choice(["Arun Vijay","Rajesh Mehta","Meena Kumari"]),
            random.choice(["Customer","Partner"]),ca[i-1],
            random.choice(["Low","Medium","High","Critical"]),
            random.choice(["Open","In-Progress","Resolved","Closed"]),
            random.choice(["Agent Priya","Agent Rahul","Agent Neha"]),
            cr,cr,
            json.dumps([{"from":"Customer","msg":"Please help with this issue.","time":cr}])))

def seed_coupons(c):
    for x in [
        ("cp1","WELCOME10","10% off on first booking","Percentage",10,1000,500,45,100),
        ("cp2","FLAT500","Flat 500 off","Flat",500,2000,500,32,80),
        ("cp3","WEEKEND20","20% off on weekends","Percentage",20,1500,800,18,50),
        ("cp4","SUMMER30","30% summer special","Percentage",30,2000,1000,25,60),
        ("cp5","LOYALTY15","15% loyalty discount","Percentage",15,1000,400,55,200),
    ]:
        c.execute("INSERT INTO coupons VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            (*x,ts(2025,1,1),ts(2025,12,31),"Active"))

def seed_campaigns(c):
    for x in [
        ("cm1","Summer Sale Blast","Email","All Customers",5000,4800,3200,"Sent",ts(2025,4,1)),
        ("cm2","Monsoon Getaway","SMS","Active Customers",3000,2900,1800,"Sent",ts(2025,6,15)),
        ("cm3","Weekend Deals Push","Push","Lapsed Users",2000,1900,950,"Sent",ts(2025,7,1)),
        ("cm4","Partner Onboarding Drive","Email","Potential Partners",500,480,200,"Draft",None),
        ("cm5","Festival Special 2025","WhatsApp","All Customers",4000,3800,2500,"Scheduled",ts(2025,10,15)),
    ]:
        c.execute("INSERT INTO campaigns VALUES (?,?,?,?,?,?,?,?,?)",x)

def seed_audit_logs(c):
    ac=["superadmin@checkdin.com","operations@checkdin.com","finance@checkdin.com","support@checkdin.com","marketing@checkdin.com"]
    rl=["superadmin","operations","finance","support","marketing"]
    at=["User Login","Booking Approved","Payout Processed","Refund Approved","Property Updated","Room Status Changed","Coupon Created","Review Moderated"]
    tg=[f"pr{i}" for i in range(1,11)]+[f"bk{i}" for i in range(1,11)]+[f"p{i}" for i in range(1,10)]
    ca=["Auth","Booking","Finance","Finance","Property","Room","Marketing","Content"]
    for i in range(1,43):
        idx=(i-1)%len(ac); aidx=(i-1)%len(at)
        c.execute("INSERT INTO audit_logs VALUES (?,?,?,?,?,?,?,?)",(
            f"al{i}",ac[idx],rl[idx],at[aidx],ca[aidx%len(ca)],
            random.choice(tg),f"10.0.{random.randint(1,254)}.{random.randint(1,254)}",
            ts(2025,random.choice([5,6,7]),random.randint(1,28),random.randint(8,22))))

def seed_fraud_alerts(c):
    for x in [
        ("fa1","FA-001","Duplicate Payment","Multiple bookings from same IP",78,"192.168.1.105 made 3 bookings in 5 mins",12000,"Open",ts(2025,7,10,14,30)),
        ("fa2","FA-002","Suspicious Cancellation","Rapid book-cancel pattern",65,"Customer c7 cancelled 3 bookings in 2 days",8500,"Reviewed",ts(2025,7,12,9,15)),
        ("fa3","FA-003","Refund Abuse","Multiple refund requests same booking",82,"Customer c12 requested refund twice for CHK1005",5500,"Open",ts(2025,7,15,11,45)),
        ("fa4","FA-004","Fake Review","Review from non-booked customer",45,"Review from unknown user for pr3",0,"Resolved",ts(2025,6,28,16,20)),
        ("fa5","FA-005","Bot Booking","Automated booking pattern detected",91,"10 bookings from same fingerprint in 1 min",42000,"Open",ts(2025,7,20,8,0)),
        ("fa6","FA-006","Price Manipulation","Partner altering rates mid-booking",58,"pr6 rate changed 3 times in 1 hour",0,"Reviewed",ts(2025,7,18,13,10)),
    ]:
        c.execute("INSERT INTO fraud_alerts VALUES (?,?,?,?,?,?,?,?,?)",x)

def seed_pricing_rules(c):
    for x in [
        ("pr1","Weekend Surge","Property","Saturday-Sunday","+15%","All","Active",ts(2025,5,1)),
        ("pr2","Festival Premium","All","Diwali Season","+25%","All","Active",ts(2025,6,1)),
        ("pr3","Early Bird Discount","All","7+ days advance","-10%","All","Active",ts(2025,5,15)),
        ("pr4","Last Minute Deal","All","Same day check-in","-20%","App","Active",ts(2025,6,15)),
        ("pr5","Loyalty Reward","All","Repeat customer","-5%","All","Active",ts(2025,7,1)),
    ]:
        c.execute("INSERT INTO pricing_rules VALUES (?,?,?,?,?,?,?,?)",x)

def seed_hotels(c):
    hotels_data = [
        ("h1","The Grand Chennai","Porur","Chennai","porur_hotel1.jpg",4.2,134,"Porur Lake",3.5,"WiFi|AC|Parking|Room Service","Free WiFi, AC, Parking",1,1,1,0,0,"","Premium",4,"00:00",850,1200,2200,"","p1"),
        ("h2","Sakthi Residency","Virugambakkam","Chennai","virugambakkam_hotel1.jpg",4.0,98,"Vadapalani Temple",2.1,"WiFi|AC|TV|Room Service","Free WiFi, AC, TV",1,1,1,0,0,"","Budget",3,"00:00",750,1050,1900,"","p1"),
        ("h3","Royal Inn Chennai","Nungambakkam","Chennai","nungambakkam_hotel1.jpg",4.3,167,"Nungambakkam High Road",1.8,"WiFi|AC|Gym|Spa|Room Service","Free WiFi, AC, Gym, Spa",1,1,0,0,1,"","Premium",5,"00:00",950,1400,2500,"","p1"),
        ("h4","Comfort Stay","Adyar","Chennai","adyar_hotel1.jpg",4.1,112,"Adyar Theosophical Society",4.2,"WiFi|AC|Parking","Free WiFi, AC, Parking",1,1,1,0,0,"","Mid-Range",2,"00:00",800,1100,2000,"","p1"),
        ("h5","City Lodge","T. Nagar","Chennai","tnagar_hotel1.jpg",3.9,76,"Pondy Bazaar",0.8,"WiFi|AC|TV","Free WiFi, AC, TV",1,0,1,0,0,"","Budget",6,"00:00",700,1000,1800,"","p1"),
        ("h6","Pearl Residency","Anna Nagar","Chennai","annanagar_hotel1.jpg",4.4,189,"Anna Nagar Tower Park",5.1,"WiFi|AC|Pool|Gym|Room Service","Free WiFi, AC, Pool, Gym",1,1,0,0,1,"","Premium",3,"00:00",1000,1500,2700,"","p1"),
        ("h7","Budget Inn Chennai","Tambaram","Chennai","tambaram_hotel1.jpg",3.8,54,"Tambaram Bus Stand",12.0,"WiFi|AC","Free WiFi, AC",1,1,1,1,0,"","Budget",8,"00:00",600,850,1500,"","p1"),
        ("h8","Chennai Comforts","Sholinganallur","Chennai","sholinganallur_hotel1.jpg",4.0,87,"OMR IT Corridor",15.2,"WiFi|AC|Parking|Room Service","Free WiFi, AC, Parking",1,1,1,0,0,"","Mid-Range",4,"00:00",850,1200,2100,"","p1"),
        ("h9","The Grand Inn","Chromepet","Chennai","chromepet_hotel1.jpg",4.1,103,"Chromepet Junction",10.5,"WiFi|AC|TV|Room Service","Free WiFi, AC, TV",1,1,1,0,0,"","Mid-Range",5,"00:00",750,1050,1900,"","p1"),
        ("h10","Royal Stay Chennai","Velachery","Chennai","velachery_hotel1.jpg",4.3,156,"Velachery Bus Depot",8.3,"WiFi|AC|Gym|Parking|Room Service","Free WiFi, AC, Gym, Parking",1,1,0,0,1,"","Premium",3,"00:00",900,1300,2300,"","p1"),
        ("h11","Sunrise Hotel","Guindy","Chennai","guindy_hotel1.jpg",4.0,91,"Guindy National Park",7.0,"WiFi|AC|Parking","Free WiFi, AC, Parking",1,1,1,0,0,"","Mid-Range",6,"00:00",800,1100,2000,"","p1"),
        ("h12","Comfort Homes","Pallavaram","Chennai","pallavaram_hotel1.jpg",3.9,68,"Pallavaram Market",11.2,"WiFi|AC","Free WiFi, AC",1,0,1,1,0,"","Budget",7,"00:00",650,900,1600,"","p1"),
        ("h13","Metro Lodge Chennai","Mylapore","Chennai","mylapore_hotel1.jpg",4.2,121,"Kapaleeshwarar Temple",1.5,"WiFi|AC|TV|Room Service","Free WiFi, AC, TV",1,1,0,0,0,"","Mid-Range",4,"00:00",900,1300,2300,"","p1"),
        ("h14","Green Park Hotel","Thiruvanmiyur","Chennai","thiruvanmiyur_hotel1.jpg",4.1,97,"Marina Beach",6.8,"WiFi|AC|Pool|Parking","Free WiFi, AC, Pool",1,1,1,0,0,"","Premium",5,"00:00",850,1200,2100,"","p1"),
        ("h15","City Center Stay","Egmore","Chennai","egmore_hotel1.jpg",4.0,108,"Egmore Museum",2.3,"WiFi|AC|Room Service","Free WiFi, AC",1,1,0,0,0,"","Mid-Range",3,"00:00",800,1100,2000,"","p1"),
        ("h16","Harbour View Hotel","Mylapore","Chennai","mylapore_hotel2.jpg",4.3,145,"Santhome Cathedral",3.0,"WiFi|AC|Gym|Spa|Room Service","Free WiFi, AC, Gym, Spa",1,1,0,0,1,"","Premium",2,"00:00",950,1400,2500,"","p1"),
        ("h17","Airport Rest","Meenambakkam","Chennai","meenambakkam_hotel1.jpg",3.7,42,"Chennai Airport",5.5,"WiFi|AC|Parking","Free WiFi, AC, Parking",1,1,1,0,0,"","Budget",9,"00:00",600,850,1500,"","p1"),
    ]
    for h in hotels_data:
        c.execute("INSERT INTO hotels (id,name,area,city,image,rating,reviews_count,landmark,distance_km,intents,amenities,couple_friendly,local_id_accepted,instant_confirm,pay_at_hotel,business_friendly,chain,collection,slots_left,earliest_slot,rate_3h,rate_6h,rate_12h,about,policies,partner_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",(
            h[0],h[1],h[2],h[3],h[4],h[5],h[6],h[7],h[8],
            "[]",json.dumps(h[9].split("|")),h[11],h[12],h[13],h[14],h[15],
            h[16],h[17],h[18],h[19],h[20],h[21],h[22],h[10],"[]",h[23]))



def seed_customer_bookings(c):
    for i in range(1,6):
        hid=f"h{random.randint(1,17)}"
        c.execute("INSERT INTO customer_bookings VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",(
            f"cb{i}",f"CBK-2025{i:04d}",hid,
            ts(2025,random.choice([7,8]),random.randint(1,28)),
            f"{random.randint(10,22)}:00",random.choice([3,6,12]),
            random.randint(1,3),random.randint(800,3000),
            random.choice(["ongoing","completed","cancelled"]),
            f"{random.randint(1000,9999)}",random.choice([None,0,1]),
            f"c{random.randint(1,12)}"))

def seed_partner_roles(c):
    for x in [
        ("prole1","Owner","High",1,"Full access to all hotel operations",json.dumps(["all"])),
        ("prole2","Manager","Medium",0,"Manage daily operations and staff",json.dumps(["bookings","rooms","staff","reports"])),
        ("prole3","Receptionist","Low",0,"Handle check-in/check-out and guest queries",json.dumps(["bookings","checkin","checkout"])),
        ("prole4","Housekeeping","Low",0,"Manage room cleaning and maintenance",json.dumps(["rooms","maintenance"])),
        ("prole5","Night Auditor","Medium",0,"Overnight operations and report generation",json.dumps(["bookings","reports","finance"])),
    ]:
        c.execute("INSERT INTO partner_roles VALUES (?,?,?,?,?,?)",x)

def seed_partner_users(c):
    c.execute("INSERT INTO partner_users VALUES (?,?,?,?,?,?,?,?)",(
        "pu1","CHK-EMPIRE-017","Empire Admin","prole1",
        hashlib.sha256(b"1234").hexdigest(),"+919876543210",1,ts(2025,7,20)))

def main():
    print("Setting up database...")
    conn = setup_db()
    c = conn.cursor()
    for name,fn in [
        ("admin_users",seed_admin_users),("partners",seed_partners),("properties",seed_properties),
        ("rooms",seed_rooms),("customers",seed_customers),("bookings",seed_bookings),
        ("payouts",seed_payouts),("refunds",seed_refunds),("reviews",seed_reviews),
        ("tickets",seed_tickets),("coupons",seed_coupons),("campaigns",seed_campaigns),
        ("audit_logs",seed_audit_logs),("fraud_alerts",seed_fraud_alerts),("pricing_rules",seed_pricing_rules),
        ("hotels",seed_hotels),("customer_bookings",seed_customer_bookings),
        ("partner_roles",seed_partner_roles),("partner_users",seed_partner_users),
    ]:
        print(f"  Seeding {name}...")
        fn(c)
    conn.commit()
    conn.close()
    print("Done! Database seeded successfully.")

if __name__ == "__main__":
    main()
