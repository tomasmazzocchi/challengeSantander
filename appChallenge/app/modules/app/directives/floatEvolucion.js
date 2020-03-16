angular


        .module('app')

        .directive('floatWindow', ['$document', '$rootScope', function ($document, $rootScope) {

                'use strict';
                var HEADER_CLASS = 'headerFloat';
                var CORNER_CLASS = 'cornerFloat';
                var CERRAR_VENTANA = 'cerrarVentanaChat';
                var MINIMIZAR_VENTANA = 'minimizarVentanaChat';
                var botonMinimizar = '<button name="minRestoreVentana" class="minimizarVentanaChat pull-right text-white"><i class="glyphicon  glyphicon-minus"></i></button>';
                var botonCerrar = '<button name="cerrarVentana" class=" cerrarVentanaChat pull-right text-white"><i class="glyphicon  glyphicon-remove"></i></button></button>';
                return {
                    scope: {
                        'floatWindow': '='
                    },
                    compile: function (element, attr) {

                        appendExtraElements();

                        function cancelarFloatWindow() {
                            $rootScope.$broadcast("cancelarPantallaFlotante");
                        }

                        function cerrarFloatWindow() {
                            $rootScope.$broadcast("reiniciarPantallaEvoluciones");
                            $rootScope.$broadcast("cerrarPantallaFlotante");
                        }
                        function minimizarFloatWindow() {
                            $rootScope.$broadcast("minimizarPantallaFlotante");
                        }

                        function appendExtraElements() {
                            element.append('<div class="' + HEADER_CLASS + '">' + "<span class='pl-15 pt-5 inline-block text-white'>Nueva Evolución</span>" + botonCerrar + botonMinimizar + '</div>');
                            element.append('<div class="' + CORNER_CLASS + '"></span></div>');
                        }

                        return function (scope, element, attr) {
                            var header = angular.element(element[0].querySelector('.' + HEADER_CLASS));
                            var corner = angular.element(element[0].querySelector('.' + CORNER_CLASS));
                            var cerrarVentana = angular.element(element[0].querySelector('.' + CERRAR_VENTANA));
                            var minimizarVentana = angular.element(element[0].querySelector('.' + MINIMIZAR_VENTANA));

//                            applyStyles(options);

                            var rect = getOffsetRect(document.body, element[0]);
                            var startX = 0,
                                    startY = 0,
                                    x = rect.left,
                                    y = rect.top,
                                    startHeight = 0,
                                    startWidth = 0,
                                    height = element.prop('offsetHeight'),
                                    width = element.prop('offsetWidth');

                            header[0].addEventListener('mousedown', function (event) {
                                // Prevent default dragging of selected content
                                event.preventDefault();
                                startX = event.pageX - x;
                                startY = event.pageY - y;
                                $document.on('mousemove', pMousemove);
                                $document.on('mouseup', pMouseup);
                            });

                            corner[0].addEventListener('mousedown', function (event) {
                                // Prevent default dragging of selected content
                                event.preventDefault();
                                startWidth = event.pageX - x - width;
                                startHeight = event.pageY - y - height;
                                $document.on('mousemove', sMousemove);
                                $document.on('mouseup', sMouseup);
                            });
                            cerrarVentana[0].addEventListener('click', function (event) {
                                // Prevent default dragging of selected content
                                event.preventDefault();
                                if ($rootScope.problemas.length > 0) {
                                    cancelarFloatWindow();
                                } else {
                                    cerrarFloatWindow();
                                }
                                //angular.element(element[0].querySelector('.' + CORNER_CLASS)).attr("style", "visibility: block");
                            });


                            minimizarVentana[0].addEventListener('click', function (event) {
                                //boton minimizar el float de evolucion y quito el croner
                                event.preventDefault();
                                minimizarFloatWindow();
                                var btnMin = angular.element(element[0].querySelector('.' + CORNER_CLASS));
                                if ($rootScope.ocultoContenidoFlotante) {
                                    btnMin.attr("style", "visibility: hidden");
                                } else {
                                    btnMin.attr("style", "visibility: block");
                                }

                            });

                            function pMousemove(event) {
                                y = event.pageY - startY;
                                x = event.pageX - startX;

                                /*************CONSERVO EL DIV DENTRO DE LA PANTALLA****************/
                                if (y < 0) {
                                    y = 0;
                                }
                                if (x < 0) {
                                    x = 0;
                                }

                                var ancho = parseInt(element.css('width').substring(0, element.css('width').length - 2));
                                var alto = parseInt(element.css('height').substring(0, element.css('height').length - 2));

                                if ((x + ancho) > window.innerWidth) {
                                    x = window.innerWidth - ancho;
                                }
                                if ((y + alto) > window.innerHeight) {
                                    y = window.innerHeight - alto;
                                }
                                /**************CONSERVO EL DIV DENTRO DE LA PANTALLA**************/

                                element.css({
                                    top: y + 'px',
                                    left: x + 'px',
                                    right: 'initial',
                                    bottom: 'initial',
                                    margin: 0
                                });
                            }

                            function pMouseup() {
                                $document.off('mousemove', pMousemove);
                                $document.off('mouseup', pMouseup);
                            }

                            function sMousemove(event) {
                                var bottom = parseInt(element.css('bottom').substring(0, element.css('bottom').length - 2));
                                var right = parseInt(element.css('right').substring(0, element.css('right').length - 2));

                                height = event.pageY - y - startHeight;
                                width = event.pageX - x - startWidth;
//                                console.log(height);

                                if (bottom < 30) {
                                    height -= 50;
                                }
//                                console.log(bottom);
//                                console.log(bottom <6);
                                if (right < 3) {
                                    width -= 10;
                                }
                                element.css({
                                    height: height + 'px',
                                    width: width + 'px'
                                });
                            }

                            function sMouseup() {
                                $document.off('mousemove', sMousemove);
                                $document.off('mouseup', sMouseup);
                            }

                            function getOffsetRect(parent, child) {
                                var parentRect = parent.getBoundingClientRect();
                                var childRect = child.getBoundingClientRect();
                                var result = {};
                                for (var i in parentRect) {
                                    result[i] = childRect[i] - parentRect[i];
                                }
                                return result;
                            }
                        }
                        ;
                    }
                };
            }]);