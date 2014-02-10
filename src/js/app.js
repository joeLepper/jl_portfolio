angular.module('seedApp', [ 'SectionCtrl',
                            'ngRoute',
                            'templates',
                            'ngSocket' ])

  .constant('routeSettings', {
    controller  : 'sectionCtrl',
    templateUrl : 'templates/section.html',
    resolve     : {
      fetchContent : fetcher
    }
  })
  .config(function($routeProvider, $locationProvider, routeSettings) {
    $routeProvider.
      // when('/',      routeSettings).
      when('/about', routeSettings).
      when('/work',  routeSettings).
      when('/links', routeSettings).
      otherwise({ redirectTo: '/about' });

    $locationProvider
      .html5Mode(true);
  });

function fetcher ($location, $q, $socket) {
  var deferred = $q.defer();
  if($location.path().split('/')[1] === '') {
    deferred.resolve({ primary : '', title : ''});
  } else {
    $socket.emit('routeChange', {route : $location.path().split('/')[1] }, function(content){
      deferred.resolve(content);
    });
  }
  return deferred.promise;
}