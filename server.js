require('dotenv').config({ path: 'variables.env' });
const http = require('http');
const app = require('./app');

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});