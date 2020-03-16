'use strict';

/**
 * @ngdoc object
 * @name core.config
 * @requires ng.$stateProvider
 * @requires ng.$urlRouterProvider
 * @description Defines the routes and other config within the core module
 */
angular.module('main')
        .config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider) {
                $stateProvider
                        .state('app.main', {
                            url: '/main',
                            templateUrl: 'modules/main/views/main.html',
                            abstract : true
                        })
                        .state('app.main.challengeSantander', {
                            url: '/challengeSantander',
                            abstract : true,
                            views: {
                                "content-header": {
                                    templateUrl: 'modules/main/views/header.html',
                                    controller: 'challengeSantanderController'
                                },
                                "content-nav": {
                                    templateUrl: 'modules/main/views/nav.html',
                                    controller:'NavCtrl'
                                }
                            }                    
                        });
            }
        ]);


