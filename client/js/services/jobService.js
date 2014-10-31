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

    jobServiceAPI.preview = function(id){
        return $http.post('/preview', {
            id: id
        });        
    }

    jobServiceAPI.details = function(job_id, result_index){
        return $http.post('/details', {
            job_id: job_id,
            result_index: result_index
        });        
    }

    jobServiceAPI.progress = function(id){
        return $http.post('/progress', {
            id: id
        });
    };

    jobServiceAPI.svg = function(id){
        return $http.post('/svg', {
            id: id
        });
    };

    return jobServiceAPI;
});
