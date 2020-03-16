'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular.module('login')
        .controller('selectDomController', function ($scope, UserProfileService,$state, AuthenticatorResource, $uibModal, $location, ENV,$rootScope) {            
            if($rootScope.listaDominios === undefined) {
                $location.path(ENV.loginPath);                                  
            }else{                                   
                $scope.dominios = $rootScope.listaDominios;
            
                $scope.seleccionarDominio = function (idDominio, idDominioMF) {
                    $scope.usrprf = UserProfileService.get();
                    $scope.usrprf.usuario.idDominio = idDominio;
                    $scope.usrprf.usuario.idDominioMF = idDominioMF;
                    $scope.dominioprf = UserProfileService.getDominio();
                    
                    //$scope.dominioprf.efectorReferencia = $scope.dominios[0].centrosAtencion[0].efectorReferencia;

                    UserProfileService.set($scope.usrprf);
                    UserProfileService.setDominio($scope.dominioprf);
                    if (UserProfileService.getDominio().id === null) {
                        AuthenticatorResource.getCustomDomainDataById({id: idDominio}, function (data) {
                            if (data.id !== undefined) {
                                //data.efectorReferencia = $scope.dominios[0].centrosAtencion[0].efectorReferencia;
                                UserProfileService.setDominio(data);
                            }
                            $scope.debeCambiarClave();
                        });               
                }else{                                                
                    $scope.debeCambiarClave();
                }                                
            };
            
            $scope.abrirCambioClave = function () {
                        $uibModal.open({
                            templateUrl: 'modules/login/views/changePass.html',
                            controller: 'changePassController',
                            size: 'md',
                            windowClass: 'h-auto',
                            backdrop : 'static'
                        }).result.then(function (selectedItem) {                         
                        }, function () {                           
                        });
            };
            
            $scope.debeCambiarClave = function(){
                if($scope.usrprf.usuario.debeCambiarClave){
                      $scope.abrirCambioClave();
                     }else{
                     $state.go('app.main.zepMain.busqueda.busquedaPaciente');
                    }
            };            
            
            if($rootScope.listaDominios.length === 1){               
                $scope.seleccionarDominio($rootScope.listaDominios[0].id, $rootScope.listaDominios[0].codDominio);
            }else if(UserProfileService.getDominio().id !== null){                
                $scope.seleccionarDominio(UserProfileService.getDominio().id, UserProfileService.getDominio().codDominio);                
            }            
        }
        });