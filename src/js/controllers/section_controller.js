angular.module('SectionCtrl', [])
  .controller('sectionCtrl', function HelloCtrl($scope, $route) {
    var content = $route.current.locals.fetchContent;
    $scope.primary = content.primary;
    $scope.title   = content.title;
  });