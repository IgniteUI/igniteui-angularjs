app.controller('masterDetailController',
               
            ['$scope', 'dataService',
    function ($scope,   dataService) {
        
        'use strict';
        
        $scope.error = null;
        
        $scope.message = '';

        $scope.selectedHome = null;
        
        $scope.save = function(){
            dataService.save($scope.selectedHome).then(function(){
                $scope.selectedHome = null;
                $scope.message = 'Home saved';
            }, 
            function(error){
                $scope.error = error;
            });
        };
        
        $scope.cancel = function(){
            $scope.selectedHome = null;
        };
        
        dataService.getAll().then(function(homes){
            $scope.homes = homes;
        }, function(error){
            $scope.error = error;
        });
        
        // **** Grid-related event handlers ********
        $scope.homesGridRendered = function(e){
            $scope.message = 'Grid is rendered';
        };
        
        $scope.homesGridColumnSorted = function(e, u){
            $scope.$apply(function () {
                $scope.message = 'Column sorted';
            });
        };
        
        $scope.homesGridPageSelectionChanged = function(e, u){
            $scope.$apply(function () {
                $scope.message = 'Page index changed';
            });
        };
        
        $scope.homesGridPageSizeChanged = function(e, u){
            $scope.$apply(function () {
                $scope.message = 'Page size changed';
            });
        };
        
        $scope.homesGridRowSelectionChanged = function (e, ui) {
        
            var id = ui.row.id;
            
            $scope.homes.forEach(function(home){
                if(home.id === id){
                    $scope.$apply(function () {
                        $scope.selectedHome = home;
                        $scope.message = "'" + $scope.selectedHome.streetAddress + "' is selected";
                    });
                }
            });
        };
        // *****************************************

    }]);