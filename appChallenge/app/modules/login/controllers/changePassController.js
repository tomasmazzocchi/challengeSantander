'use strict';

angular.module('login')
        .controller('changePassController', function (UserProfileService, $scope, $state, AuthenticatorResource, $uibModalInstance, $location, ENV) {                      
            $scope.usr = UserProfileService.get().usuario;
            $scope.form = {nombre: $scope.usr.nombreUsuario,  claveActual : null, claveNueva : null};                                        

            $scope.cancel = function () {
                $uibModalInstance.dismiss("cancel");
            };
            
            $scope.cambioPass = function () {                          
                new AuthenticatorResource($scope.form).$changePass({
                            'idUsuario': $scope.usr.idUsuario
                        }, function (data) {                                                              
                                      $scope.cancel();
                                      $location.path(ENV.loginPath);                                  
                        });
                
            };
        });
