'use strict';
angular.module('app').directive('navPropio', function() {
        return { 
            restrict: 'A' ,
            scope: {
             custom: '=custom'
            },
            compile : function(tElement, tAttrs, transclude){
            return  function(scope, element, attrs) {          
            if(scope.custom.colorHeader !== null){                            
            //element.css({backgroundColor: scope.custom.colorHeader}).find("*").css({backgroundColor: scope.custom.colorHeader, color: scope.custom.fontColorHeader});            
            }
            if(scope.custom.imgHeader !== null){
                element.find(".branding").replaceWith("<img src='"+scope.custom.imgHeader+"'/>");
            }
        };
        }
    };
});