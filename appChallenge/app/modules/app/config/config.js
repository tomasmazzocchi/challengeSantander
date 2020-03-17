'use strict';

angular.module('app')
        .run(function ($rootScope, DTDefaultOptions, DTOptionsBuilder, toastrConfig, amMoment) { 
                amMoment.changeLocale('es');

                angular.extend(toastrConfig, {
                    allowHtml: true,
                    closeButton: true,
                    closeHtml: '<i class="fa fa-times"></i>',
                    extendedTimeOut: 0,
                    tapToDismiss: true,
                    preventOpenDuplicates: true,
                    timeOut: 3000,
                    autoDismiss: true,
                    newestOnTop: true,
                    maxOpened: 1
                });

                DTDefaultOptions.setLanguage({
                    "sEmptyTable": "La búsqueda no produjo resultados",
                    "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                    "sInfoEmpty": "Mostrando 0 a 0 de 0 registros",
                    "sInfoFiltered": "(filtrado de _MAX_ registros totales)",
                    "sInfoPostFix": "",
                    "sInfoThousands": ".",
                    "sLengthMenu": "Mostrar máximo _MENU_ registros",
                    "sLoadingRecords": "Cargando...",
                    "sProcessing": "Procesando...",
                    "sSearch": "Buscar:",
                    "sZeroRecords": "No se encontraron registros",
                    "sPagingType": "numbers",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast": "Último",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "oAria": {
                        "sSortAscending": ": click para ordenar ascendentemente",
                        "sSortDescending": ": click para ordenar descendentemente"
                    }
                }).setOption('hasBootstrap', true);
                $rootScope.$on('$stateChangeStart', function (e, to) {
                    if (angular.isUndefined(to.data)) {
                        return;
                    }
                });
                var opcionesTabla = DTOptionsBuilder
                        .newOptions()
                        .withOption('hasBootstrap', true)
                        .withOption('lengthMenu', [10, 50, 100, 150, 200])
                        .withPaginationType('simple_numbers');

                var opcionesTablaReducida = DTOptionsBuilder
                        .newOptions()
                        .withOption('hasBootstrap', true)                        
                        .withOption('lengthMenu', [10, 50, 100, 150, 200])
                        .withPaginationType('numbers');
                
                var opcionesTablaResumen = DTOptionsBuilder
                        .newOptions()
                        .withOption('hasBootstrap', true)  
                        .withOption('bLengthChange',false)
                        .withOption('bFilter', false)
                        .withDisplayLength(5)
                        .withPaginationType('numbers');
                var opcionesTablaMeetings = DTOptionsBuilder
                        .newOptions()
                        .withOption('hasBootstrap', true)  
                        .withOption('bLengthChange',false)
                        .withOption('paging',false)
                        .withOption('ordering',false)
                        .withOption('info',false)
                        .withOption('bFilter', false)
                        .withDisplayLength(20);

                $rootScope.dtOptionsReduced = opcionesTablaReducida;
                $rootScope.dtOptions = opcionesTabla;
                $rootScope.dtOptionsResumen = opcionesTablaResumen;
                window.$.fn.dataTable.moment( 'DD MMM YYYY' );
                
            })
        .constant('SYSTEM_CONSTANTS', {
            valorInicio: 0,
            resultados: {limit: 9999999}
        }).constant('angularMomentConfig', {timezone: 'America/Argentina/Buenos_Aires'})
        .config(function (uibDatepickerConfig, uibDatepickerPopupConfig) {
            uibDatepickerConfig.startingDay = 1;
            uibDatepickerConfig.maxDate = new Date();
            uibDatepickerConfig.showWeeks = false;
            uibDatepickerPopupConfig.datepickerPopup = 'dd/MM/yyyy';
            uibDatepickerPopupConfig.placement = "right-top";
            uibDatepickerPopupConfig.clearText = "Borrar";
            uibDatepickerPopupConfig.closeText = "Cerrar";
            uibDatepickerPopupConfig.currentText = "Hoy";
        }).config(function($provide){
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions){

        taRegisterTool('fontSize', {
            display: "<ul class='nav-right list-inline pr-0 pl-0'><li class='dropdown' uib-dropdown><a href class='dropdown-toggle' uib-dropdown-toggle><i class='fa fa-text-height'></i>\n\
            <i class='fa fa-caret-down'></i></a><ul class='dropdown-menu min-110' role='menu' ng-disabled='showHtml()'>"+
                    "<li ng-repeat='o in options' class='w-100'><button class='btn bg-white w-100 {{o.css}}' type='button' ng-click='action($event, o.value)'><i ng-if='o.active' class='fa fa-check'></i> {{o.name}}</button></li>"+                        
                "</ul></ul>",
            action: function (event, size) {
                if(angular.isNumber(size)){                                        
                event.stopPropagation();
                angular.element("#minovate").trigger("click");
                return this.$editor().wrapSelection('fontSize', parseInt(size));            
            }else {
                return this.$editor();
            }
            },
            options: [
                { name: '8px', css: 'text-xs', value: 1 },                
                { name: '10px', css: 'text-sm', value: 2 },
                { name: '12px', css: 'text-md', value: 3 },
                { name: '14px', css: 'text-mdg', value: 4 },
                { name: '16px', css: 'text-lg', value: 5 },
                { name: '18px', css: 'text-elg', value: 6 }

            ]
        });
        return taOptions;
    }]);
    var bootBoxOptions = {buttons: {
                    confirm: {
                        label: 'Sí',
                        className: 'btn-primary'
                    },
                    cancel: {
                        label: 'Cancelar',
                        className: 'btn-default'
                    }
                       },
                   message : "<div class='h4 alert alert-warning alert-dismissable custom-font text-bold'>:msg</div>"
               };
    bootbox.setDefaults(bootBoxOptions);               
    bootbox.options = bootBoxOptions;
    bootbox.options.msg = function(msg){
        return bootbox.options.message.replace(":msg",msg);
    };

        });