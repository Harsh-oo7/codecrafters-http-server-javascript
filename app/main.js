const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const requestData = data.toString(); // Convert the buffer to a string
    const requestLines = requestData.split("\r\n"); // Split by line breaks
    const firstLine = requestLines[0]; // First line contains the request method, path, and HTTP version
    const thirdLine = requestLines[2];

    console.log("requestLines", requestLines)
    // Split the first line by spaces to extract method and path
    const [method, path,] = firstLine.split(" ");
    const [key, value] = thirdLine.split(":")

    console.log("Method:", method);
    console.log("Path:", path);
    console.log("value", value)

    if(path.startsWith('/echo/')) {
        const content = path.replace('/echo/', '');
        socket.write(`HTTP/1.1 200 OK\r\n`+`Content-Type: text/plain\r\n` + `Content-Length: ${content.length}\r\n` + `\r\n` + `${content}`);
    }
    else if(path == '/user-agent') {
      // const content = path.replace('/echo/', '');
      socket.write(`HTTP/1.1 200 OK\r\n`+`Content-Type: text/plain\r\n` + `Content-Length: ${value.length}\r\n` + `\r\n` + `${value.slice(1)}`);
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
