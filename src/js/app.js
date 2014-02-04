angular.module('seedApp', [ 'WelcomeCtrls',
                            'HelloCtrls',
                            'HelloDirective',
                            'ngRoute',
                            'resistance',
                            'templates',
                            'HelloFilter' ])

  .config(function($routeProvider, $locationProvider) {
    $routeProvider.
     when('/', {
       controller  : 'welcomeCtrl',
       templateUrl : 'templates/welcome.html',
       resolve     : {
        foo : 'bar'
       },
       reloadOnSearch: false
     }).
     when('/hello', {
      controller  : 'helloCtrl',
      templateUrl : 'templates/hello.html'
     }).
     when('/resistance', {
      // controller  : 'ResistanceCtrl',
      templateUrl : 'templates/resistance.html'
     }).
     otherwise({ redirectTo: '/' });
     $locationProvider
     .html5Mode(true);
  })
  .factory('bar',function($route){
    return function() { return $route.current.params; };
  });