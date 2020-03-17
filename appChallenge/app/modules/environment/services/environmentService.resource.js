'use strict';
angular.module('environment')
.factory('EnvironmentResource', function(ENV, $http) {

        function setEnv(data){          
                ENV.endpoint.url = data.endpoint.url;
                ENV.oid = data.oid;
                ENV.loginPath = data.loginPath;
                ENV.loginType = data.loginType;
                ENV.logoutPath = data.logoutPath;
        }

        function getEnv(){           
            return $http.get(ENV.endpoint.envContext).then(function(config){               
                        setEnv(config.data);
                        return config.data; 
                });
        }
        
        return {
            setEnv: setEnv,
            getEnv: getEnv
         };
    });

