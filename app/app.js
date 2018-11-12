(function() {
    'use strict';

    angular.module('app', [
        'ui.router',
        'ngResource',
        'angular-loading-bar',
        'mapa'


    ])

    //.constant('SERVER_URL','http://localhost:8080/adr/service/')
    .config(function config($stateProvider) {

        $stateProvider
            .state('app', {
                url: '',
                views: {

                    'content': {
                        templateUrl: 'app/template/menu.html',
                        controller: 'appController as appCntrl'
                    },

                    'sideBar': {
                        templateUrl: 'app/template/home.html',
                        controller: 'appController as appCntrl'

                    }
                }

            })


    })

})();