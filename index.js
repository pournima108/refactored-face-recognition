var express = require('express');
var Request = require("request");
var bodyParser = require('body-parser');
var path = require('path');
var morgan= require('morgan');
var processor = require('./route/module');
var fs=require('fs');
var logger = require('./route/logger');

//Package Dependencies


var route =require('./route/routes');
var db = require('./db/mongodb');
//Local Dependencies

var app = express();
//Express Object Instantiated


var port = process.env.PORT || 3000;
//Dynamic PORT allocation

//var accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log', {flags: 'a'});
app.use(morgan('common',{
    stream:fs.createWriteStream(__dirname + '/logs/access.log', {flags: 'a'})
}));

//Access logs


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Express Config

app.use('/', route);
//Routes

app.listen(port);
console.log("Server Running Successfully at port " + port);
//Listener

module.exports = app;