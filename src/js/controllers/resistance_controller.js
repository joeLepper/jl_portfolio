var res = angular.module('resistance', ['ngSocket'])

  .directive('resistanceChart', function() {
    return {
      restrict : 'E',
      controller: resistanceCtrl,
      templateUrl : 'templates/resistance_chart.html'

    };
  });

function resistanceCtrl ($scope, $socket) {
  console.log('got it.');
  $scope.resistances = [];
  $socket.on('connect', $scope, function () {
    var now  = Date.now()
      , then = now - 1800000;    // 1800000ms == 30min

    $socket.emit( 'bulkRequest'
                , { start: then
                  , end  : now }
                , function (data) {
                    console.log(data);
                  } );
  });
  $socket.on('resistance', $scope, function(data){
    console.log('received', data);
    $scope.resistances.push(data);
  });
}
