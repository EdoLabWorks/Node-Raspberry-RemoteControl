## Node-Raspberry-RemoteControl

A simple HTTP remote control project for Raspberry Pi 3 using array-gpio, express and angular.

Turn ON/OFF the actuators/peripherals connected to your Raspberry Pi 3 using your mobile device.

![](https://github.com/EdoLabWorks/ximgs/blob/master/raspberry-remote1.png)

Note:
 
Works on node v5.0 LTS or v6.5 latest and above.

### Raspberry Pi Pin Setup

Using the GPIO physical pin number, choose the pins you want to use as outputs.

Configure the pins in the app.js file as shown below.

For this project, you only need to provide the output pins you will use.

~~~~
gpio.setOutput(pin1, pin2 ... pin4); // max. 4 outputs
~~~~

### Features

- Real-time update of GPIO pin state.
- Control remote devices from within your private network using your mobile device browser.  

### Installation 

Git clone or download the application from your Raspberry Pi computer.

In the root folder, install all dependencies.
~~~~
$ npm install
~~~~

Run the application as shown below. 
~~~~
$ node app
~~~~

Enter the `ip address` of your Raspberry Pi as shown below to start your web control from your mobile device. 
~~~~
http://<ip address of your raspberry Pi>:3000/
~~~~
e.g.
~~~~
http://192.168.1.125:3000/
~~~~

### License

MIT
