// Dependencies
const express = require('express');
const http = require('http');
const hostname = 'localhost';
const port = 3000;
const morgan = require('morgan');
const app = express();

// Mongo, Mongoose
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const url = 'mongodb://localhost:27017/conFusion';

const connect = mongoose.connect(url);
connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

// Morgan Logging
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