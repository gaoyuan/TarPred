angular.module('TarPredApp')
.controller('viewController', function($scope, $rootScope, $location, jobService){
    if (!$rootScope.user){
        noty({text: 'Please sign in!', timeout: 1000});
        $location.path('/signin');
    }else{
        jobService.list(
            $rootScope.user, 
            $rootScope.pass
        ).success(function(res){
            $scope.jobs = res;
            $scope.download = function(id){
                jobService.download(id).success(function(){
                }).error(function(){
                    noty({text: 'Download error!', type:'error', timeout: 1000});
                });
            };
        }).error(function(res){
            noty({text: res.error, type:'error', timeout: 1000});
            $location.path('/');
        });
    }
});