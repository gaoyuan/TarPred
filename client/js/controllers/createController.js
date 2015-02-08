angular.module('TarPredApp')
.controller('createController', function($scope, $cookies, $timeout, $location, jobService, captchaService){
    var marvinSketcherInstance;
    angular.element(document).ready(function () {
        MarvinJSUtil.getEditor("#sketch").then(function(sketcherInstance) {
            marvinSketcherInstance = sketcherInstance;
            addSmilesListener();
        }, function(error) {
            alert("Loading of the sketcher failed"+error);
        });
    });

    var addSmilesListener = function(){
        marvinSketcherInstance.on('molchange', function(){
            marvinSketcherInstance.exportStructure("smiles").then(function(source) {
                $scope.$apply(function(){
                    $scope.smiles = source; 
                });
            });
        });
    };

    var create = function(){
        jobService.create(
            $cookies.user,
            $cookies.pass,
            $scope.smiles,
            $scope.captcha_id,
            $scope.code
        ).success(function(){
            noty({text: 'Job created successfully!', type:'success', timeout: 1000});
            $location.path('/view');
        }).error(function(res){
            noty({text: res.error, type:'error', timeout: 1000});
            if (res.error == 'Incorrect validation code'){
                $scope.captcha_id = res.id;
                $scope.image = 'data:image/png;base64,' + res.captcha;
            }else{
                $location.path('/');
            }
        });
    };
    
    var createUnregistered = function(){
        jobService.createUnregistered(
            $scope.smiles,
            $scope.captcha_id,
            $scope.code
        ).success(function(res){
            noty({text: 'Job created successfully!', type:'success', timeout: 1000});
            $location.path('/view/' + res.id);
        }).error(function(res){
            noty({text: res.error, type:'error', timeout: 1000});
            if (res.error == 'Incorrect validation code'){
                $scope.captcha_id = res.id;
                $scope.image = 'data:image/png;base64,' + res.captcha;
            }else{
                $location.path('/');
            }
        });
    };

    $scope.submitJob = function(){
        if (!$cookies.user){
            createUnregistered();
        }else{
            create();
        }
    };

    if (!$cookies.user){
        $scope.unregistered = true;
    }else{
        $scope.unregistered = false;
    }

    captchaService.create().success(function(res){
        $scope.captcha_id = res.id;
        $scope.image = 'data:image/png;base64,' + res.captcha;
    }).error(function(res){
        noty({text: res.error, type:'error', timeout: 1000});
    });

    $scope.updateCaptcha = function(){
        captchaService.update($scope.captcha_id).success(function(res){
            $scope.image = 'data:image/png;base64,' + res.captcha;
        }).error(function(res){
            noty({text: res.error, type:'error', timeout: 1000});
        })
    };
});