'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular.module('login')
        .controller('LoginController', function (UserProfileService, $scope, $state, AuthenticatorResource, ENV, $rootScope) {

//            $scope.login = function () {
//                $scope.form.oid = ENV.oid;
//                var user = new AuthenticatorResource($scope.form);
//                user.$login(function (data) {                    
////                        var usrTmp = UserProfileService.get();
////                        usrTmp.usuario.token = data.token;
////                        usrTmp.usuario.idUsuario= data.idUsuario;
////                        usrTmp.usuario.nombreUsuario = data.nombreUsuario;
////                        usrTmp.usuario.debeCambiarClave = data.debeCambiarClave;                        
////                        UserProfileService.set(usrTmp);
//                        $state.go('app.main.zepMain.bienvenida');
//                });
//            };
                        $state.go('app.main.challengeSantander.bienvenida');

        });
