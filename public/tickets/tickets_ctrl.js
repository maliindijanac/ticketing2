angular.module('app')
.controller ('ticketsCtrl', function ($scope, $uibModal, $rootScope,Tickets){
    $scope.tickets = Tickets.query();

    $scope.confirmdelete = function (inticket,msg) {
      console.log('confirmdelete modal');
      console.log(inticket.subject);
      modalInstance = $uibModal.open({
          controller: 'ConfirmInstanceCtrl',
          controllerAs: 'pc',
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'ConfirmModal.html',    
          backdrop: 'statisc',    
          resolve: {
            text: function () {
              return msg;
            }
          }     
      });
  
      modalInstance.result.then(function (ticket) {
          console.log('confirm Modal OK clicked');
          console.log(inticket);
            // brisanje sa liste
            //ticketindex = $scope.tickets.indexOf(ticket);
            //$scope.tickets.splice(ticketindex, 1);
            //brisanje iz baze
            inticket.$delete();
            $scope.tickets = Tickets.query();

  
      }, function () {
          console.log('ConfirmModal dismissed');
      });
      
      $rootScope.modalInstance = modalInstance;
    };


     $scope.openedit = function (inticket) {
        if (inticket) {
          $rootScope.modaltitle = "Edit ticket";
          // napraviti kopiju 
          ticket = {
                _id  : inticket._id,
                subject : inticket.subject,
                description : inticket.description
          };
  
        } else {
           $rootScope.modaltitle = "New ticket";
           ticket = inticket;
        };   
        
        modalInstance = $uibModal.open({
            // kontroler koji se koristi za modalni prozor
            controller: 'EditInstanceCtrl',
            controllerAs: '$ctrl',
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'tickets/tickets_modal.html' ,
            // vrijednost koja se proslijeđuje u kontroler kao lokana varijabla 
            resolve: {
              ticket: function () {
                return ticket;
              }
            }         
        });
  
        modalInstance.result.then(function (ticket) {
            console.log('Modal OK clicked');
            console.log(ticket);
            // ubacivanje na listu na ekranu
            if (ticket._id) {
              // 
              //izmjena  u listi
              //$scope.tickets[$scope.tickets.findIndex(function(obj){return obj._id == ticket._id})]=ticket;
  
              console.log('UPDATEEEEE');
              Tickets.update(ticket);
              $scope.tickets = Tickets.query();

            } else {
              
              Tickets.save(ticket, function(resticket){
                if (resticket) {
                  $scope.tickets.push(resticket);
                };
              });         // spremanje u bazu

            }
        }, function () {
            console.log('Modal dismissed');
        });
        
        $rootScope.modalInstance = modalInstance;
    };

}).controller('EditInstanceCtrl', function ($uibModalInstance,ticket) {
    var $ctrl = this;
    $ctrl.ticket=ticket;
    $ctrl.ok = function(){
      console.log('Instance OK');
      console.log($ctrl.ticket);
      $uibModalInstance.close($ctrl.ticket);
    };
    $ctrl.cancel = function(){
      $uibModalInstance.dismiss();
    };
  })
;