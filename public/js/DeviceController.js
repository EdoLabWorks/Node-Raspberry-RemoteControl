'use strict';
var device = angular.module('edo', []);
device.controller('DeviceController', ['$scope', 'ControlService', function ($scope, ControlService) {
  /* using rpi object for raspberry pi */
  var rpi = {};

  rpi.error = false;
  var errorMsg = 'Check server status on your Raspberry Pi.';
  rpi.show1 = false;
  rpi.show2 = false;
  rpi.show3 = false;
  rpi.show4 = false;
  
  rpi.status = [];
 
  rpi.code = [{on: 'on0', off: 'off0'}, {on: 'on1', off: 'off1'}, {on: 'on2', off: 'off2'}, {on: 'on3', off: 'off3'}];         	
  let on = [{color: '#e6b800', state: 'ON' }]; 
  let off = [{color: 'red', state: 'OFF'}];
  let lockon = [{color: '#848484' , state: 'Locked. Press to unlock the GUI.'}]; 
  let lockoff = [{color: '#00cccc', state: 'Unlocked. Press to lock the GUI.'}];
	
  rpi.d1 =  off;
  rpi.d2 =  off;
  rpi.d3 =  off;
  rpi.d4 =  off;
  rpi.d5 =  lockoff;

  /* toggle button function */
  function controlButton(x) {
    if (x === rpi.code[0].on){
      if (rpi.d1[0].state === 'OFF' && rpi.d5 !==  lockon) {	
        x = rpi.code[0].on; //'on0';
        rpi.d1 = on;
      }
      else if (rpi.d5 !==  lockon) {	
        x = rpi.code[0].off; //'off0';
        rpi.d1 = off;
      }
    }
    if (x === rpi.code[1].on){
      if (rpi.d2[0].state === 'OFF' && rpi.d5 !==  lockon) {	
        x = rpi.code[1].on; // 'on1';
        rpi.d2 = on;
      }
      else if (rpi.d5 !==  lockon) {	
        x = rpi.code[1].off; // 'off1';
        rpi.d2 = off;
      }
    }
    if (x === rpi.code[2].on){
      if (rpi.d3[0].state === 'OFF' && rpi.d5 !==  lockon) {	
        x = rpi.code[2].on; // 'on2';
        rpi.d3 = on;
      }
      else if (rpi.d5 !==  lockon) {	
        x = rpi.code[2].off; // 'off2';
        rpi.d3 = off;
      }
    }
    if (x === rpi.code[3].on){
      if (rpi.d4[0].state === 'OFF' && rpi.d5 !==  lockon) {	
        x = rpi.code[3].on; // 'on3';
        rpi.d4 = on;
      }
      else if (rpi.d5 !==  lockon) {	
        x = rpi.code[3].off; // 'off3';
        rpi.d4 = off;
      }
    }
    return x;
  }

  /* disable button function (if not setup for remote operation) */ 
  function btnOff(x){
    if (x === rpi.code[0].on || x === rpi.code[0].off){
      rpi.d1 = off;
      rpi.show1 = true;
    }
    else if (x === rpi.code[1].on || x === rpi.code[1].off){
      rpi.d2= off;
      rpi.show2 = true;
    }
    else if (x === rpi.code[2].on || x === rpi.code[2].off){
      rpi.d3= off;
      rpi.show3 = true;
    }
    else if (x === rpi.code[3].on || x === rpi.code[3].off){
      rpi.d4= off;
      rpi.show4 = true;
    }
  }
			
  /* lock function */
  let lockStatus = 'on';
  let InitLockStatus = [{d: 'GUI is locked. Press lock button to unlock.'}];
  let UnlockStatus = [{d: 'GUI is unlocked.'}]; 
 
  rpi.d5 = lockon;
  rpi.status = InitLockStatus; 
  rpi.lock = function() {
    if (lockStatus === 'on'){
      rpi.status = UnlockStatus; 
      lockStatus = 'off';
      rpi.d5 =  lockoff;
    }
    else {
      rpi.status = InitLockStatus; 
      lockStatus = 'on';
      rpi.d5 =  lockon;
    }
  }
  		
  /* send device function */
  let payload = {};
  let msg = {};
  let bc = {};
  rpi.sd = function (x) {
    /* quick check for empty/null payload data */
    if (x == null || x == ''){
      rpi.status = [{d: 'blank data'}];
      return;
    }
    /* check for server error */
    else if(rpi.error === true){ 
      rpi.status = [{d: errorMsg}];
      rpi.error = false; 
    }
    /* start processing commands */
    else {
      if(rpi.error === false && rpi.status[0].d !== errorMsg) {
 
        rpi.status = [];
        x = controlButton(x);

        /* check if device is locked */
        if (lockStatus === 'off') {
	  payload = {d:x};
        }
        else {
	  payload = {d:'locked'};
        }
      }
      
      /* send data to server using http service */
      rpi.status = [{d: 'Processing command. Please wait ... '}];  

      /* http service module */
      ControlService.sd(payload).then(function success(response) {

        msg = JSON.parse((response.data.item).toString()); 

        /* btn color control */
        bc =  msg[0].d;
        
        /* debug output */
        //rpi.status = msg;
        //rpi.status = [{d: 'Send status - OK [' + msg[0].d + ']'}]; 
        //rpi.status = [{d: 'Send status - OK'}];

        if(bc === payload.d) {
          for(let x in rpi.code){
            let v = parseInt(x) + 1;
            if (bc === rpi.code[x].on ){
              rpi.status = [{d: 'Remote output ' + v + ' is ON.'}];
              return;
            }
            else if (bc === rpi.code[x].off){
              rpi.status = [{d: 'Remote output ' + v + ' is OFF.'}];
              return;
            }
            /*else if (bc === 'GUI is locked! Press unlock button to unlock.' || bc === 'locked') { 
              rpi.status = InitLockStatus; 
              return;
            }*/
          }
        }
        else if (rpi.d5 === lockon) { 
          rpi.status = InitLockStatus; 
          btnOff(payload.d);  
          return;
        }
        else {
          rpi.status = [{d: 'Button is not setup for remote control.'}];
          btnOff(payload.d);  
          return;  
        } 
        
      }, function error(response) {
        /* called asynchronously if an error occurs or server returns a response with an error status. */
        rpi.error = true;
        rpi.status = [{d: "Can't connect to remote Raspberry Pi."}];
      }); /* control service */
    } /* else */
  } /* sd */
	
  function getBtn(){
    lockStatus = 'off';
    setTimeout(function(){
    rpi.sd('off0');
    }, 0);
    setTimeout(function(){
    rpi.sd('off1');
    }, 150);
    setTimeout(function(){
    rpi.sd('off2');
    }, 300);
    setTimeout(function(){
    rpi.sd('off3');
    lockStatus = 'on';
    }, 500);
  }
  getBtn();

$scope.rpi = rpi;
}]);

/* http service module */
device.factory('ControlService', ['$http', function ($http) {
  const url = '/device';
  return { sd: function (data) { return $http.post(url + '/data', data); }, 
  }
}]); 
