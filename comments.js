// Create web server
// Create a web server that listens on port 3000 and serves the comments.html file from the previous exercise.
// The comments.html file should be served as a static file.
// The server should respond to the GET /comments route and return the comments.json file from the previous exercise.
// The server should respond to the POST /comments route and save the posted comment to the comments.json file.
// The server should respond with a 201 status code and an empty body.
// The server should respond to any other route with a 404 status code and an empty body.

const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/comments") {
    res.writeHead(200, { "Content-Type": "application/json" });
    const readStream = fs.createReadStream(
      path.join(__dirname, "comments.json")
    );
    readStream.pipe(res);
  } else if (req.method === "POST" && req.url === "/comments") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const comment = JSON.parse(body);
      fs.readFile(path.join(__dirname, "comments.json"), (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end();
          return;
        }
        const comments = JSON.parse(data);
        comments.push(comment);
        fs.writeFile(
          path.join(__dirname, "comments.json"),
          JSON.stringify(comments),
          (err) => {
            if (err) {
              res.writeHead(500);
              res.end();
              return;
            }
            res.writeHead(201);
            res.end();
          }
        );
      });
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});