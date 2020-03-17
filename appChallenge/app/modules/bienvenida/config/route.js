'use strict';

/**
 * @ngdoc object
 * @name core.config
 * @requires ng.$stateProvider
 * @requires ng.$urlRouterProvider
 * @description Defines the routes and other config within the core module
 */
angular.module('bienvenida')
        .config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider) {
                $stateProvider
                        .state('app.main.challengeSantander.bienvenida', {
                            url: '/principal',
                            views: {
                                "content-main": {
                                    templateUrl: 'modules/bienvenida/views/meeting.html',
                                    controller: 'meetingController'
                                }
                            }
                        });
            }
        ]);


