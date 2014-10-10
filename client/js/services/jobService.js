angular.module('TarPredApp')
.factory('jobService', function($http){
    var jobServiceAPI = {};

    jobServiceAPI.create = function(username, password, smiles, captcha_id, captcha_code){
        return $http.post('/create', {
            username: username,
            password: password,
            smiles: smiles,
            captcha_id: captcha_id,
            captcha_code: captcha_code
        });
    };

    jobServiceAPI.list = function(username, password){
        return $http.post('/list', {
            username: username,
            password: password
        });
    };

    jobServiceAPI.progress = function(id){
        return $http.post('/progress', {
            id: id
        });
    };

    jobServiceAPI.download = function(id){
        return $http.get('/download/' + id);
    };

    return jobServiceAPI;
});
