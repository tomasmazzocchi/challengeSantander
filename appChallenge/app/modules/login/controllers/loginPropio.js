'use strict';

angular.module('login')
        .controller('LoginPropioController', function (UserProfileService, $scope, $state, AuthenticatorResource, customData, ENV,$rootScope) {
            UserProfileService.destroy();            
            $rootScope.listaDominios = undefined;
            $scope.customData = customData;                      
            
            $scope.login = function () {
                $scope.form.oid = ENV.oid;
                var user = new AuthenticatorResource($scope.form);
                user.$login(function (data) {                    
                    if (data.dominios.length > 0) {
                       $rootScope.listaDominios = data.dominios;
                        var usrTmp = UserProfileService.get();
                        usrTmp.usuario.token = data.token;
                        //usrTmp.usuario.tokenMF = data.tokenMF;
                        usrTmp.usuario.idUsuario= data.idUsuario;
                        usrTmp.usuario.nombreUsuario = data.nombreUsuario;
                        usrTmp.usuario.debeCambiarClave = data.debeCambiarClave;
                        usrTmp.usuario.esMedico = data.esMedico;   
                        usrTmp.usuario.esReadOnly = data.esReadOnly;
                        UserProfileService.setDominio($scope.customData);
                        $state.go('app.loginPrincipal.selectDom');
                    }
                });
            };
            
        });
