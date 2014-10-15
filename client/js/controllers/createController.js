angular.module('TarPredApp')
.controller('createController', function($scope, $cookies, $timeout, $location, jobService, captchaService){
    if (!$cookies.user){
        noty({text: 'Please sign in!', timeout: 1000});
        $location.path('/signin');
    }else{
        var addSmilesListener = function(){
            try{
                JSApplet.JSME.replaceAllAppletsByJSME(function(jmeInstance){
                    jmeInstance.setAfterStructureModifiedCallback(function(jsme) {
                        $scope.$apply(function(){
                            $scope.smiles = jsme.src.smiles();
                        });
                    });
                });
                document.jme.setAfterStructureModifiedCallback(function(jsme){
                    $scope.$apply(function(){
                        $scope.smiles = jsme.src.smiles();
                    });                    
                })
            }catch(e){
                $timeout(addSmilesListener, 500);
            }
        }
        addSmilesListener();
        
        $scope.submitJob = function(){
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

    }
});