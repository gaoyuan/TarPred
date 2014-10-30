angular.module('TarPredApp')
.controller('resultController', function($scope, $routeParams, $cookies, jobService){
    if (!$cookies.user){
        noty({text: 'Please sign in!', timeout: 1000});
        $location.path('/signin');
    }else{
        jobService.details($routeParams.id).success(function(res){
            $scope.smiles = res.smiles;
            $scope.results = res.results;
            var tasks = [];
            for (var i = 0; i < $scope.results.length; i++) {
                for (var j = 0; j < $scope.results[i].neighbors.length; j ++) {
                    tasks.push($scope.results[i].neighbors[j]._id);
                }
            }
            var renderSvgs = function(ids){
                var id = ids.shift();
                if (id === undefined){
                    return;
                }
                jobService.svg($scope.results[i].neighbors[j]._id).success(function(res){
                    var svg = res.svg.replace(/(\r\n|\n|\r)/gm,"");
                    angular.element.find('#' + id).html(svg);
                    renderSvgs(ids);
                });
            };
            renderSvgs(tasks);
        });
    }
});