'use strict';

angular.module('bienvenida')
        .controller('meetingController', function (meetingServiceResource, $scope, DTColumnDefBuilder, $rootScope) {
            $scope.formatoTablaMeeting = angular.copy($rootScope.dtOptionsMeetings);
            $scope.formatoTablaMeeting
                    .withOption("hasBootstrap", !1)
                    .withOption('ordering', true)
                    .withOption("order", [1, "asc"]);
            $scope.dcType = [DTColumnDefBuilder.newColumnDef([2, 3, 4, 5]).notSortable()];

            $scope.obtenerMeetings = function () {
                meetingServiceResource.getMeetings({}, function (data) {
                    
                });
            };
            $scope.obtenerMeetings();
        });
