'use strict';

angular.module('bienvenida')
        .controller('invitadosController', function ($scope, $uibModal, $uibModalInstance, participantes) {
            $scope.listaParticipantes = participantes;
            
            $scope.cerrarModal = function () {
                $uibModalInstance.dismiss();
            };
        });