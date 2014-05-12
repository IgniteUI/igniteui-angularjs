app.controller('masterDetailController',
               
            ['$scope', 'dataService',
    function ($scope,   dataService) {
        
        'use strict';
        
        $scope.error = null;
        
        $scope.message = '';

        $scope.selectedHome = null;
        
        $scope.homesGridRendered = function(e){
            $scope.message = 'Grid is rendered';
        };
        
        $scope.homesGridColumnSorted = function(e, u){
            $scope.$apply(function () {
                $scope.message = 'column sorted';
            });
        };
        
        $scope.homesGridRowSelectionChanged = function (e, u) {
            var
                grid = u.owner.grid,
                index = u.row.index;

            grid.options.features.forEach(function (feature) {
                if (feature.name.toLowerCase() === 'paging') {

                    // ?? is there a more 'Angular' way to get at these 
                    // behaviors other than having to do direct DOM selection?
                    var pageIndex = $('#' + grid.id()).igGridPaging('option', 'currentPageIndex');
                    var pageSize = $('#' + grid.id()).igGridPaging('option', 'pageSize');
                    if (pageIndex > 0) {
                        index += (pageIndex * pageSize);
                    }
                }
            });

            $scope.$apply(function () {
                $scope.selectedHome = $scope.homes[index];
            });
        };
        
        $scope.homesGridPageSelectionChanged = function(e, u){
            $scope.$apply(function () {
                $scope.message = 'page index changed';
            });
        };
        
        dataService.getAll().then(function(homes){
            $scope.homes = homes;
        }, function(error){
            $scope.error = error;
        });

    }]);