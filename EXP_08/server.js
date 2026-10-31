// REST API (GET + POST) and a mobile-friendly page that uses it
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("public"));

const complaints = [
  { id: 1, title: "Projector not working", category: "Classroom", status: "PENDING" },
  { id: 2, title: "Wi-Fi connectivity issue", category: "IT", status: "IN PROGRESS" }
];

app.get("/api/complaints", (req, res) => res.json(complaints));

app.post("/api/complaints", (req, res) => {
  if (!req.body.title) return res.status(400).json({ message: "Title is required" });
  const c = { id: complaints.length + 1, title: req.body.title, category: req.body.category || "General", status: "PENDING" };
  complaints.push(c);
  res.status(201).json({ message: "Complaint created successfully.", complaint: c });
});

app.listen(3000, "0.0.0.0", () => console.log("Open http://localhost:3000  (phone: http://YOUR-PC-IP:3000)"));
