'use strict';
angular.module('app')
        .directive('clickDisabler', function($http, $rootScope) {   
    return {      
      compile :
             function(tElement, tAttrs, transclude){
          tAttrs.ngClick = "!(" + tAttrs.clickDisabler +") && ("+tAttrs.ngClick+");isRequesting = true";
            return function (scope, iElement, iAttrs) {
                iElement.on("click",function(){
                    $rootScope.isRequesting = true;
                });          
                scope.isLoading = function () {                    
                    return $http.pendingRequests.length > 0 && scope.isRequesting;
                };
                
                scope.$watch(scope.isLoading, function(v) {                    
                    if (v) {                        
                        $rootScope.isRequesting = true;
                        iElement.disabled = true;
                        scope.isRequesting = true;
                    } else {                        
                        iElement.disabled = false;
                        scope.isRequesting = false;
                    }
                });
                
                scope.$watch(iAttrs.clickDisabler, function(newValue, oldValue) {                  
                    if (newValue !== undefined) {                         
                        iElement.toggleClass("disabled", newValue);
                        iElement.disabled = newValue;
                    }
                }, true);
            };                
        }
    };
});

