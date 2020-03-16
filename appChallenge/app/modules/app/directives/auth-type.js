'use strict';
angular.module('app').directive('authType', function() {
        return { 
            restrict: 'A' ,
            scope: {
             type: '=type'
            },
            compile : function(tElement, tAttrs, transclude){
            return  function(scope, element, attrs) {                      
            if(scope.type !== ""){
                tElement.hide();
            }
        };
        }
    };
});

