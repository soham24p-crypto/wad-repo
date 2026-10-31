// Express app that serves static files and handles GET requests
const express = require("express");
const path = require("path");
const app = express();

app.use(express.static("public"));   // public folder = static folder

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "public", "about.html")));
app.get("/hello", (req, res) => res.send("Hello from Express Server"));

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
