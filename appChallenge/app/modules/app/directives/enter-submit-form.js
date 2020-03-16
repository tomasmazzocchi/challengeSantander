'use strict';
angular.module('app').directive('enterSubmitForm', function() {
        return { 
            restrict: 'A' ,
            link : function(scope, element, attrs) {
            element.on("keydown", function(event) {       
                var attributes = scope.$eval(attrs.enterSubmitForm);
                if(attributes.valida && event.which === 13) {    
                    scope.isRequesting = true;                    
                   scope.$apply(function(){
                       scope.$eval(attributes.submit, {'event': event});
                   });                                                               
                }
            });
        }
    };
    });