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
 
  rpi.code = [{on: 'on0', off: 'off0', stat: 'stat0'}, {on: 'on1', off: 'off1', stat: 'stat1'}, {on: 'on2', off: 'off2', stat: 'stat2'}, {on: 'on3', off: 'off3', stat: 'stat3'}];         	
  var on = [{color: '#e6b800', state: 'ON' }]; 
  var off = [{color: 'red', state: 'OFF'}];
  var lockon = [{color: '#848484' , state: 'Locked. Press to unlock the GUI.'}]; 
  var lockoff = [{color: '#00cccc', state: 'Unlocked. Press to lock the GUI.'}];
 
  /* button off state during startup or browser refresh */
  rpi.d1 =  off;
  rpi.d2 =  off;
  rpi.d3 =  off;
  rpi.d4 =  off;
  rpi.d5 =  lockoff;
  
  var btnF = false;

  /* toggle button function */
  function controlButton(x) {
    if (x === rpi.code[0].on){
      if (rpi.d1[0].state === 'OFF' && rpi.d5 !==  lockon) {	
        x = rpi.code[0].on; 	//'on0';
        rpi.d1 = on;
      }
      else if (rpi.d5 !==  lockon) {	
        x = rpi.code[0].off; 	//'off0';
        rpi.d1 = off;
      }
    }
    if (x === rpi.code[1].on){
      if (rpi.d2[0].state === 'OFF' && rpi.d5 !==  lockon) {	
        x = rpi.code[1].on; 	//'on1';
        rpi.d2 = on;
      }
      else if (rpi.d5 !==  lockon) {	
        x = rpi.code[1].off; 	//'off1';
        rpi.d2 = off;
      }
    }
    if (x === rpi.code[2].on){
      if (rpi.d3[0].state === 'OFF' && rpi.d5 !==  lockon) {	
        x = rpi.code[2].on; 	//'on2';
        rpi.d3 = on;
      }
      else if (rpi.d5 !==  lockon) {	
        x = rpi.code[2].off; 	//'off2';
        rpi.d3 = off;
      }
    }
    if (x === rpi.code[3].on){
      if (rpi.d4[0].state === 'OFF' && rpi.d5 !==  lockon) {	
        x = rpi.code[3].on; 	//'on3';
        rpi.d4 = on;
      }
      else if (rpi.d5 !==  lockon) {	
        x = rpi.code[3].off; 	//'off3';
        rpi.d4 = off;
      }
    }
    return x;
  }

  /* disable button if no outpin pin is configured for remote operation */ 
  function btnOff(x){

    if (x === rpi.code[0].on || x === rpi.code[0].off){
      rpi.d1 = off;
      if(btnF){
          rpi.show1 = true;
       }
       else{
	  rpi.show1 = false;
      }
    }
    else if (x === rpi.code[1].on || x === rpi.code[1].off){
      rpi.d2= off;
      if(btnF){
          rpi.show2 = true;
      }
      else{
	  rpi.show2 = false;
      }
    }
    else if (x === rpi.code[2].on || x === rpi.code[2].off){
      rpi.d3= off;
      if(btnF){
          rpi.show3 = true;
      }
      else{
	  rpi.show3 = false;
      }
    }
    else if (x === rpi.code[3].on || x === rpi.code[3].off){
      rpi.d4= off;
      if(btnF){
          rpi.show4 = true;
      }
      else{
	  rpi.show4 = false;
      }
    }
  }
			
  /* lock function */
  var lockStatus = 'on';
  var InitLockStatus = [{d: 'GUI is locked. Press lock button to unlock.'}];
  var UnlockStatus = [{d: 'GUI is unlocked.'}]; 
 
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
  var payload = {};
  var msg = {};

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
        var bc =  msg[0].d;
        
	/* remote control is allowed if payload data is the same with response data */
        if(bc && bc === payload.d ) {
          for(let x in rpi.code){
            let v = parseInt(x) + 1;
            if (bc === rpi.code[x].on ){
              rpi.status = [{d: 'Remote output ' + v + ' is ON.'}];

              if(bc === 'on0'){
		  rpi.d1 = on;
	      }
              if(bc === 'on1'){
		  rpi.d2 = on;
              }
              if(bc === 'on2'){
		  rpi.d3 = on;
              }
              if(bc === 'on3'){
		  rpi.d4 = on;
              }
              return;
            }
            else if (bc === rpi.code[x].off){
              rpi.status = [{d: 'Remote output ' + v + ' is OFF.'}];
              return;
            }
            else if (bc === rpi.code[x].stat){
              rpi.status = InitLockStatus; 
              btnOff(payload.d); 
              return;
            }
            else if (bc === 'GUI is locked! Press unlock button to unlock.' || bc === 'locked') { 
              rpi.status = InitLockStatus; 
              btnOff(payload.d); 
              return;
            }
          }
        }
	
        else if (rpi.d5 === lockon) { 
          rpi.status = InitLockStatus; 
          btnOff(payload.d);  
      
          if(bc === 'on0'){
	      rpi.d1 = on;
          }
          if(bc === 'on1'){
	      rpi.d2 = on;
          }
          if(bc === 'on2'){
	      rpi.d3 = on;
          }
          if(bc === 'on3'){
	      rpi.d4 = on;
          }

          return;
        }
        else {
          rpi.status = [{d: 'Button is not setup for remote control. There is no output pin configured with this button.'}];
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

  /* get status of output pins */
  function getBtnStatus(){
    btnF = true;
    lockStatus = 'off';
 
    rpi.sd('stat0');
    setTimeout(function(){
    	rpi.sd('stat1');
    }, 100); //use 200 for high traffic network
    setTimeout(function(){
    	rpi.sd('stat2');
    }, 200); //use 400 for high traffic network
    setTimeout(function(){
    	rpi.sd('stat3');
    }, 300); //use 600 for high traffic network

    setTimeout(function(){
    	lockStatus = 'on';
    	btnF = false;
    }, 400); //use 800 for high traffic network
  }

  getBtnStatus();

$scope.rpi = rpi;
}]);

/* http service module */
device.factory('ControlService', ['$http', function ($http) {
  const url = '/device';
      return { sd: function (data) { return $http.post(url + '/data', data); }, 
  }
}]); 
