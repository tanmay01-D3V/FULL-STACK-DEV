const http = require('http');

const server = http.createServer((req, res) => {

  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Welcome to the HTTP module</h1>');

  } else if (req.url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>This is the about page</h1>');

  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/">Go back to Home</a>
    `);
  }

});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});