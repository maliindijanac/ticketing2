angular.module('app')
.controller ('registerCtrl', function ($scope,$rootScope,Users){
console.log ('reg init');

$scope.user = {
    name : "test",
    username : "",
    email : "",
    password:""
};

     $scope.register = function () {
          Users.register ($scope.user);
          console.log('Saved');
          $scope.completed=true;
    };

})
;