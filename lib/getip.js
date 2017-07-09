/* Ed Alegrid 10/2/2016 */

'use strict';

const ip = require('ip');

/* get http server ip */
exports.getIP = function (){
return ip.address();
}





