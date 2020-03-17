'use strict';
/**
 * @ngdoc service
 * @name problemaService.Resource
 * @description problemaServiceResource Factory
 */
angular.module('bienvenida')
        .factory('meetingServiceResource', function ($resource, ENV) {
debugger;
            var urlGet = ENV.endpoint.url + '/meeting';

            return $resource(urlGet, {}, {

                getMeetings: {
                    url: urlGet + '',
                    method: 'GET',
                    isArray: true
                }

            });
        });


