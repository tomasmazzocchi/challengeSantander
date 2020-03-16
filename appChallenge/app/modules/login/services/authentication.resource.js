'use strict';
/**
 * @ngdoc service
 * @name core.Services.Loginresource
 * @description Loginresource Factory
 */
angular.module('login')
    .factory('AuthenticatorResource',function($resource, ENV){
        
       var urlGet = ENV.endpoint.url + '/auth';
       var urlGetDominio = ENV.endpoint.url + '/dominio';
       
       return $resource(urlGet,{},{
          login:{
              url: urlGet + '/login',
              method: 'POST'
          },
          loginOAuth2:{
              url: urlGet + '/login/oAuth2',
              method: 'POST'
          },
          getTraerDatosUsuario:{
              url: urlGet + '/traerDatosUsuario',
              method: 'GET'
          },
          cambiarToken:{
              url: urlGet + '/changeProfile',
              method: 'POST'
          },
          getCustomDomainData:{
              url: urlGetDominio + '/customDomainData?path=:path',
              method: 'GET'
          },
          getCustomDomainDataById:{
              url: urlGetDominio + '/customDomainData/:id',
              method: 'GET'
          },
          changePass:{
              url: urlGet + '/persona/:idUsuario/password',
              method: 'POST'
          }          
       });
    });


