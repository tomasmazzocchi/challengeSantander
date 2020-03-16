'use strict';

/**
 * @ngdoc service
 * @name core.Services.Requestinterceptor
 * @description Requestinterceptor Service
 */
angular
        .module('app')
        .factory('RequestInterceptor', 
            function (UserProfileService,  $rootScope, $injector) {   
           
                var requestInterceptor = {
                    request: function (config) { 
                        config.headers.Accept = 'application/json;charset=UTF-8';                        
                        return config;
                    },
                    response: function (response) {
             
                    $rootScope.options = {                    
                    type: null,
                    iconClass: null,
                    msg : null,                    
                    html: false                                    
                };
                var toastr = $injector.get('toastr');   
                var toastrConfig = $injector.get('toastrConfig'); 
                angular.extend(toastrConfig, { positionClass: "toast-top-right" });
                switch (response.status) {
                    case 201 :
                    $rootScope.options.msg = response.headers().msg;
                    $rootScope.options.iconClass = "success";
                    $rootScope.options.type = "success";
                    break;                                
                    case 204 :
                    $rootScope.options.msg = response.headers().msg;
                    $rootScope.options.iconClass = "blue";
                    $rootScope.options.type = "success";
                    break;                                
                }
                if($rootScope.options.msg !== null){
                toastr[$rootScope.options.type]($rootScope.options.msg, {
                    iconClass: 'toast-'+$rootScope.options.iconClass + ' ' + 'bg-'+$rootScope.options.iconClass
                  });
              }
                    
                      
                        
                   return response;                        
                    }
                };
                return requestInterceptor;
            }
        );
angular
        .module('app')
        .config(function ($httpProvider) {
                $httpProvider.interceptors.push('RequestInterceptor');
            });  
