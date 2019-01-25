angular.module('app')
.controller ('ticketDetCtrl', function ($scope, $uibModal, $rootScope,Tickets,$routeParams, Users){

    $scope.ticket = Tickets.get({id:$routeParams.id});
    console.log($scope.ticket);

    $scope.openeditnote = function () {
       console.log(' note modal');
        $rootScope.modaltitle = "New note"
        users = Users.query();
        statuslist = Tickets.statuslist();
        modalInstance = $uibModal.open({
            // kontroler koji se koristi za modalni prozor
            controller: 'NoteInstanceCtrl',
            controllerAs: '$ctrl',
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'ticketdet/note_modal.html' ,
            // vrijednost koja se proslijeđuje u kontroler kao lokana varijabla 
            resolve: {
              users: function() {return users},
              assignedto : function() { 
                  if($scope.ticket.assignedto) {
                    return  $scope.ticket.assignedto._id 
                  };
                },
              statuslist : function() {return statuslist}, 
              status: function() {return $scope.ticket.status}
            }         
        });
  
        modalInstance.result.then(function (data) {
            console.log('Modal OK clicked');
            console.log(data.notetext);
            console.log(data.assignedto);
            console.log("autor note "+$rootScope.appuser);
            // ubacivanje na listu na ekranu
              $scope.ticket.notes.push (
                {
                  notetext : data.notetext,
                  noteauthor : $rootScope.appuser
                }
              );

              //if ( $scope.ticket.assignedto ) {
                $scope.ticket.assignedto=data.assignedto; //$scope.ticket.assignedto._id;
              //};

              $scope.ticket.status=data.status; 

              Tickets.update($scope.ticket, function(resticket){
                /*if (resticket) {
                  $scope.tickets.push(resticket);
                };*/

              });         // spremanje u bazu
              //ponovo čitanje iz baze 
              $scope.ticket = Tickets.get({id:$scope.ticket._id});
        }, function () {
            console.log('Modal dismissed');
        });
        
        $rootScope.modalInstance = modalInstance;
    };

    $scope.openassign = function () {
       $rootScope.modaltitle = "Asign ticket"
       users = Users.query();
       statuslist = Tickets.statuslist();

       modalInstance = $uibModal.open({
           // kontroler koji se koristi za modalni prozor
           controller: 'AssignInstanceCtrl',
           controllerAs: '$ctrl',
           animation: true,
           ariaLabelledBy: 'modal-title',
           ariaDescribedBy: 'modal-body',
           templateUrl: 'ticketdet/noteassign_modal.html' ,
           // vrijednost koja se proslijeđuje u kontroler kao lokana varijabla 
           resolve: {
             assignedto: function () {
               if($scope.ticket.assignedto) {
                  return  $scope.ticket.assignedto._id 
                } ;
             },
             users: function() {return users},
             statuslist : function() {return statuslist}, 
             status: function() {return $scope.ticket.status}
           }         
       });
 
       modalInstance.result.then(function (data) {
           console.log('Modal OK clicked');
             $scope.ticket.assignedto=data.assignedto; //$scope.ticket.assignedto._id;
             $scope.ticket.status=data.status; 
             Tickets.update($scope.ticket);         // spremanje u bazu
             $scope.ticket = Tickets.get({id:$scope.ticket._id}); // učitavanje 
       }, function () {
           console.log('Modal dismissed');
       });
       
       $rootScope.modalInstance = modalInstance;
   };

}).controller('NoteInstanceCtrl', function ($uibModalInstance, users,assignedto,statuslist,status) {
    var $ctrl = this;
    $ctrl.notetext='';
    $ctrl.users=users;
    $ctrl.assignedto=assignedto;

    $ctrl.statuslist=statuslist;
    $ctrl.newStatus=status;
    

    $ctrl.ok = function(){
      console.log('Instance OK');
      console.log($ctrl.assignedto);
      $uibModalInstance.close({'notetext':$ctrl.notetext, 'assignedto':$ctrl.assignedto, 'status':$ctrl.newStatus});
    };

    $ctrl.cancel = function(){
      $uibModalInstance.dismiss();
    };

  }).controller('AssignInstanceCtrl', function ($uibModalInstance,assignedto,users,statuslist,status) {
    var $ctrl = this;
    $ctrl.assignedto=assignedto;
    $ctrl.users=users;
    
    $ctrl.statuslist=statuslist;
    $ctrl.newStatus=status;

    $ctrl.ok = function(){
      console.log('Instance OK');
      $uibModalInstance.close({'assignedto':$ctrl.assignedto, 'status':$ctrl.newStatus});
    };
    $ctrl.cancel = function(){
      $uibModalInstance.dismiss();
    };
  })
;