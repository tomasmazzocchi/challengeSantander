'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:tileControlToggle
 * @description
 * # tileControlToggle
 */
angular.module('app')
        .directive('pageLoader', 
    function ($http, $rootScope, $location) {
      return {
        restrict: 'AE',
        template: '<div class="dot1"></div><div class="dot2"></div>',
        link: function (scope, element) {         
           var $parent = element.parent();           
           var $content = element.parent();
           $rootScope.isRequesting = false;  
          element.addClass('hide');       
          scope.isLoading = function () {
             return $http.pendingRequests.length > 0 && $rootScope.isRequesting ;
          };
          scope.$on('$stateChangeStart', function() {              
            scope.setContent();
            scope.setPosition();
            $rootScope.isRequesting = true;           
            $content.addClass("opacityLoading");
            element.removeClass('hide').addClass("animate");   
        });
          scope.setContent = function(){
              var $cont = $parent.find("#content");
                        if($cont.length > 0){
                            $content = $cont;
                        }else{
                            $content = $parent;
                        }                
          };
          scope.setPosition = function(){
              var top =   $content.offset().top + ($content.outerHeight() /2) + "px";
              var left =  $content.offset().left  + ($content.outerWidth() / 2) + "px";
              element.css({top : top, left : left});
          };
                
                scope.$watch(scope.isLoading, function(v) {
                    if (v) {                                 
                        $rootScope.isRequesting = true;                        
                        scope.setContent();   
                        scope.setPosition();
                        $content.addClass("opacityLoading");
                        element.removeClass('hide').addClass("animate");                        
                    } else {                                                
                        $rootScope.isRequesting = false;
                        //$parent.removeClass("opacityLoading");
                        $parent.removeClass("opacityLoading");
                        $content.removeClass("opacityLoading");
                        element.removeClass('animate').addClass("hide");
                    }
                });
                
                scope.$on('$stateChangeSuccess', function (event) {
            event.targetScope.$watch('$viewContentLoaded', function () {                                   
                $rootScope.esResumen = $location.url() === '/mainPaciente/principal/resumen';
                if(scope.isLoading()){
                        $rootScope.isRequesting = true;
                        scope.setContent(); 
                        scope.setPosition();
                        $content.addClass("opacityLoading");
                        element.removeClass('hide').addClass("animate");   
               }else{                                      
                   $rootScope.isRequesting = false;
                   $parent.removeClass("opacityLoading");
                   $content.removeClass("opacityLoading");
                   element.removeClass('animate').addClass("hide");
               }
            });            
          });

        }
      };
    }
  );