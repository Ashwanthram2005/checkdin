#!/usr/bin/env python3
import subprocess, time, json, sys, os
import urllib.request, urllib.error

def start_server():
    proc = subprocess.Popen(
        [sys.executable, "server.py"],
        cwd=os.path.dirname(os.path.abspath(__file__)),
        stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    time.sleep(2)
    return proc

def api(method, path, token=None, body=None):
    url = f"http://127.0.0.1:3001{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(req)
        return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())
    except Exception as e:
        return 0, {"error": str(e)}

def main():
    proc = start_server()
    passed = 0
    failed = 0
    results = []

    def check(name, condition, detail=""):
        nonlocal passed, failed
        if condition:
            passed += 1
            results.append(f"  PASS: {name}")
        else:
            failed += 1
            results.append(f"  FAIL: {name} -- {detail}")

    try:
        code, body = api("GET", "/")
        check("Root endpoint", code == 200 and body.get("status") == "ok")

        code, body = api("POST", "/api/auth/login/admin", body={"email": "superadmin@checkdin.com", "password": "Super@123"})
        check("Admin login", code == 200 and "token" in body, f"code={code}")
        admin_token = body.get("token", "")

        code, body = api("POST", "/api/auth/login/admin", body={"email": "superadmin@checkdin.com", "password": "wrong"})
        check("Admin wrong pw", code == 401, f"code={code}")

        code, body = api("POST", "/api/auth/login/customer", body={"email": "test@test.com", "name": "Test"})
        check("Customer login", code == 200 and "token" in body)
        cust_token = body.get("token", "")

        code, body = api("POST", "/api/auth/login/partner", body={"hotelId": "CHK-EMPIRE-017"})
        check("Partner step1", code == 200 and body.get("step") == 2 and "users" in body, f"body={body}")

        code, body = api("POST", "/api/auth/login/partner", body={"hotelId": "CHK-EMPIRE-017", "userId": "pu1", "userPassword": "1234"})
        check("Partner step2", code == 200 and "token" in body, f"code={code}, body={body}")
        partner_token = body.get("token", "")

        code, body = api("GET", "/api/auth/me", token=admin_token)
        check("Me admin", code == 200 and body.get("email") == "superadmin@checkdin.com")

        code, body = api("GET", "/api/admin/dashboard", token=admin_token)
        check("Dashboard", code == 200, f"code={code}")
        check("Dashboard bookings", body.get("total_bookings", 0) == 30, f"got={body.get('total_bookings')}")
        check("Dashboard revenue", body.get("total_revenue", 0) > 0, f"got={body.get('total_revenue')}")
        check("Dashboard properties", body.get("total_properties", 0) == 10, f"got={body.get('total_properties')}")
        check("Dashboard partners", body.get("total_partners", 0) == 9, f"got={body.get('total_partners')}")
        check("Dashboard customers", body.get("total_customers", 0) >= 12, f"got={body.get('total_customers')}")

        code, body = api("GET", "/api/admin/bookings", token=admin_token)
        check("Admin bookings", code == 200 and body.get("total") == 30, f"total={body.get('total')}")

        code, body = api("GET", "/api/admin/properties", token=admin_token)
        check("Admin properties", code == 200 and body.get("total") == 10, f"total={body.get('total')}")

        code, body = api("GET", "/api/admin/rooms", token=admin_token)
        check("Admin rooms", code == 200 and body.get("total") == 30, f"total={body.get('total')}")

        code, body = api("GET", "/api/admin/partners", token=admin_token)
        check("Admin partners", code == 200 and body.get("total") == 9, f"total={body.get('total')}")

        code, body = api("GET", "/api/admin/customers", token=admin_token)
        check("Admin customers", code == 200 and body.get("total") >= 12, f"total={body.get('total')}")

        code, body = api("GET", "/api/admin/payouts", token=admin_token)
        check("Admin payouts", code == 200 and body.get("total") == 12, f"total={body.get('total')}")

        code, body = api("GET", "/api/admin/refunds", token=admin_token)
        check("Admin refunds", code == 200 and body.get("total") == 10, f"total={body.get('total')}")

        code, body = api("GET", "/api/admin/reviews", token=admin_token)
        check("Admin reviews", code == 200 and body.get("total") == 8, f"total={body.get('total')}")

        code, body = api("GET", "/api/admin/tickets", token=admin_token)
        check("Admin tickets", code == 200 and body.get("total") == 6, f"total={body.get('total')}")

        code, body = api("GET", "/api/admin/coupons", token=admin_token)
        check("Admin coupons", code == 200 and body.get("total") == 5, f"total={body.get('total')}")

        code, body = api("GET", "/api/admin/campaigns", token=admin_token)
        check("Admin campaigns", code == 200 and body.get("total") == 5, f"total={body.get('total')}")

        code, body = api("GET", "/api/admin/audit-logs", token=admin_token)
        check("Admin audit-logs", code == 200 and body.get("total") == 42, f"total={body.get('total')}")

        code, body = api("GET", "/api/admin/fraud", token=admin_token)
        check("Admin fraud", code == 200 and body.get("total") == 6, f"total={body.get('total')}")

        code, body = api("GET", "/api/admin/admin-users", token=admin_token)
        check("Admin admin-users", code == 200 and body.get("total") == 5, f"total={body.get('total')}")

        code, body = api("GET", "/api/admin/pricing-rules", token=admin_token)
        check("Admin pricing-rules", code == 200 and body.get("total") == 5, f"total={body.get('total')}")

        code, body = api("GET", "/api/admin/reports", token=admin_token)
        check("Admin reports", code == 200 and "revenue" in body)

        code, body = api("GET", "/api/admin/settings", token=admin_token)
        check("Admin settings", code == 200 and body.get("site_name") == "CheckDin")

        code, body = api("GET", "/api/customer/hotels")
        check("Customer hotels", code == 200, f"code={code}")
        check("Hotels total=17", body.get("total") == 17, f"total={body.get('total')}")

        code, body = api("GET", "/api/customer/hotels/h1")
        check("Hotel detail", code == 200 and body.get("name") == "The Grand Chennai")

        code, body = api("GET", "/api/customer/bookings", token=cust_token)
        check("Customer bookings", code == 200)

        code, body = api("POST", "/api/customer/leads", body={"property_name": "Test", "contact_name": "Test", "mobile": "9999999999"})
        check("Customer leads", code == 200 and body.get("ok") == True)

        if partner_token:
            for ep in ["/api/partner/dashboard", "/api/partner/bookings", "/api/partner/rooms",
                       "/api/partner/pricing", "/api/partner/revenue", "/api/partner/reviews",
                       "/api/partner/payouts", "/api/partner/support", "/api/partner/settings",
                       "/api/partner/reports", "/api/partner/audit-log", "/api/partner/availability"]:
                code, body = api("GET", ep, token=partner_token)
                check(f"Partner {ep.split('/')[-1]}", code == 200, f"code={code}")

        code, body = api("GET", "/api/admin/dashboard", token=cust_token)
        check("Customer denied admin", code == 403, f"code={code}")

        code, body = api("GET", "/api/partner/dashboard", token=admin_token)
        check("Admin denied partner", code == 403, f"code={code}")

    except Exception as e:
        results.append(f"  ERROR: {e}")
        failed += 1

    for r in results:
        print(r)
    print(f"\n{'='*50}")
    print(f"TOTAL: {passed+failed} | PASS: {passed} | FAIL: {failed}")

    proc.terminate()
    proc.wait()
    sys.exit(1 if failed else 0)

if __name__ == "__main__":
    main()
