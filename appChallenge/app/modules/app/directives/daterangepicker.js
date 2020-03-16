'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:daterangepicker
 * @description
 * # daterangepicker
 */
angular.module('app')
  .directive('daterangepicker', function() {
    return {
      restrict: 'A',
      scope: {
        options: '=daterangepicker',
        start: '=dateBegin',
        end: '=dateEnd'
      },
      link: function(scope, element) {
        element.daterangepicker(scope.options, function(start, end) {
          scope.start = start.format('DD/MM/YYYY');
          scope.end = end.format('DD/MM/YYYY');
          scope.$apply();
        });
  //    element.on('apply.daterangepicker', scope.options.eventHandlers['apply.daterangepicker']);
      }
    };
  });

