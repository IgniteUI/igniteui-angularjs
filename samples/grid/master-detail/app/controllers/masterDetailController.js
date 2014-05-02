app.controller('masterDetailController',
               
            ['$scope', 'dataService',
    function ($scope,   dataService) {
        
        'use strict';
        
        $scope.error = null;
        
        $scope.message = '';
        
        $scope.homesGridRendered = function(e){
            $scope.message = 'Grid is rendered';
        };
        
        $scope.homesGridColumnSorted = function(e, u){
            $scope.message = 'Column sorted';
        };
        
        $scope.homesGridRowSelectionChanged = function(e, u){
            $scope.message = 'Row selection changed'
        };
        
        $scope.homesGridPageSelectionChanged = function(e, u){
            $scope.message = 'Page selection changed';
        };
        
        dataService.getAll().then(function(homes){
            $scope.homes = homes;
        }, function(error){
            $scope.error = error;
        });

    }]);