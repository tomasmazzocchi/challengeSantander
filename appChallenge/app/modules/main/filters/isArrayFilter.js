'use strict';
angular
    .module('main')
    .filter('isArray', function() {
        return function(input) {
            return angular.isArray(input);
        };
    });