var TIMER_INTERVAL=5000;
angular.module("App",['main']);
angular.module("main",[]);
var app = angular.module("main");
app.controller("mainController",['$scope', '$interval',function($scope,$interval){
    var client=null;

    $scope.model={};
    $scope.model.connected=false;
    $scope.model.you={};
    $scope.model.you.currentText="";
    $scope.model.you.oldMessages=[];
    $scope.model.target={};
    $scope.model.target.currentText="";
    $scope.model.target.oldMessages=[];
    $scope.model.target.timeSinceLastPing=-1;
    $scope.model.log=[];

    $scope.textSend = function()
    {
        if($scope.model.you.currentText != ""){
            //Send to compadre
            client.publish('messages/'+$scope.model.userTo+'/' +$scope.model.userFrom+ '/push', $scope.model.you.currentText);
            
            //Local copy
            item = {
                date:(new Date()).toTimeString().slice(0, 8),
                text:$scope.model.you.currentText
            };
            $scope.model.you.oldMessages.push(item);
            $scope.model.you.currentText="";
        }
        
    };

    $scope.textChanged = function()
    {
        client.publish('messages/'+$scope.model.userTo+'/' +$scope.model.userFrom+ '/current', $scope.model.you.currentText);
    };
    

    $scope.connect = function() 
    {
        addLogEntry('Connecting to AWS IoT');

        //imports WebPack MQTT client and starts the connection
        client = EntryPoint.client();

        client.on('connect', () => {
            addLogEntry('Successfully connected to AWS IoT');
            
            //Subscribe channel
            channel = 'messages/'+$scope.model.userFrom+'/'+$scope.model.userTo+'/+';
            client.subscribe(channel);
            addLogEntry('Subscribed to channel '+channel);
            $scope.model.connected=true;
            
            //As long as connected, ping the target every 5s
            $scope.model.pingTimer = $interval(function(){
                client.publish('messages/'+$scope.model.userTo+'/' +$scope.model.userFrom+ '/ping', "PING");
            },TIMER_INTERVAL);

            //As long as we're here, verify wether compadre's last PING is within reasonable timeframe
            $interval(function(){
                var diff = new Date().getTime() - $scope.model.target.lastSeen;
                if( isNaN(diff))
                    diff=-1;
                $scope.model.target.timeSinceLastPing=diff;
                $scope.$apply();
            },TIMER_INTERVAL/2);
            //Render
            $scope.$apply();
        });

        client.on('close', () => {
            addLogEntry('Failed to connect :-(');
            $interval.cancel($scope.model.pingTimer);
            client.end();  // don't reconnect
            client = undefined;
        });

        client.on('message', (topic, message) => {
            if(topic.endsWith('/current'))
            {
                $scope.model.target.currentText=message;
            }
            else if(topic.endsWith('/ping'))
            {
                $scope.model.target.lastSeen=new Date().getTime();
            }
            else
            {
                item = {
                    date:(new Date()).toTimeString().slice(0, 8),
                    text:message
                };
                $scope.model.target.oldMessages.push(item);
                $scope.model.target.currentText="";
            }
            $scope.$apply();
        });
    };
    addLogEntry = function(info) {
        $scope.model.log.push('[' + (new Date()).toTimeString().slice(0, 8) + '] ' + info);
    };
}]);


