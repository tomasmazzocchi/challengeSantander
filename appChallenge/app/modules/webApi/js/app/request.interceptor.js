'use strict';

angular
        .module('appWebApi')
        .factory('AppWebApiRequestInterceptor', 
            function (AppWebApiUserProfileService) {                 
                var requestInterceptor = {
                    request: function (config) { 
                     if(config.url.includes('api/webApi')){                       
                        var up = AppWebApiUserProfileService.get();                    
                       if (up) {                                                     
                               config.headers['x-auth-token'] = up.token;                                                              
                       }
                        config.headers.Accept = 'application/json;charset=UTF-8';                        
                    }
                        return config;
                    },
                    response: function (response) {                                                                                                                          
                        return response;                        
                    }
                };
                return requestInterceptor;
            });
angular
        .module('appWebApi')
        .config(function ($httpProvider) {
                $httpProvider.interceptors.push('AppWebApiRequestInterceptor');
            }); 


