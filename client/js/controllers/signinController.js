angular.module('TarPredApp')
.controller('signinController', function($scope, $rootScope, $location, userService){
    $scope.submitForm = function(){
        userService.login(
            $scope.username,
            $scope.password
        ).success(function(){
            noty({text: 'Login successful!', type:'success', timeout: 1000});
            $rootScope.user = $scope.username;
            $rootScope.pass = $scope.password;
            $location.path('/');
        }).error(function(res){
            noty({text: res.error, type:'error', timeout: 1000});
        });
    }
});