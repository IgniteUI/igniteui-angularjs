app.factory('dataService', 
            
            ['$http', '$q', 
     function($http,   $q){
         
         'use strict';
         
         var svc = {
             
            getAll: function(){
                
                var deferred = $q.defer();
                
                $http.get('/api/homes').success(deferred.resolve).error(deferred.reject);
                
                return deferred.promise;
            },
             
            save: function (home) {
                    var deferred = $q.defer();

                    $http.post('/api/homes', home).success(function (result) {
                        deferred.resolve(result);
                    }).error(deferred.reject);

                    return deferred.promise;
                },
         };
         
         return svc;

     }]);