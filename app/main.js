const net = require("net");
const numCPUs = require("os").cpus().length;
const cluster = require("cluster");
const fs = require("node:fs");


// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
if (cluster.isMaster) {
  // Fork worker processes
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const server = net.createServer((socket) => {
    socket.on("data", (data) => {
      const requestData = data.toString(); // Convert the buffer to a string
      const requestLines = requestData.split("\r\n"); // Split by line breaks
      const firstLine = requestLines[0]; // First line contains the request method, path, and HTTP version
      const headerValue = requestLines.find((line) => line?.includes('User-Agent'))?.replace('User-Agent: ', '');;
  
      console.log("requestLines", requestLines)
      // Split the first line by spaces to extract method and path
      const [method, path,] = firstLine.split(" ");
  
      console.log("Method:", method);
      console.log("Path:", path);
  
      if(path.startsWith('/echo/')) {
          const content = path.replace('/echo/', '');
          socket.write(`HTTP/1.1 200 OK\r\n`+`Content-Type: text/plain\r\n` + `Content-Length: ${content.length}\r\n` + `\r\n` + `${content}`);
      }
      else if(path.startsWith('/user-agent')) {
        socket.write(`HTTP/1.1 200 OK\r\n`+`Content-Type: text/plain\r\n` + `Content-Length: ${headerValue.length}\r\n` + `\r\n` + `${headerValue}`);
        return;
      }
      else if(path == '/') {
          socket.write("HTTP/1.1 200 OK\r\n\r\n")
      }
      else if(path.startsWith('/files') && method == "POST") {
        directory = process.argv[3];
        filename = path.split("/files/")[1];
        let dr = requestLines[requestLines.length-1]
        fs.writeFile(directory + filename, dr, (err) => {
          if (err) {
            socket.write("HTTP/1.1 404 OK\r\n\r\n");
          }
          else {
            console.log('Data written to file successfully');
            socket.write("HTTP/1.1 201 OK\r\n\r\n");
          }
        });
      }
      else if(path.startsWith('/files')) {
        directory = process.argv[3];
        filename = path.split("/files/")[1];
        fs.readFile(directory + filename, "utf8", (err, data) => {
          if (err) {
            socket.write("HTTP/1.1 404 OK\r\n\r\n");
            return;
          }
          socket.write(
            `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${data?.length}\r\n\r\n${data}`
          );
        });
      }
      else 
          socket.write("HTTP/1.1 404 OK\r\n\r\n")
      server.close();
    });
    socket.on("close", () => {
      socket.end();
      server.close();
    });
  });
  
  server.listen(4221, "localhost");
}

