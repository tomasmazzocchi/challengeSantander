'use strict';

/**
 * @ngdoc object
 * @name core.config
 * @requires ng.$stateProvider
 * @requires ng.$urlRouterProvider
 * @description Defines the routes and other config within the core module
 */
angular.module('login')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise(function ($injector, $location) {
                return  $location.path("/login");
            });
            $stateProvider
                    .state('app.loginPrincipal', {
                        url: '',
                        templateUrl: 'modules/login/views/principalLogin.html',
                        abstract: true,
                        resolve: {
                            environmentDetails: function (ENV) {
                                return ENV;
                            }
                       }
                    })
                    .state('app.loginPrincipal.login', {
                        url: '/login',
                        views: {
                            "view-login": {
                                templateUrl: 'modules/login/views/login.html',
                                controller: 'LoginController'
                            }
                        }
                    })
                    .state('app.locked', {
                        url: '/locked',
                        templateUrl: 'modules/login/views/locked.html',
                        controller: 'LockedController'
                    })
                   ;
          
        });


