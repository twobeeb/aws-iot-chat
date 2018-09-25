# aws-iot-chat
Live Chat using AWS IoT Broker and AngularJS

Author : Julien Chanaud julien.chanaud[at]supinfo.com

Based on https://gist.github.com/stesie/dabc9236ef8fc4123609f9d81df6ccd8 by Stefan Siegl

Blinking cursor CSS https://codepen.io/ArtemGordinsky/pen/GnLBq by Artem Gordinsky

Config
======
npm install

Open main.js and change the 4 following variables:

AWS_ACCESS_KEY : AWS IAM User with AWSIoTDataAccess policy

AWS_SECRET_ACCESS_KEY : IAM Secret

AWS_IOT_ENDPOINT_HOST : IoT Broker Endpoint

region : AWS IoT Broker Region

Run
===
node_modules\\.bin\webpack-dev-server

Package
=======
node_modules\\.bin\webpack

