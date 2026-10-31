// Register + Login using bcrypt password hashing, Express sessions and MySQL
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const app = express();
const db = mysql.createConnection({ host: "localhost", user: "root", password: process.env.DB_PASS || "" });

db.connect(err => { if (err) { console.log("MySQL error: " + err.message + "\nStart MySQL in XAMPP first."); process.exit(1); } });
db.query("CREATE DATABASE IF NOT EXISTS auth_db");
db.query("USE auth_db");
db.query("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(255))");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(session({ secret: "lab-secret", resave: false, saveUninitialized: false }));

app.get("/", (req, res) => res.redirect("/login"));
app.get("/register", (req, res) => res.render("register", { msg: "" }));
app.get("/login", (req, res) => res.render("login", { msg: "" }));

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);                      // hash the password
  db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hash],
    err => err ? res.render("register", { msg: "Email already registered" }) : res.redirect("/login"));
});

app.post("/login", (req, res) => {
  db.query("SELECT * FROM users WHERE email = ?", [req.body.email], async (err, rows) => {
    if (!rows || rows.length === 0 || !(await bcrypt.compare(req.body.password, rows[0].password)))
      return res.render("login", { msg: "Invalid email or password" });
    req.session.user = rows[0].name;                                 // create session
    res.redirect("/dashboard");
  });
});

app.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/login");             // protect page
  res.render("dashboard", { name: req.session.user });
});
app.get("/logout", (req, res) => req.session.destroy(() => res.redirect("/login")));

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
