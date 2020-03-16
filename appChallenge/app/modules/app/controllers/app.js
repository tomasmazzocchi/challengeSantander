'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ApplController
 * @description
 * # ApplController
 * Controller of the minovateApp
 */
angular.module('app')
        .controller('ApplController', function ($scope, toastr, $state, $rootScope) {
            $scope.$on('message', function (event, data) {
                switch (data.tipo) {
                    case 'success':
                        toastr.success(null, data.message);
                        break;
                    case 'error':
                        toastr.error(null, data.message);
                        break;
                }

            });
            /******** opcion para menu desplegable del nav.html del modulo main *******/
            $scope.status = {
                isFirstOpen: true
            };
            /********fin de opcion*******/

            $scope.capitalizeFirstLetter = function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            };
        });
