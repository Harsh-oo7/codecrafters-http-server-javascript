const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const requestData = data.toString(); // Convert the buffer to a string
    const requestLines = requestData.split("\r\n"); // Split by line breaks
    const firstLine = requestLines[0]; // First line contains the request method, path, and HTTP version
    const headerValue = requestLines.find((line) => line.includes('User-Agent')).replace('User-Agent: ', '');;

    console.log("requestLines", headerValue)
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
