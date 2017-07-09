/* Ed Alegrid 3/1/2017 */

'use strict';

const GPIO = require('array-gpio');

/* GPIO control code container */
const gpCode = exports.gpCode = {out:{on:['on0','on1','on2','on3'], off:['off0','off1','off2','off3'], stat:['stat0','stat1','stat2','stat3']}};

/**
 *  web control API and setup
 */
console.log('\n*** WebControl Initialization ***');

/* output object variable */
var output = {};
/* valid pin array container */
var validOutputPin = [];

/**
 *  output pin setup function
 */
exports.setOutput = function (out1,out2,out3,out4,out5,out6){
  let outputPin = [out1,out2,out3,out4,out5,out6];
  for(let x in outputPin){
    if(outputPin[x]){
      validOutputPin.push(outputPin[x]);
    }
  }
  output = GPIO.Output({pin:validOutputPin});
  if(output !== undefined){
    startWebControl();
  }
  else{
    console.log('no user output pins were defined');  
  }
}

/**
 *  Start Web Control Process 
 */
function startWebControl () {
  /* GPIO output control function */
  module.exports.Control = function (data){

    if(validOutputPin.length>1){
      for (let x in output){
        if(gpCode.out.on[x] === data){
            output[x].on();
            return data;
        }
        else if(gpCode.out.off[x] === data){
            output[x].off();
            return data;
        }
	else if(gpCode.out.stat[x] === data){
          if(output[x].isOn){
	      return gpCode.out.on[x];
          }
          else if(output[x].isOff){
	      return gpCode.out.off[x];
          }
        }
      }
    }
    else {
      if(gpCode.out.on[0] === data){
        output.on();
        return data;
      }
      else if(gpCode.out.off[0] === data){
        output.off();
        return data;
      }
    }
  };
}// startWebControl()

/* exit clean-up process function */
function appExitProcess () {
  console.log('Closing output objects ... ');
  if(validOutputPin.length>1){
    for(let x in output){
      output[x].close();
    }
  }else{
    output.close();
  } 
}

process.on('SIGINT', function (){
  console.log('\nWebControl module terminated using Ctrl-C');
  appExitProcess();
  process.exit(0);
});


