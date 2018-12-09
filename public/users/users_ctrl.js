angular.module('app')
.controller ('usersCtrl', function ($scope, $uibModal, $rootScope,Users){
    $scope.users = Users.query();
console.log ('user init');


    $scope.confirmdelete = function (inuser) {
        console.log('confirmdelete modal');
        console.log(inuser.name);
        modalInstance = $uibModal.open({
            controller: 'UserConfirmInstanceCtrl',
            controllerAs: 'pc',
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'ConfirmModal.html',        
            resolve: {
              user: function () {
                return inuser;
              }
            }     
        });
    
        modalInstance.result.then(function (user) {
            console.log('confirm Modal OK clicked');
            console.log(user);
              // brisanje sa liste
              //userindex = $scope.users.indexOf(user);
              //$scope.users.splice(userindex, 1);
              //brisanje iz baze
              user.$delete();
              $scope.users = Users.query();

    
        }, function () {
            console.log('ConfirmModal dismissed');
        });
        
        $rootScope.modalInstance = modalInstance;
      };


     $scope.openedit = function (inuser) {
       console.log('Open modal edit');
        if (inuser) {
          $scope.modaltitle = "Edit user"
          // napraviti kopiju 
          user = {
                _id  : inuser._id,
                name : inuser.name,
                username : inuser.username,
                email : inuser.email,
                role : inuser.role
          };
  
        } else {
           $rootScope.modaltitle = "New user"
           user = inuser;
        };   
        console.log(user);
        
        modalInstance = $uibModal.open({
            // kontroler koji se koristi za modalni prozor
            controller: 'UserEditInstanceCtrl',
            controllerAs: '$ctrl',
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'users/users_modal.html' ,
            // vrijednost koja se proslijeđuje u kontroler kao lokana varijabla 
            resolve: {
              user: function () {
                return user;
              }
            }         
        });
  
        modalInstance.result.then(function (user) {
            console.log('Modal OK clicked');
            console.log(user);
            // ubacivanje na listu na ekranu
            if (user._id) {
              // 
              //izmjena  u listi
              //$scope.users[$scope.users.findIndex(function(obj){return obj._id == user._id})]=user;
  
              console.log('UPDATEEEEE');
              Users.update(user);
              $scope.users = Users.query();

            } else {
              
              Users.save(user, function(resuser){
                if (resuser) {
                  $scope.users.push(resuser);
                };
              });         // spremanje u bazu

            }
        }, function () {
            console.log('Modal dismissed');
        });
        
        $rootScope.modalInstance = modalInstance;
    };


}).controller('UserConfirmInstanceCtrl', function ($uibModalInstance,user) {
    console.log('confirminstance');
    console.log(user.name);
   // this.name=user.ime;
    this.confirmtext = 'Are you sure you want to delete "'+user.name+'" ?'
    this.ok = function () {
      $uibModalInstance.close(user);
    };
  
    this.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
}).controller('UserEditInstanceCtrl', function ($uibModalInstance, user) {
  console.log('instance init');
    var $ctrl = this;
    $ctrl.user=user;
    $ctrl.ok = function(){
      console.log('Instance OK');
      console.log($ctrl.user);
      $uibModalInstance.close($ctrl.user);
    };
    $ctrl.cancel = function(){
      $uibModalInstance.dismiss();
    };
  })
;