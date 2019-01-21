angular.module('app')
.controller ('registerCtrl', function ($scope,$rootScope,Users){
console.log ('reg init');
     $scope.register = function () {
         user = {
                name : $scope.name,
                username : $scope.username,
                email : $scope.email,
                role : $scope.role
          };
          Users.save(user);
          console.log('Saved');
          $scope.completed=true;
    };

})
;