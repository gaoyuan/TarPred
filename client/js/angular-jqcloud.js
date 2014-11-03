angular.module('angular-jqcloud', []).directive('jqcloud', function() {
  return {
    restrict: 'E',
    template: '<div class="col-md-6"></div>',
    replace: true,
    scope: {
      words: '@words'
    },
    link: function(scope, elem, attrs) {
      if (scope.words === undefined) {
        return;
      } else if (scope.words.length === 0) {
        if (attrs.colorclass){
          // inferenced
          elem.append("<p>Inferenced disease information in not available for this target.</p>");
        } else {
          // direct
          elem.append("<p>Direct disease information in not available for this target.</p>");
        }
      } else {
        if (attrs.colorclass) {
          elem.jQCloud(scope.words, {
            classPattern: null,
            colors: ['rgb(255,245,240)','rgb(254,224,210)','rgb(252,187,161)','rgb(252,146,114)','rgb(251,106,74)','rgb(239,59,44)','rgb(203,24,29)','rgb(165,15,21)','rgb(103,0,13)']
          });
          scope.watch('words', function(value){
            elem.jQCloud(value, {
              classPattern: null,
              colors: ['rgb(255,245,240)','rgb(254,224,210)','rgb(252,187,161)','rgb(252,146,114)','rgb(251,106,74)','rgb(239,59,44)','rgb(203,24,29)','rgb(165,15,21)','rgb(103,0,13)']
            });
          });
        } else {
          elem.jQCloud(scope.words);
          scope.watch('words', function(value){
            elem.jQCloud(value);
          })
        }
      }
      elem.bind('$destroy', function() {
        elem.jQCloud('destroy');
      });
    }
  };
});
