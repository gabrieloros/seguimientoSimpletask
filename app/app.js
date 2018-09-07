

(function() {
    'use strict';
    
    angular.module('app',
    [
        'ui.router',
        'ngResource',
        'mapa',
        'angular-loading-bar'

    ]
)

//.constant('SERVER_URL','http://localhost:8080/adr/service/')
.config(function config($stateProvider){

$stateProvider
.state('app',{
    url:'',
    views: {

        'content':{

        },

      'sideBar':{
        templateUrl:'app/template/home.html',
        controller:'appController as appCntrl'

      }
    }

  })


})

})();