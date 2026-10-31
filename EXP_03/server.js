// User registration with CRUD using Express + MySQL
const express = require("express");
const mysql = require("mysql2");
const app = express();
const db = mysql.createConnection({ host: "localhost", user: "root", password: process.env.DB_PASS || "" });

db.connect(err => { if (err) { console.log("MySQL error: " + err.message + "\nStart MySQL in XAMPP first."); process.exit(1); } });
db.query("CREATE DATABASE IF NOT EXISTS registration_db");
db.query("USE registration_db");
db.query("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), password VARCHAR(255))");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res) => db.query("SELECT * FROM users", (err, users) => res.render("index", { users: users || [] })));           // Read
app.post("/add", (req, res) => {                                                                                                     // Create
  const { name, email, password } = req.body;
  db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password], () => res.redirect("/"));
});
app.get("/edit/:id", (req, res) => db.query("SELECT * FROM users WHERE id = ?", [req.params.id], (err, rows) => res.render("edit", { user: rows[0] })));
app.post("/update/:id", (req, res) => {                                                                                              // Update
  db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [req.body.name, req.body.email, req.params.id], () => res.redirect("/"));
});
app.get("/delete/:id", (req, res) => db.query("DELETE FROM users WHERE id = ?", [req.params.id], () => res.redirect("/")));         // Delete

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
