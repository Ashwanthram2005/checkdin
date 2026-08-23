#!/usr/bin/env node
const { spawn } = require("child_process");
const http = require("http");
const path = require("path");

function startServer() {
  return new Promise((resolve) => {
    const proc = spawn("node", ["server.js"], {
      cwd: path.dirname(process.argv[1] || __dirname),
      stdio: ["ignore", "pipe", "pipe"],
    });
    setTimeout(() => resolve(proc), 2000);
  });
}

function api(method, path, token, body) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: "127.0.0.1",
      port: 3001,
      path,
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (token) opts.headers["Authorization"] = `Bearer ${token}`;
    const req = http.request(opts, (res) => {
      let raw = "";
      res.on("data", (c) => (raw += c));
      res.on("end", () => {
        try { resolve([res.statusCode, JSON.parse(raw)]); }
        catch { resolve([res.statusCode, { raw }]); }
      });
    });
    req.on("error", (e) => resolve([0, { error: e.message }]));
    if (data) req.write(data);
    req.end();
  });
}

function main() {
  let passed = 0, failed = 0;
  const results = [];

  function check(name, condition, detail) {
    if (condition) { passed++; results.push(`  PASS: ${name}`); }
    else { failed++; results.push(`  FAIL: ${name} -- ${detail || ""}`); }
  }

  startServer().then(async (proc) => {
    try {
      let code, body, admin_token, cust_token, partner_token;

      [code, body] = await api("GET", "/");
      check("Root endpoint", code === 200 && body.status === "ok");

      [code, body] = await api("POST", "/api/auth/login/admin", null, { email: "superadmin@checkdin.com", password: "Super@123" });
      check("Admin login", code === 200 && "token" in body, `code=${code}`);
      admin_token = body.token || "";

      [code, body] = await api("POST", "/api/auth/login/admin", null, { email: "superadmin@checkdin.com", password: "wrong" });
      check("Admin wrong pw", code === 401, `code=${code}`);

      [code, body] = await api("POST", "/api/auth/login/customer", null, { email: "test@test.com", name: "Test" });
      check("Customer login", code === 200 && "token" in body);
      cust_token = body.token || "";

      [code, body] = await api("POST", "/api/auth/login/partner", null, { hotelId: "CHK-EMPIRE-017" });
      check("Partner step1", code === 200 && body.step === 2 && "users" in body, `body=${JSON.stringify(body)}`);

      [code, body] = await api("POST", "/api/auth/login/partner", null, { hotelId: "CHK-EMPIRE-017", userId: "pu1", userPassword: "1234" });
      check("Partner step2", code === 200 && "token" in body, `code=${code}, body=${JSON.stringify(body)}`);
      partner_token = body.token || "";

      [code, body] = await api("GET", "/api/auth/me", admin_token);
      check("Me admin", code === 200 && body.email === "superadmin@checkdin.com");

      [code, body] = await api("GET", "/api/admin/dashboard", admin_token);
      check("Dashboard", code === 200, `code=${code}`);
      check("Dashboard bookings", (body.total_bookings || 0) === 30, `got=${body.total_bookings}`);
      check("Dashboard revenue", (body.total_revenue || 0) > 0, `got=${body.total_revenue}`);
      check("Dashboard properties", (body.total_properties || 0) === 10, `got=${body.total_properties}`);
      check("Dashboard partners", (body.total_partners || 0) === 9, `got=${body.total_partners}`);
      check("Dashboard customers", (body.total_customers || 0) >= 12, `got=${body.total_customers}`);

      [code, body] = await api("GET", "/api/admin/bookings", admin_token);
      check("Admin bookings", code === 200 && body.total === 30, `total=${body.total}`);

      [code, body] = await api("GET", "/api/admin/properties", admin_token);
      check("Admin properties", code === 200 && body.total === 10, `total=${body.total}`);

      [code, body] = await api("GET", "/api/admin/rooms", admin_token);
      check("Admin rooms", code === 200 && body.total === 30, `total=${body.total}`);

      [code, body] = await api("GET", "/api/admin/partners", admin_token);
      check("Admin partners", code === 200 && body.total === 9, `total=${body.total}`);

      [code, body] = await api("GET", "/api/admin/customers", admin_token);
      check("Admin customers", code === 200 && body.total >= 12, `total=${body.total}`);

      [code, body] = await api("GET", "/api/admin/payouts", admin_token);
      check("Admin payouts", code === 200 && body.total === 12, `total=${body.total}`);

      [code, body] = await api("GET", "/api/admin/refunds", admin_token);
      check("Admin refunds", code === 200 && body.total === 10, `total=${body.total}`);

      [code, body] = await api("GET", "/api/admin/reviews", admin_token);
      check("Admin reviews", code === 200 && body.total === 8, `total=${body.total}`);

      [code, body] = await api("GET", "/api/admin/tickets", admin_token);
      check("Admin tickets", code === 200 && body.total === 6, `total=${body.total}`);

      [code, body] = await api("GET", "/api/admin/coupons", admin_token);
      check("Admin coupons", code === 200 && body.total === 5, `total=${body.total}`);

      [code, body] = await api("GET", "/api/admin/campaigns", admin_token);
      check("Admin campaigns", code === 200 && body.total === 5, `total=${body.total}`);

      [code, body] = await api("GET", "/api/admin/audit-logs", admin_token);
      check("Admin audit-logs", code === 200 && body.total === 42, `total=${body.total}`);

      [code, body] = await api("GET", "/api/admin/fraud", admin_token);
      check("Admin fraud", code === 200 && body.total === 6, `total=${body.total}`);

      [code, body] = await api("GET", "/api/admin/admin-users", admin_token);
      check("Admin admin-users", code === 200 && body.total === 5, `total=${body.total}`);

      [code, body] = await api("GET", "/api/admin/pricing-rules", admin_token);
      check("Admin pricing-rules", code === 200 && body.total === 5, `total=${body.total}`);

      [code, body] = await api("GET", "/api/admin/reports", admin_token);
      check("Admin reports", code === 200 && "revenue" in body);

      [code, body] = await api("GET", "/api/admin/settings", admin_token);
      check("Admin settings", code === 200 && body.site_name === "CheckDin");

      [code, body] = await api("GET", "/api/customer/hotels");
      check("Customer hotels", code === 200, `code=${code}`);
      check("Hotels total=17", body.total === 17, `total=${body.total}`);

      [code, body] = await api("GET", "/api/customer/hotels/h1");
      check("Hotel detail", code === 200 && body.name === "The Grand Chennai");

      [code, body] = await api("GET", "/api/customer/bookings", cust_token);
      check("Customer bookings", code === 200);

      [code, body] = await api("POST", "/api/customer/leads", null, { property_name: "Test", contact_name: "Test", mobile: "9999999999" });
      check("Customer leads", code === 200 && body.ok === true);

      if (partner_token) {
        const partnerEndpoints = [
          "/api/partner/dashboard", "/api/partner/bookings", "/api/partner/rooms",
          "/api/partner/pricing", "/api/partner/revenue", "/api/partner/reviews",
          "/api/partner/payouts", "/api/partner/support", "/api/partner/settings",
          "/api/partner/reports", "/api/partner/audit-log", "/api/partner/availability",
        ];
        for (const ep of partnerEndpoints) {
          [code, body] = await api("GET", ep, partner_token);
          check(`Partner ${ep.split("/").pop()}`, code === 200, `code=${code}`);
        }
      }

      [code, body] = await api("GET", "/api/admin/dashboard", cust_token);
      check("Customer denied admin", code === 403, `code=${code}`);

      [code, body] = await api("GET", "/api/partner/dashboard", admin_token);
      check("Admin denied partner", code === 403, `code=${code}`);

    } catch (e) {
      results.push(`  ERROR: ${e.message}`);
      failed++;
    }

    for (const r of results) console.log(r);
    console.log(`\n${"=".repeat(50)}`);
    console.log(`TOTAL: ${passed + failed} | PASS: ${passed} | FAIL: ${failed}`);

    proc.kill();
    proc.on("close", () => process.exit(failed ? 1 : 0));
  });
}

main();
