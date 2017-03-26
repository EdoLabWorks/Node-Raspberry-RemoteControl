'strict'
var device = require('./device.js'); 

exports.controlHandler = function(app){
    app.use('/device', device); 
};


