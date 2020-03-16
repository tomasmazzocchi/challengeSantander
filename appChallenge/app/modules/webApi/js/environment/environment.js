angular.module('environmentWebApi', [])

.constant('ENVIRONMENT_WEB_API', {callback:{url:null},endpoint:{url:'http://localhost:8080/wssZEP',templatePath:'http://localhost:9000/modules/vacunas/api/views'},modulos:[{name:'vacunas',providers:[{service:'ui.bootstrap',dependencies:['/resources/js/ui-bootstrap-tpls.js','/resources/css/bootstrap.css']}]}]})

;