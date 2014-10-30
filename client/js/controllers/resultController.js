angular.module('TarPredApp')
.controller('resultController', function($scope, $routeParams, $cookies, jobService){
    if (!$cookies.user){
        noty({text: 'Please sign in!', timeout: 1000});
        $location.path('/signin');
    }else{
    	jobService.details($routeParams.id).success(function(res){
    		$scope.smiles = res.smiles;
    		$scope.results = res.results;
    	});
    }
});