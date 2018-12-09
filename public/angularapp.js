angular.module('app', ['ngRoute', 'ngResource','ui.bootstrap'])
// Routes
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'home.html',
      controller : 'homeCtrl'
    })
    .when('/users', {
        templateUrl: '/users/users.html',
        controller : 'usersCtrl'
    })
    .when('/tickets', {
        templateUrl: '/tickets/tickets.html',
        controller : 'ticketsCtrl'
    })
}]);