angular.module('TarPredApp')
.controller('indexController', function($scope, $rootScope, $location){
    $scope.logout = function(){
        noty({text: 'Signout successful!', type:'success', timeout: 1000});
        $rootScope.user = null;
        $rootScope.pass = null;
        $location.path('/');
        return false;
    };
});