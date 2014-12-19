angular.module('TarPredApp')
.run(function($anchorScroll) {
    $anchorScroll.yOffset = 100;
})
.controller('resultController', function($scope, $routeParams, $cookies, $location, $anchorScroll, $timeout, jobService){
    if (!$cookies.user){
        noty({text: 'Please sign in!', timeout: 1000});
        $location.path('/signin');
    }else{
        jobService.preview($routeParams.id).success(function(res){
            $scope.inSmiles = true;
            $scope.preDownload = true;
            $scope.inDownload = false;
            $scope.afterDownload = false;
            $scope.results = res.results;
            $scope.showDetail = false;

            jobService.structure(res.smiles).success(function(res){
                $scope.inSmiles = false;
                $scope.smiles = res.data[0].image.imageUrl;
            })

            angular.element('.glyphicon-question-sign').tooltip();

            var renderSvgs = function(ids){
                var id = ids.shift();
                if (id === undefined){
                    return;
                }
                jobService.svg(id).success(function(res){
                    var svg = res.svg.replace(/(\r\n|\n|\r)/gm,'')
                        .replace('<?xml version=\"1.0\"?>', '')
                        .replace('xmlns.+schema\"', '');
                    angular.element('#_' + id).html(svg);
                    renderSvgs(ids);
                });
            };

            $scope.detail = function(result_index){
                jobService.details($routeParams.id, result_index).success(function(res){
                    $scope.ranking = result_index + 1;
                    $scope.showDetail = true;
                    $scope.bindingDB = res.bindingDB;
                    $scope.drugbank = res.drugbank;
                    $scope.GeneIDs = res.GeneIDs;
                    $scope.score = res.score;
                    $scope.diseasesDE = '';
                    for (var i = 0; i < res.diseasesDE.length; i++) {
                        $scope.diseasesDE += res.diseasesDE[i].name + '(' + res.diseasesDE[i].count.toString() + ')';
                        if (i != res.diseasesDE.length - 1){
                            $scope.diseasesDE += ', ';
                        }
                    };
                    $scope.words = [];
                    for (var i = 0; i < res.diseasesINF.length; i++) {
                        $scope.words.push({
                            text: res.diseasesINF[i].name,
                            weight: res.diseasesINF[i].count
                        });
                    };
                    $scope.neighbors = res.neighbors;
                    ids = [];
                    for (var i = 0; i < res.neighbors.length; i++) {
                        ids.push(res.neighbors[i]._id);
                    };
                    $timeout(function(){
                        var old = $location.hash();
                        $location.hash('showDetail');
                        $anchorScroll();
                        $location.hash(old);
                        renderSvgs(ids);
                    }, 0);
                });
            };
            // generate download link
            $scope.generateDownload = function(){
                $scope.preDownload = false;
                $scope.inDownload = true;
                jobService.results($routeParams.id).success(function(res){
                    var filename = $routeParams.id + '.tsv'
                        ,rowEnd = '\r\n'
                        ,results = res.results;

                    var tsv = '"Target Name (BindingDB)"\t"Target Name (DrugBank)"\t"Gene ID"\t"3NN score"\t"Related Diseases (Direct)"\t"Related Diseases (Inference)"\t"Similar Structures"' + rowEnd;
                    for (var i = 0; i < results.length; i++) {
                        tsv += '"';
                        tsv += results[i].bindingDB.join('|');
                        tsv += '"\t"';
                        tsv += results[i].drugbank.join('|');
                        tsv += '"\t"';
                        tsv += results[i].GeneIDs;
                        tsv += '"\t';
                        tsv += results[i].score.toString();
                        tsv += '\t"';
                        for (var j = 0; j < results[i].diseasesDE.length; j++) {
                            tsv += results[i].diseasesDE[j].name + ':' + results[i].diseasesDE[j].count.toString();
                            if (j != results[i].diseasesDE.length - 1){
                                tsv += '|';
                            }
                        }
                        tsv += '"\t"';
                        for (var j = 0; j < results[i].diseasesINF.length; j++) {
                            tsv += results[i].diseasesINF[j].name + ':' + results[i].diseasesINF[j].count.toString();
                            if (j != results[i].diseasesINF.length - 1){
                                tsv += '|';
                            }
                        }
                        tsv += '"\t"';
                        for (var j = 0; j < results[i].neighbors.length; j++) {
                            tsv += results[i].neighbors[j].smiles;
                            if (j != results[i].neighbors.length - 1){
                                tsv += '|';
                            }
                        }
                        tsv += '"';
                        tsv += rowEnd;
                    };
                    var tsvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(tsv);
                    angular.element("#download").attr({
                        'download': filename,
                        'href': tsvData
                    });
                    $scope.inDownload = false;
                    $scope.afterDownload = true;
                });
            };
        });
    }
});