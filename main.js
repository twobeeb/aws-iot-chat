"use strict";
import v4 from 'aws-signature-v4';
import crypto from 'crypto';
import MqttClient from './node_modules/mqtt/lib/client';
import websocket from 'websocket-stream';

const AWS_ACCESS_KEY = '';
const AWS_SECRET_ACCESS_KEY = '';
const AWS_IOT_ENDPOINT_HOST = '';

var client;
module.exports = {
    client: function () {
        if (client == null)
        {
            client = new MqttClient(() => {
                var url = v4.createPresignedURL(
                    'GET',
                    AWS_IOT_ENDPOINT_HOST.toLowerCase(),
                    '/mqtt',
                    'iotdevicegateway',
                    crypto.createHash('sha256').update('', 'utf8').digest('hex'),
                    {
                        'region':'eu-west-1', 
                        'key': AWS_ACCESS_KEY,
                        'secret': AWS_SECRET_ACCESS_KEY,
                        'protocol': 'wss',
                        'expires': 15
                    }
                );
                return websocket(url, [ 'mqttv3.1' ]);
            });
        }
        return client;
    }
  };

