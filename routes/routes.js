var express = require('express');
var app = express();
var router = express.Router();
var methods = require('../handlers/method.js');
var path = require('path');
var morgan = require('morgan');
var ap=require('../index.js');
//Package Dependencies


router.get('/', function(req, res) {
    res.send("App Working!");
  });

  router.route('/api/v1/quotes')
//Route to specific url

  .post('/enroll',function(req, res) {
    var response = new methods().enrollfunction((error,response)=>{
      if(error){
        res.render('index',{
          msg: 'Face not recognized. Please try again',
          vis: 'visible'
        })
      }
      else {
        res.render('fillingConfirmation',{
          details:element,
          image:data,
          date:today
    })
    }}); 
  })
  //Post the data 





module.exports = router;