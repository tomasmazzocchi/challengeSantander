'use strict';

/**
 * @ngdoc object
 * @name core.config
 * @requires ng.$stateProvider
 * @requires ng.$urlRouterProvider
 * @description Defines the routes and other config within the core module
 */
angular.module('app').config(['$stateProvider',
    function ($stateProvider) {        
        $stateProvider
                .state('app', {
                    url: '',
                    abstract: true,
                    template: '<div ui-view></div>',
                    controller: 'ApplController'
                });
    }
]);
