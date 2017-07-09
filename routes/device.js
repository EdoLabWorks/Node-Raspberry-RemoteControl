/* Ed Alegrid 3/13/2017 */

'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var Web = require('../lib/WebControl.js');
var r = express.Router();
r.use(bodyParser.json());

var result = [];
r.route('/data').post(function (req, res) {
let item = req.body;
let _cd = item.d;

console.log('\n**** HTTP (req, res) ****');
console.log('request data: ', item);
/*
 *  GPIO output control function
 */
let gpioData = Web.Control(_cd);

if(gpioData){
  result = [{d:gpioData}];
}
else if (_cd == 'locked'  ) {
  _cd = 'GUI is locked! Press unlock button to unlock.';
  result = [{d:_cd}];
  
}
else if (_cd == null  ) {
  _cd = 'Invalid empty data!';
  result = [{d:_cd}];
}

console.log('response data:', result);

var data;

setTimeout(function(){
  data = JSON.stringify(result);
  res.json({item: data.toString()});
},50); 
});

module.exports = r;   

 
