'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:tileControlToggle
 * @description
 * # tileControlToggle
 */
angular.module('app')
        .directive('pageLoaderModule', 
    function ($http, $rootScope) {
      return {
        restrict: 'E',
        template: '<div class="pageloaderModule"><div class="dot1"></div><div class="dot2"></div></div>',   
        replace :true,
        compile :
             function(tElement, tAttrs, transclude){                     
                    return function (scope, tElement, iAttrs) {      
                $rootScope.isRequestingWithoutRequest = false;
                tElement.addClass("hide");                       
                scope.isLoading = function () {
                    return ($http.pendingRequests.length > 0 && scope.isRequesting && !$rootScope.isRequesting) || $rootScope.isRequestingWithoutRequest ;
                };
                
                scope.$watch(scope.isLoading, function(v) {                                            
                    if(v !== undefined){
                        var next = tElement.next();                         
                        if(v) {                     
                            next.show();                                                                                              
                        var top =   next.offset().top + (next.outerHeight() /2) + "px";
                        var left =  next.offset().left  + (next.outerWidth() / 2) + "px";
                        tElement.css({top : top, left : left});                       
                        next.addClass("opacityLoading");    
                        tElement.addClass('animate').removeClass('hide');                            
                        
                        }else {
                            next.removeClass("noVisibility").removeClass("opacityLoading");                             
                            tElement.addClass('hide').removeClass('animate');  
                        }                                                                                                  
                        scope.isRequesting = v;                         
                    }
                });            
            };                
        }
      };
    }
  );