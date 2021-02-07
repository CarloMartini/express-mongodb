// Dependencies
const express = require('express');
const http = require('http');
const hostname = 'localhost';
const port = 3000;
const morgan = require('morgan');
const app = express();

// Morgan
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

// Router Modules
const dishRouter = require('./routes/dishRouter');
app.use('/dishes', dishRouter);

const promoRouter = require('./routes/promoRouter');
app.use('/promotions', promoRouter);

const leaderRouter = require('./routes/leaderRouter');
app.use('/leaders', leaderRouter);

// Create web server
const server = http.createServer(app);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
