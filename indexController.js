angular.module('app').controller('indexController',
               
            ['$scope', 'northwindEmployees',
    function ($scope,   northwindEmployees) {
        
        'use strict';
        
        $scope.employees = northwindEmployees.data.slice(0,4);
        
        $scope.firstEmployee = $scope.employees[0];

    }]);