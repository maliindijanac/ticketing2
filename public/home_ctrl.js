angular.module('app')
.controller ('homeCtrl', function ($scope, Tickets){
    $scope.ticketOverview = Tickets.overview();
});