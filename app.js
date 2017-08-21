/* Ed Alegrid 3/1/2017 */

'use strict';
const express = require('express');
const app = express();
const http = require('http').Server(app);
const httpIP = require('./lib/getip.js');
const device = require('./routes/device.js');
const gpio = require('./lib/WebControl.js');

/*
 *  Provide the GPIO pins (physical pin numbering from board header) for your output objects (max. of 4 outputs).  
 *  Replace the default pins below using your actual selected output pins.  
 */
gpio.setOutput(33, 35, 37, 36); 

/* load web api routes */
app.use('/device', device); 

/* set public and SPA folder as index.html container */
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/SPA'));

/* get local http server ip and set the port number */
const ip = httpIP.getIP();
const port = 3000;

/* start http server */
http.listen(port, ip, () => {
  console.log('\n*** start http server ***');
  console.log(`HttpServer started: http://${ip}:${port}`);
});
