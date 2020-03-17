'use strict';

/**
 * @ngdoc service
 * @name core.Services.HttpErrorInterceptor
 * @description HttpErrorInterceptor Factory
 */
angular.module('app').factory('HttpErrorInterceptor', function ($q, $rootScope, $injector, UserProfileService, $window) {
    return {
        responseError: function (response) {
            $rootScope.options = {                    
                    type: null,
                    iconClass: null,
                    msg : null,                    
                    html: false,                        
                    timeOut : 5000
                };
                var toastr = $injector.get('toastr');                                           
                var toastrConfig = $injector.get('toastrConfig');                                           
                angular.extend(toastrConfig, { positionClass: "toast-top-right" });
                    debugger;
                switch (response.status) {
                    case -1 : 
                    angular.extend(toastrConfig, {  positionClass: "toast-top-full-width" });
                    $rootScope.options.msg = "ChallengeSantander operativa se encuentra temporalmente fuera de servicio.";
                    $rootScope.options.iconClass = "error";
                    $rootScope.options.type = "error";
                    $rootScope.options.timeOut = 0;
                    break;
                    case 500 :
                    $rootScope.options.msg = response.statusText;
                    $rootScope.options.iconClass = "error";
                    $rootScope.options.type = "error";
                    break; 
                    case 498 :
                    $rootScope.options.msg = null;
                    $rootScope.options.iconClass = "error";
                    $rootScope.options.type = "error";                                                              
                    var $state = $injector.get("$state");                                                                                  
                    $state.go("app.locked");
                    break; 
                    case 401 :
                    angular.extend(toastrConfig, {  positionClass: "toast-top-full-width" });
                    $rootScope.options.msg = response.data.message;                                        
                    $rootScope.options.iconClass = "warning";
                    $rootScope.options.type = "warning";                    
                    break;                                
                    case 409 :                    
                    $rootScope.options.msg = response.data.message;                                        
                    $rootScope.options.iconClass = "warning";
                    $rootScope.options.type = "warning";                    
                    $rootScope.options.timeOut = 10000;
                    break;                                
                    case 404 :
                    $rootScope.options.msg = response.statusText;
                    $rootScope.options.iconClass = "error";
                    $rootScope.options.type = "error";
                    break;   
                    case 302:
                       $window.location.href= response.data.message;                     
                    break;
                    case 503 :                    
                    var $http = $injector.get('$http');
                    var up = UserProfileService.get();
                    up.usuario.tokenMF = response.headers().tokenmf;                  
                    up.usuario.tokenTerm = response.headers().tokenterm;                  
                    UserProfileService.set(up);
                    return $http(response.config);                    
                    case 400 :             
                    if(response.headers().tokenmf !== undefined){
                    var $https = $injector.get('$http');                    
                    var upac = UserProfileService.get();
                    upac.usuario.tokenMF = response.headers().tokenmf;                  
                    UserProfileService.set(upac);
                    return $https(response.config);
                    }else{                    
                    $rootScope.options.msg = "Se ha producido un error en la solicitud";
                    $rootScope.options.iconClass = "error";
                    $rootScope.options.type = "error";
                    }
                }
                if($rootScope.options.msg !== null){
                toastr[$rootScope.options.type]($rootScope.options.msg, {
                    iconClass: 'toast-'+$rootScope.options.iconClass + ' ' + 'bg-'+$rootScope.options.iconClass, timeOut: $rootScope.options.timeOut
                  });
              }
              
            return $q.reject(response);

        }
    };
});

angular.module('app').config(function ($httpProvider) {
    $httpProvider.interceptors.push('HttpErrorInterceptor');
});
