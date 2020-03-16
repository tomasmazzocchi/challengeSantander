'use strict';
angular
        .module('app')
        .directive("resizeFull", function ($window) {
            return {
                restrict: "A",
                link: function (scope, element) {
                    var w = angular.element($window);
                    var cabecera = angular.element("#cabecera");
                    var altoDisponible = w.height() - cabecera.height() - 10;
                    angular.element("#contenedor").css({height: altoDisponible + 'px'});
                }
            };
        });