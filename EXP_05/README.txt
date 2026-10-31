EXP_05 - Fixing SQL Injection, XSS and CSRF
1. Start MySQL in XAMPP
2. Run:   npm install   then   npm start
3. Open http://localhost:3000
Tests to show the teacher:
 - SQL injection: login with username  ' OR '1'='1   -> rejected (parameterized query)
 - XSS: register username  <script>alert(1)</script>  -> shown as text, not run
 - CSRF: send POST /logout from Postman/curl without _csrf -> 403 Forbidden
 - Helmet: browser DevTools -> Network -> response headers
The vulnerable code (do not use) is:
   "SELECT * FROM users WHERE username='" + username + "'"
