'use strict';
angular.module('app').directive('perfilDisabler', function(UserProfileService) {
        return { 
            restrict: 'A' ,          
            scope: true,
            link: function (scope, elem, attrs) {                      
                if(!UserProfileService.get().usuario.esMedico || UserProfileService.get().usuario.esReadOnly) {                       
                    elem.addClass("disabled");
                    elem.prop("disabled");                    
                    elem.css("pointer-events","auto");    
                    scope.bloqueado = true;
                }                
            }           
    };
});


