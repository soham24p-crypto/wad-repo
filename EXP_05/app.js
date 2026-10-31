// Secured app: parameterized SQL, validation, escaped output, CSRF token, Helmet, secure cookies
const express = require("express");
const mysql = require("mysql2");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const { body, validationResult } = require("express-validator");
const { csrfSync } = require("csrf-sync");
const app = express();
const db = mysql.createConnection({ host: "localhost", user: "root", password: process.env.DB_PASS || "" });

db.connect(err => { if (err) { console.log("MySQL error: " + err.message + "\nStart MySQL in XAMPP first."); process.exit(1); } });
db.query("CREATE DATABASE IF NOT EXISTS secure_node_app");
db.query("USE secure_node_app");
db.query("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL)");

app.set("view engine", "ejs");
app.use(helmet());                                                    // security headers
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "change-this-secret", resave: false, saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", secure: false } }));    // secure:true when using HTTPS
const { csrfSynchronisedProtection, generateToken } = csrfSync({ getTokenFromRequest: req => req.body._csrf });
app.use(csrfSynchronisedProtection);                                  // rejects POST without valid token (403)

const rules = [body("username").trim().isLength({ min: 3, max: 50 }), body("password").isLength({ min: 8 })];

app.get("/", (req, res) => res.redirect("/login"));
app.get("/login", (req, res) => res.render("login", { csrfToken: generateToken(req), msg: "" }));
app.get("/register", (req, res) => res.render("register", { csrfToken: generateToken(req), msg: "" }));

app.post("/register", rules, async (req, res) => {
  if (!validationResult(req).isEmpty()) return res.status(400).send("Invalid input (username 3-50 chars, password min 8)");
  const hash = await bcrypt.hash(req.body.password, 10);
  db.query("INSERT INTO users (username, password) VALUES (?, ?)", [req.body.username, hash],     // parameterized query
    err => err ? res.send("Username already exists") : res.redirect("/login"));
});

app.post("/login", rules, (req, res) => {
  if (!validationResult(req).isEmpty()) return res.status(400).send("Invalid input");
  db.query("SELECT * FROM users WHERE username = ?", [req.body.username], async (err, rows) => {   // parameterized query
    if (!rows || !rows.length || !(await bcrypt.compare(req.body.password, rows[0].password)))
      return res.render("login", { csrfToken: generateToken(req), msg: "Invalid username or password" });
    req.session.user = rows[0].username;
    res.redirect("/dashboard");
  });
});

app.get("/dashboard", (req, res) => req.session.user
  ? res.render("dashboard", { username: req.session.user, csrfToken: generateToken(req) }) : res.redirect("/login"));
app.post("/logout", (req, res) => req.session.destroy(() => res.redirect("/login")));              // POST + CSRF token

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
