angular.module('TarPredApp')
.controller('resultController', function($scope, $routeParams, $cookies, jobService){
    if (!$cookies.user){
        noty({text: 'Please sign in!', timeout: 1000});
        $location.path('/signin');
    }else{
        jobService.preview($routeParams.id).success(function(res){
            $scope.smiles = res.smiles;
            $scope.results = res.results;
            $scope.detail = function(result_index){
                jobService.details($routeParams.id, result_index).success(function(res){
                    console.log(res);
                });
            };
            // get all the unique structures we need to render
            /*
            var tasks = [];
            for (var i = 0; i < $scope.results.length; i++) {
                for (var j = 0; j < $scope.results[i].neighbors.length; j ++) {
                    var tmp = $scope.results[i].neighbors[j]._id;
                    if (tasks.indexOf(tmp) == -1){
                        tasks.push(tmp);
                    }
                }
            }
            var renderSvgs = function(ids){
                var id = ids.shift();
                if (id === undefined){
                    return;
                }
                jobService.svg(id).success(function(res){
                    var svg = res.svg.replace(/(\r\n|\n|\r)/gm,'')
                        .replace('<?xml version=\"1.0\"?>', '')
                        .replace('xmlns.+schema\"', '');
                    angular.element('._' + id).html(svg);
                    renderSvgs(ids);
                });
            };
            renderSvgs(tasks);
            */
            // download the result
            $scope.download = function(){
                var filename = res._id + '.tsv'
                    ,rowEnd = '"\r\n"'
                    ,results = res.results;

                var tsv = '"Target Name (BindingDB)"\t"Target Name (DrugBank)"\t"Gene ID"\t"3NN score"\t"Related Diseases"\t"Similar Structures"' + rowEnd;
                for (var i = 0; i < results.length; i++) {
                    for (var j = 0; j < results[i].bindingDB.length; j++) {
                        tsv += '"' + results[i].bindingDB[j] + '"';
                        if (j != results[i].bindingDB.length - 1){
                            tsv += ',';
                        }
                    }
                    tsv += '\t'
                    for (var j = 0; j < results[i].drugbank.length; j++) {
                        tsv += '"' + results[i].drugbank[j] + '"';
                        if (j != results[i].drugbank.length - 1){
                            tsv += ',';
                        }
                    }
                    tsv += '\t';
                    tsv += '"' + results[i].GeneID + '"';
                    tsv += '\t';
                    tsv += '"' + results[i].score.toString() + '"';
                    tsv += '\t';
                    for (var j = 0; j < results[i].diseases.length; j++) {
                        tsv += '"' + results[i].diseases[j] + '"';
                        if (j != results[i].diseases.length - 1){
                            tsv += ',';
                        }
                    }
                    tsv += '\t';
                    for (var j = 0; j < results[i].neighbors.length; j++) {
                        tsv += '"' + results[i].neighbors[j].smiles + '"';
                        if (j != results[i].neighbors.length - 1){
                            tsv += ',';
                        }
                    }
                    tsv += rowEnd;
                };
                var tsvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(tsv);
                angular.element("#download").attr({
                    'download': filename,
                    'href': tsvData
                });
            };
        });
    }
});