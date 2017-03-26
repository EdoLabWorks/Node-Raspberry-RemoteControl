/* Author: Ed Alegrid 3/1/2017 */

'use strict';

const GPIO = require('array-gpio');

/* GPIO control code container */
const gpCode = exports.gpCode = {out:{on:[], off:[]}};

/**
*  web control API and setup
*/
console.log('\n*** WebControl Initialization ***');

var output;

// valid pin array container
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

/*
*  Start Web Control Process 
*/
function startWebControl () {
/*
*  generate in real-time GPIO control codes
*/ 

(function (){
  /* output code */
  if(output){
    for (let x in output){
      gpCode.out.on[x] = 'on' + x;
      gpCode.out.off[x] = 'off' + x;
    }
  }
})();

/*
*  GPIO output control function
*/
module.exports.Control = function (data){
  for (let x in output){
    if(gpCode.out.on[x] === data){
      output[x].on();
      return data;
    }
    else if(gpCode.out.off[x] === data){
      output[x].off();
      return data;
    }
  }
};
}// startWebControl()

/* exit clean-up process function */
function appExitProcess () {
  console.log('Closing output objects ... ');
  for(let x in output){
    output[x].close();
  }
}

process.on('SIGINT', function (){
  console.log('\nWebControl module terminated using Ctrl-C');
  appExitProcess();
  process.exit(0);
});


