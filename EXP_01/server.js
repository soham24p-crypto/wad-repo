// Simple web server using Node's built-in http module
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Welcome to JavaScript Web Server</h1>");
  res.write("<h2>Node.js Practical</h2>");
  res.write("<p>Server is running successfully.</p>");
  res.end();
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
