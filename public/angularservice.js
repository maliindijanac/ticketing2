angular.module('app')
.factory('Tickets', ['$resource', function($resource){
    return $resource('/tickets/:id', { id: '@_id' }, {
        'update' : {method : 'PUT'},
        'statuslist' : {url : '/tickets/statuslist', method : 'GET', isArray : true},
    });
  }])
.factory('Users', ['$resource', function($resource){
    return $resource('/users/:id', { id: '@_id' }, {
        'update' : {method : 'PUT'},
        'register' : {url:'users/register', method : 'POST'}
    });
    
    /* bez parametara se dobije default struktura za operacije 
    
    https://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/

    get()    ->GET
    query()  ->GET
    save()   -> POST   
    remove() -> DELETE
    delete() -> DELETE
---
    update nije u defaultu 
    update () -> PUT
--    { id: '@_id' }
    vrijednost objekat._id će biti proslijeđena kao parametar id

    */
    
  }])
  .factory('Login', ['$resource', function($resource){
    return $resource('/users/login');
  }]);    
;