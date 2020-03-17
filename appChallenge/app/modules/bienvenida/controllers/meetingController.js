'use strict';

angular.module('bienvenida')
        .controller('meetingController', function (meetingServiceResource, $scope, DTColumnDefBuilder, $rootScope, $uibModal) {
            $scope.formatoTablaMeeting = angular.copy($rootScope.dtOptionsMeetings);
            $scope.formatoTablaMeeting
                    .withOption("hasBootstrap", !1)
                    .withOption('ordering', true)
                    .withOption("order", [1, "asc"]);
            $scope.dcType = [DTColumnDefBuilder.newColumnDef([2, 3, 4, 5]).notSortable()];

            $scope.obtenerMeetings = function () {
                meetingServiceResource.getMeetings({}, function (data) {
                    debugger;
                    $scope.listaMeetings = data;
                });
            };
            $scope.obtenerMeetings();

            $scope.verInvitados = function (meeting) {
                var lista = [];
                lista.push(meeting.admin);
                angular.forEach(meeting.usuarios, function(u){
                    lista.push(u);
                });
                $uibModal.open({
                    templateUrl: 'modules/bienvenida/views/invitados.html',
                    controller: 'invitadosController',
                    size: 'sm',
                    windowClass: 'papanata',
                    scope: $scope,
                    resolve: {
                        participantes: function() {
                            return lista;
                        }
                    }
                });
            };
        });
