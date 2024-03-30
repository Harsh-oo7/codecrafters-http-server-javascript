const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const requestData = data.toString(); // Convert the buffer to a string
    const requestLines = requestData.split("\r\n"); // Split by line breaks
    const firstLine = requestLines[0]; // First line contains the request method, path, and HTTP version

    // Split the first line by spaces to extract method and path
    const [method, path,] = firstLine.split(" ");

    console.log("Method:", method);
    console.log("Path:", path);

    if(path.includes('/echo')) {
        let ln = path.split('/')[2]
        console.log("ln", ln)
        socket.write(`HTTP/1.1 200 OK\r\n`+`Content-Type: text/plain\r\n` + `Content-Length: ${ln.length}\r\n` + `\r\n` + `${ln}`);
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
