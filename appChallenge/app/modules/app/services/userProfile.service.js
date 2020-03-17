'use strict';

angular.module('app')
        .factory('UserProfileService', function ($sessionStorage) {
            var service = {};

            service.reset = function () {
                this.resetUsuario();

                $sessionStorage.sesion.state = {
                    usuario: {
                        nombreCompleto: null,
                        nombreUsuario: null,
                        imagen: null,
                        id: null,
                    },
                    path: {
                        name: null,
                        params: null,
                        logining: false
                    }
                };

            };

            service.resetState = function () {
                delete $sessionStorage.sesion.state;
                $sessionStorage.sesion.state = {
                    usuario: {
                        nombreCompleto: null,
                        nombreUsuario: null,
                        imagen: null,
                        id: null
                    },
                    path: {
                        name: null,
                        params: null,
                        logining: false
                    }
                };
            };

            service.resetUsuario = function () {
                $sessionStorage.sesion.usuario.nombre = null;
                $sessionStorage.sesion.usuario.apellido = null;
                $sessionStorage.sesion.usuario.idUsuario = null;
                $sessionStorage.sesion.usuario.token = null;
                $sessionStorage.sesion.usuario.image = "images/default-avatar.png";

            };

            service.crear = function () {
                $sessionStorage.sesion = {
                    usuario: {
                        nombre: null,
                        apellido: null,
                        token: null,
                        idUsuario: null,
                        expiresIn: null,
                        nombreUsuario: null,
                        image: "images/default-avatar.png"
                    }, state: {
                        usuario: {
                            nombreCompleto: null,
                            nombreUsuario: null,
                            imagen: null,
                            id: null,
                        },
                        path: {
                            name: null,
                            params: null,
                            logining: false
                        }
                    }
                };
                $sessionStorage.dominio = {
                    id: null,
                    descripcion: null,
                    codDominio: null,
                    imgLogin: null,
                    imgHeader: null,
                    colorHeader: null,
                    positionLogin: null,
                    path: null,
                    fontColorHeader: null
                };
            };


            service.set = function (data) {
                $sessionStorage.sesion.usuario.nombre = data.usuario.nombre;
                $sessionStorage.sesion.usuario.apellido = data.usuario.apellido;
                $sessionStorage.sesion.usuario.idUsuario = data.usuario.idUsuario;
                $sessionStorage.sesion.usuario.token = data.usuario.token;
                $sessionStorage.sesion.usuario.nombreUsuario = data.usuario.nombreUsuario;
            };


            service.setState = function (data) {
                $sessionStorage.sesion.state.path.name = data.path.name;
                $sessionStorage.sesion.state.path.params = data.path.params;
                $sessionStorage.sesion.state.paciente.id = data.paciente.id;
                $sessionStorage.sesion.state.usuario.id = data.usuario.id;
                $sessionStorage.sesion.state.usuario.imagen = data.usuario.imagen;
                $sessionStorage.sesion.state.usuario.nombreUsuario = data.usuario.nombreUsuario;
                $sessionStorage.sesion.state.usuario.nombreCompleto = data.usuario.nombreCompleto;
            };

            service.getState = function () {
                return $sessionStorage.sesion.state;
            };

            service.get = function () {
                return $sessionStorage.sesion;
            };

            service.destroy = function () {
                delete $sessionStorage.sesion;
                this.crear();
            };

            return service;

        });
