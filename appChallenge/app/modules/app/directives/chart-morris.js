'use strict';
/**
 * @ngdoc directive
 * @name minovateApp.directive:chartMorris
 * @description
 * # chartMorris
 * https://github.com/jasonshark/ng-morris/blob/master/src/ngMorris.js
 */
angular.module('app')
        .directive('morrisLineChart', function ($rootScope, SERIE_PERCENTILO) {

            return {
                restrict: 'A',
                scope: {
                    lineData: '=',
                    lineXkey: '@',
                    lineYkeys: '@',
                    lineLabels: '@',
                    lineColors: '@',
                    lineSmooth: '@',
                    lineYmin: '@',
                    lineYmax: '@',
                    lineFormatTime: '@',
                    lineGoals: '=',
                    lineGoalStrokeWidth: '@',
                    lineGoalLineColors: '@',
                    lineParseTime: '@',
                    linePostUnits: '=',
                    linePreUnits: '@',
                    lineNumlines :"@",
                    lineWidth : "=",
                    lineDotsize : "@",
                    lineCustomLabels : "@",
                    edad : "@"
                },
                link: function (scope, elem, attrs) {                      
                    var colors,
                            morris;
                    if (scope.lineColors === void 0 || scope.lineColors === '') {
                        colors = null;
                    } else {
                        colors = JSON.parse(scope.lineColors);
                    } 
                    scope.$watch('lineData', function () {                                                  
                        if (scope.lineData) {
                            if (!morris) {                                                  
                                morris = new Morris.Line({
                                    element: elem,
                                    data: scope.lineData,
                                    xkey: scope.lineXkey,
                                    ykeys: JSON.parse(scope.lineYkeys),
                                    labels:JSON.parse(scope.lineLabels),
                                    xLabelFormat: function (x) {     
                                        var labelDate;
                                        if(JSON.parse(scope.lineFormatTime)){
                                            labelDate = new Date(x);
                                        }
                                        return JSON.parse(scope.lineFormatTime) ? labelDate.getHours() === 0 && labelDate.getMinutes() === 0 && labelDate.getSeconds() === 0 ? moment(labelDate).format("DD/MM/YYYY") : moment(labelDate).format("DD/MM/YYYY[\n]HH:mm") : x.x;                                                     
                                    },
                                    yLabelFormat: function(y){                                                                            
                                        return (parseFloat(y).toFixed(1) * 1 )+ " " +scope.linePostUnits;
                                    },
                                    ymin: scope.lineYmin,
                                    ymax: scope.lineYmax,
                                    numLines : scope.lineNumlines,
                                    goals: JSON.parse(scope.lineGoals),
                                    goalStrokeWidth: JSON.parse(scope.lineGoalStrokeWidth),
                                    goalLineColors: JSON.parse(scope.lineGoalLineColors),
                                    parseTime: JSON.parse(scope.lineFormatTime),
                                    freePosition : true,
                                    lineColors: colors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'],
                                    resize: true,
                                    postUnits: scope.linePostUnits,
                                    preUnits: scope.linePreUnits,                                    
                                    verticalGrid : true,    
                                    customLabels : JSON.parse(scope.lineCustomLabels || false) ? scope.edad > 6 ? SERIE_PERCENTILO.EJE_X_AÑO : SERIE_PERCENTILO.EJE_X_MES : undefined,
                                    smooth: scope.lineSmooth,
                                    lineWidth : scope.lineWidth,
                                    pointSize : JSON.parse(scope.lineDotsize),
                                    hideHover : true,                                        
                                    hoverCallback: function (index, options, content, row) {                                          
                                    return JSON.parse(scope.lineFormatTime) ? ("Fecha: " + moment(new Date(row.x)).format("DD/MM/YYYY") + "<br/>"+"Valor: " +row.y) : ((scope.edad > 6 ? 'Años: ' : 'Meses: ')+ (row.X).toFixed(1) + "<br/>"+"Valor: " +row.H);
                                    },                                    
                                    drawCallback: function () {                                           
                                    $rootScope.isRequestingWithoutRequest = false;                                    
                                    }                                    
                                });                                
                            } else {
                                morris.setData(scope.lineData);
                            }
                        }
                    });
                }
            };
        })

        .directive('morrisAreaChart', function () {

            return {
                restrict: 'A',
                scope: {
                    lineData: '=',
                    lineXkey: '@',
                    lineYkeys: '@',
                    lineLabels: '@',
                    lineColors: '@',
                    lineWidth: '@',
                    fillOpacity: '@',
                    showGrid: '@',
                    lineParseTime: '@',
                    linepostUnits: '@',
                    linepreUnits: '@'
                },
                link: function (scope, elem, attrs) {
                    var colors,
                            morris;
                    if (scope.lineColors === void 0 || scope.lineColors === '') {
                        colors = null;
                    } else {
                        colors = JSON.parse(scope.lineColors);
                    }
                    scope.$watch('lineData', function () {
                        if (scope.lineData) {
                            if (!morris) {
                                morris = new Morris.Area({
                                    element: elem,
                                    data: scope.lineData,
                                    xkey: scope.lineXkey,
                                    ykeys: JSON.parse(scope.lineYkeys),
                                    labels: JSON.parse(scope.lineLabels),
                                    lineColors: colors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'],
                                    lineWidth: scope.lineWidth || '0',
                                    fillOpacity: scope.fillOpacity || '1',
                                    parseTime: scope.lineParseTime,
                                    grid: scope.showGrid || false,
                                    resize: true,
                                    postUnits: scope.linepostUnits,
                                    preUnits: scope.linepreUnits,
                                    dateFormat: function (x) {
                                        var d = new Date(x);
                                        return d.getDate() + '//' + (d.getMonth() + 1) + '-' + d.getFullYear();
                                    }
                                });
                            } else {
                                morris.setData(scope.lineData);
                            }
                        }
                    });
                }
            };
        })

        .directive('morrisBarChart', function () {
            return {
                restrict: 'A',
                scope: {
                    barData: '=',
                    barXkey: '@',
                    barYkeys: '@',
                    barLabels: '@',
                    barColors: '@'
                },
                link: function (scope, elem, attrs) {

                    var colors,
                            morris;
                    if (scope.barColors === void 0 || scope.barColors === '') {
                        colors = null;
                    } else {
                        colors = JSON.parse(scope.barColors);
                    }

                    scope.$watch('barData', function () {
                        if (scope.barData) {
                            if (!morris) {
                                morris = new Morris.Bar({
                                    element: elem,
                                    data: scope.barData,
                                    xkey: scope.barXkey,
                                    ykeys: JSON.parse(scope.barYkeys),
                                    labels: JSON.parse(scope.barLabels),
                                    behaveLikeLine: true,
                                    barColors: colors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'],
                                    xLabelMargin: 2,
                                    resize: true
                                });
                            } else {
                                morris.setData(scope.barData);
                            }
                        }
                    });
                }
            };
        })

        .directive('morrisDonutChart', function () {
            return {
                restrict: 'A',
                scope: {
                    donutData: '=',
                    donutColors: '@'
                },
                link: function (scope, elem, attrs) {
                    var colors,
                            morris;
                    if (scope.donutColors === void 0 || scope.donutColors === '') {
                        colors = null;
                    } else {
                        colors = JSON.parse(scope.donutColors);
                    }

                    scope.$watch('donutData', function () {
                        if (scope.donutData) {
                            if (!morris) {
                                morris = new Morris.Donut({
                                    element: elem,
                                    data: scope.donutData,
                                    colors: colors || ['#0B62A4', '#3980B5', '#679DC6', '#95BBD7', '#B0CCE1', '#095791', '#095085', '#083E67', '#052C48', '#042135'],
                                    resize: true
                                });
                            } else {
                                morris.setData(scope.donutData);
                            }
                        }
                    });
                }
            };
        });
