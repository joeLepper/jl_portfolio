angular.module('WelcomeCtrls', [])
  .controller('welcomeCtrl', function WelcomeController($scope, $route) {
    console.log('Hello Controllers!');
    $scope.welcome = 'Hello Tests!';
    $scope.itWorks = $route.current.locals.foo();
  });