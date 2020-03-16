angular.module("vacunasApi",["environmentWebApi"]);
var appWebApi = angular.module("appWebApi",["ngResource","ngStorage","oc.lazyLoad","ui.router", "vacunasApi"]).run(function($ocLazyLoad, $rootScope, ENVIRONMENT_WEB_API){
  
  $rootScope.initAppWebApi = null;  
  var deps = [];

   angular.forEach(ENVIRONMENT_WEB_API.modulos, function( k, v){                    
        angular.forEach(k.providers, function( p){            
              try{           
      angular.module(p.service);
    }catch(Exception){         
        angular.forEach(p.dependencies, function(dep){
            deps.push(ENVIRONMENT_WEB_API.endpoint.url.concat(dep)); 
        });      
    } 
    });            
  });        

  $ocLazyLoad.load([{cache :false, files : deps}]).then(function(){    
         $rootScope.initAppWebApi = true;
      });
      if(!deps.length){
          $rootScope.initAppWebApi = true;
      }
});   

try{                       
    var app = angular.module(angular.modules[0]);
    app.config(function($stateProvider){
        app.stateProvider = $stateProvider;
    });
        app.requires.push("appWebApi");      
}
 catch(Exception){                 
       appWebApi.config(function($stateProvider){
       appWebApi.stateProvider = $stateProvider;
    });
}
 
 angular
        .element(document)
        .ready(function () {                
             if(!angular.element(document).scope()){                 
            angular.bootstrap(document, ["appWebApi"]);    
             }                                                    
        }); 