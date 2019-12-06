const express = require('express');
const app = express();

app.use((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

module.exports = app;