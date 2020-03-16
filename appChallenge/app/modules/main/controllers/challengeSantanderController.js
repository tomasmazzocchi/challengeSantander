'use strict';
angular.module('main')
  .controller('challengeSantander', function ($scope, $uibModal, ENV, $timeout, $state, $window) {
//            $scope.loginType = ENV.loginType;
//            $scope.usuario = datosUsr;
//            $scope.dominio = UserProfileService.getDominio();
//            $scope.ambito = UserProfileService.getAmbito();
//            
//            AuthenticatorResource.getTraerDatosUsuario(function(data){
//                 var up = UserProfileService.get();
//                 up.usuario.nombre = data.nombre;  
//                 $scope.usuario.nombre = data.nombre;                 
//                 up.usuario.apellido = data.apellido;
//                 $scope.usuario.apellido = data.apellido;
//                 up.usuario.image = data.image;
//                 $scope.usuario.image = data.image;
//                 UserProfileService.set(up);                                                  
//            });   
            
            $scope.logout = function(){                                
//                $timeout(function(){                    
//                    if(ENV.logoutPath !== ""){
//                        $window.location.href = ENV.logoutPath;
//                    }else{
                        $state.go("app.loginPrincipal.login");
//                    }
//                });
            };
            
            $scope.cambiarPassword = function(){
                   $uibModal.open({
                            templateUrl: 'modules/login/views/changePass.html',
                            controller: 'changePassController',
                            size: 'md',
                            windowClass: 'h-auto'
                        }).result.then(function (selectedItem) {                         
                        }, function () {                           
                        });
            };
  });
