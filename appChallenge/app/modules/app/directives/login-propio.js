'use strict';
angular.module('app').directive('loginPropio', function() {
        return { 
            restrict: 'A' ,
            scope: {
             custom: '=custom'
            },
            compile : function(tElement, tAttrs, transclude){
            return  function(scope, element, attrs) {                  
                if(scope.custom !== undefined){
            var css = scope.$eval('('+scope.custom.positionLogin+')');
            if(css){
                 css.position = "absolute";
                 element.find(".container").css(css);
            }           
            element.find(".custom-login").css({backgroundColor: scope.custom.colorHeader});
            element.css({background: 'url('+scope.custom.imgLogin+') no-repeat', backgroundSize : '100% 100%'});
                }
        };
    }
};
    });
