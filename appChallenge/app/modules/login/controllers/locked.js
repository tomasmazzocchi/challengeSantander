'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular.module('login')
        .controller('LockedController', function (UserProfileService, $scope, $state, AuthenticatorResource, busquedaPacienteResource, state, ENV, $window, $timeout) {                      
            $scope.form = {usuario: null, password : null, oid: ENV.oid};     
            $scope.nombreCompleto = state.usuario.nombreCompleto ;            
            $scope.imagen = state.usuario.imagen;                                   
            $scope.form.usuario = state.usuario.nombreUsuario ;                                                               
            UserProfileService.resetPaciente();
            UserProfileService.resetUsuario();
            
            
            $scope.reLogin = function () {
                $state.go('app.main.zepMain.bienvenida');
//                var path;
//                var params;
//                var idPaciente;
//                var evolucion;
//                var state = UserProfileService.getState();
//                state.path.logining = true;
//                UserProfileService.setState(state);                
//                var authRec = new AuthenticatorResource($scope.form);                     
//                authRec["$login"+ENV.loginType](function (data) { 
//                    var esMedico = data.esMedico;
//                    var esReadOnly = data.esReadOnly;
//                    if (data.dominios.length > 0) {                                  
//                        var ses = UserProfileService.get();                       
//                        ses.usuario.token = data.token;                             
//                        ses.usuario.idEfector = data.idEfector;                       
//                        ses.usuario.idUsuario= data.idUsuario;   
//                        ses.usuario.nombreUsuario = data.nombreUsuario;                        
//                        ses.usuario.idDominio = ses.state.usuario.idDominio;
//                        ses.usuario.idDominioMF = ses.state.usuario.idDominioMF;
//                        ses.usuario.idSesion = ses.state.usuario.idSesion;                        
//                        UserProfileService.set(ses);
//                        path = UserProfileService.getState().path.name;
//                        params = UserProfileService.getState().path.params;
//                        idPaciente = UserProfileService.getState().paciente.id;                         
//                        evolucion = UserProfileService.getState().evolucion;
//                        UserProfileService.resetState();                        
//                        AuthenticatorResource.getTraerDatosUsuario(function(data){
//                 var up = UserProfileService.get();
//                 up.usuario.nombre = data.nombre;                   
//                 up.usuario.apellido = data.apellido;                 
//                 up.usuario.image = data.image;      
//                 up.usuario.tokenMF = data.tokenMF;  
//                 up.usuario.esMedico = esMedico;   
//                 up.usuario.esReadOnly = esReadOnly;
//                 UserProfileService.set(up);
//                 if(idPaciente !== null) {
//                     busquedaPacienteResource.getPersona({
//                            'idUsuario': idPaciente
//                        }, function (data) {
//                            var usrProf = UserProfileService.get();
//                            usrProf.paciente.pacienteId = idPaciente;
//                            usrProf.paciente.nombre = data.nombreCompleto;
//                            usrProf.paciente.apellido = data.apellidoCompleto;
//                            usrProf.paciente.edad = data.edad;
//                            usrProf.paciente.edadEnAños = data.edadEnAños;
//                            usrProf.paciente.fechaNacimiento = data.fechaNacimiento;
//                            usrProf.paciente.telefono = data.telefonoPreferido;
//                            usrProf.paciente.documento = data.personaDocumentos;
//                            usrProf.paciente.cobertura = data.coberturaActiva;
//                            usrProf.paciente.image = data.foto;
//                            usrProf.paciente.sexo = data.personaSexo;
//                            usrProf.paciente.apellidoMaterno = data.apellidoMaterno;
//                            usrProf.paciente.domicilio = data.direccionPreferida;
//                            usrProf.paciente.religion =  data.personaReligion !== null ? data.personaReligion.descripcion : null;
//                            usrProf.paciente.telefono = data.telefonoPreferido;
//                            usrProf.paciente.mail = data.mailPreferido;
//                            usrProf.paciente.genero = data.personaGenero;
//                            usrProf.paciente.alias = data.alias;
//                            UserProfileService.set(usrProf);
//                            UserProfileService.getState().evolucion = evolucion;
//                             $state.go(path, params);
//                        });                
//                    }else {
//                         $state.go(path, params);
//                    }
//                 });                                  
//                    }
//                });            
            };
            
            $scope.logout = function(){               
                $timeout(function(){                    
                    if(ENV.logoutPath !== ""){
                        $window.location.href = ENV.logoutPath;
                    }else{
                        $state.go("app.loginPrincipal.login");
                    }
                });
            };
            
        });
