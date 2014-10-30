angular.module('TarPredApp')
.controller('resultController', function($scope, $routeParams, $cookies, jobService){
    if (!$cookies.user){
        noty({text: 'Please sign in!', timeout: 1000});
        $location.path('/signin');
    }else{
        jobService.details($routeParams.id).success(function(res){
            $scope.smiles = res.smiles;
            $scope.results = res.results;
            for (var i = 0; i < $scope.results.length; i++) {
                for (var j = 0; j < $scope.results[i].neighbors.length; j ++) {
                    jobService.svg($scope.results[i].neighbors[j]._id).success(function(res){
                        var svg = res.svg.replace(/(\r\n|\n|\r)/gm,"");
                        $scope.results[i].neighbors[j].svg = svg;
                    });
                }
            };
        });
    }
});