'use strict';
angular.module('app')
        .directive('typeaheadTrigger', function() {   
    return {      
      require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            angular.element("#typeaheadTrigger").bind('click', function () {                
                element.focus();
                ctrl.$setViewValue();
                element.trigger('input');
                element.trigger('change');
            });
        }
    };
});
