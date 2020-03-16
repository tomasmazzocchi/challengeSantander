'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:tileControlToggle
 * @description
 * # tileControlToggle
 */
angular.module('app')
        .directive('pageLoaderAutocomplete', [
    '$http','$rootScope',
    function ($http, $rootScope) {
      return {
        restrict: 'E',
        template: '<div ng-show="loadingLocations" class="pl-5"><div class="ajaxloaderModule animate"><div class="dot1"></div><div class="dot2"></div></div></div>',   
        replace :true,
        compile :
             function(tElement, tAttrs, transclude){                                                          
            }
      };
    }
  ]);