// Create web server 
// Create a comment form
// Create a comment list
// Add a comment to the list
// Add a comment to a file

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var qs = require('querystring');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    if (request.url === "/") {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.end(fs.readFileSync("comment_form.html"));
    } else if (request.url === "/comments") {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.end(fs.readFileSync("comments.html"));
    } else {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.end("404 Not Found\n");
    }
  } else if (request.method === "POST") {
    if (request.url === "/comments") {
      var requestBody = '';
      request.on('data', function(data) {
        requestBody += data;
        if(requestBody.length > 1e7) {
          response.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
          response.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
        }
      });
      request.on('end', function() {
        var formData = qs.parse(requestBody);
        fs.appendFileSync("comments.txt", formData.comment + "\n");
        response.writeHead(302, {"Location": "/comments"});
        response.end();
      });
    } else {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.end("404 Not Found\n");
    }
  } else {
    response.writeHead(405, {"Content-Type": "text/plain"});
    response.end("405 Method Not Allowed\n");
  }
});

// Listen on port 8000, IP defaults to