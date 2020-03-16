'use strict'; 

angular
        .module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular
        .module(ApplicationConfiguration.applicationModuleName)
        .config(function ($locationProvider, $sceProvider) {
                $locationProvider.hashPrefix('!');
                $sceProvider.enabled(false);
            }
        );

//Then define the init function for starting up the application
angular
        .element(document)
        .ready(function () {
            if (window.location.hash === '#_=_') {
                window.location.hash = '#!';
            }
            angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
        });

angular
        .module(ApplicationConfiguration.applicationModuleName)
        .run(function ($rootScope, $location, $state, UserProfileService, $browser, $templateCache) {
            //  $state.go('app.loginPrincipal.login');

            $rootScope.$on('$stateChangeSuccess', function (event, toState) {

                event.targetScope.$watch('$viewContentLoaded', function () {

                    angular.element('html, body, #content').animate({scrollTop: 0}, 200);

                    setTimeout(function () {
                        angular.element('#wrap').css('visibility', 'visible');

                        if (!angular.element('.dropdown').hasClass('open')) {
                            angular.element('.dropdown').find('>ul').slideUp();
                        }
                    }, 200);
                });
                $rootScope.containerClass = toState.containerClass;
            });
            $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {                   
                if(toState.views) {                    
                    $templateCache.remove(toState.views[Object.keys(toState.views)[0]].templateUrl);                    
                }            
                $rootScope.loading = true;

                var isLogin = toState.name === "app.loginPrincipal.login";

                if (isLogin) {
                    return; // no need to redirect
                }

                // now, redirect only not authenticated

               // var authenticated = UserProfileService.get().nombre !== '';

                /*  if(authenticated === false) {
                 e.preventDefault(); // stop current execution
                 $state.go('app.login'); // go to login
                 }*/
            });

            $rootScope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParams) {
                $rootScope.loading = false;                                 
            });                                    
        });

angular
        .module(ApplicationConfiguration.applicationModuleName)
        .run(function () {
//            editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
//            amMoment.changeLocale('es');
        });

/*!
 * JavaScript - loadGoogleMaps( version, apiKey, language )
 *
 * - Load Google Maps API using jQuery Deferred.
 *   Useful if you want to only load the Google Maps API on-demand.
 * - Requires jQuery 1.5
 *
 * Copyright (c) 2011 Glenn Baker
 * Dual licensed under the MIT and GPL licenses.
 */
/*globals window, google, jQuery*/
var loadGoogleMaps = (function ($) {

    var now = $.now(),
            promise;

    return function (version, apiKey, language) {

        if (promise) {
            return promise;
        }

        //Create a Deferred Object
        var deferred = $.Deferred(),
                //Declare a resolve function, pass google.maps for the done functions
                resolve = function () {
                    deferred.resolve(window.google && google.maps ? google.maps : false);
                },
                //global callback name
                callbackName = "loadGoogleMaps_" + (now++),
                // Default Parameters
                params = $.extend({'sensor': false}, apiKey ? {"key": apiKey} : {} , language ? {"language": language} : {} );        

        //If google.maps exists, then Google Maps API was probably loaded with the <script> tag
        if (window.google && google.maps) {

            resolve();

            //If the google.load method exists, lets load the Google Maps API in Async.
        } else if (window.google && google.load) {

            google.load("maps", version || 3, {"other_params": $.param(params), "callback": resolve});

            //Last, try pure jQuery Ajax technique to load the Google Maps API in Async.
        } else {

            //Ajax URL params
            params = $.extend(params, {
                'v': version || 3,
                'callback': callbackName
            });

            //Declare the global callback
            window[callbackName] = function ( ) {

                resolve();

                //Delete callback
                setTimeout(function () {
                    try {
                        delete window[callbackName];
                    } catch (e) {
                    }
                }, 20);
            };

            //Can't use the jXHR promise because 'script' doesn't support 'callback=?'
            $.ajax({
                dataType: 'script',
                data: params,
                url: 'http://maps.google.com/maps/api/js'
            });

        }

        promise = deferred.promise();

        return promise;
    };

}(jQuery));
