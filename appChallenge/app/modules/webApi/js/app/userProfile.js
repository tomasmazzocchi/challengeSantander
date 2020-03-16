'use strict';

angular.module('appWebApi')
        .factory('AppWebApiUserProfileService', function ($sessionStorage) {
            var service = {};            
            
            service.reset = function () {
                $sessionStorage.webapi = null;                
            };                                                

            service.set = function (data) {                
                $sessionStorage.webapi = data;
            };

            service.get = function () {
                return $sessionStorage.webapi;
            };

            service.destroy = function () {
                delete $sessionStorage.webapi;
                this.reset();
            };                        

            return service;

        });


