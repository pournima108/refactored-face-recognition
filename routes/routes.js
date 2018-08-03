var express = require('express');
var app = express();
var router = express.Router();
var methods = require('../handlers/method.js');
var path = require('path');
var morgan = require('morgan');
var ap=require('../index.js');
//Package Dependencies


router.get('/', function(req, res) {
  res.render('index');
  });

  // router.route('/api/v1/')
//Route to specific url
  // .get('/', (req, res) => {
  //   res.render('index');
  // })

  router.get('/getdata',(req,res)=>{
    res.render('index_old')
  })

  router.post('/enroll',function(req, res) {
    var response = new methods().enrollfunction(req,res)
    })  //call enroll function 
 
  //Post the data 
  router.post('/upload',function(req, res) {
    // console.log("my body",req)
    var response = new methods().recognizeFunction(req,res)
  })//call recognize function

  router.post('/detrain',function(req, res) {
    var response = new methods().detrainFunction(req,res)
  })//call detrain function

  router.post('/response',function(req, res) {
    var response = new methods().giveResponse(req,res) 
  })// call response function

  router.post('/fillData',function(req, res) {
    var response = new methods().fillUserData(req,res)
  })//call filldata function



module.exports = router;