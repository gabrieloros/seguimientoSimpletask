(function() {
    'use strict';

    angular.module('app', [
        'ui.router',
        'ngResource',
        'angular-loading-bar',
        'mapa',
        'claims'


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
            .state('app.claims', {
                url: '/claims',
                views: {

                    'content@': {
                        templateUrl: 'app/claims/template/menu-claims.html',
                        controller: 'claimsController as claimsCntrl'
                    }
                }
            })

    })

})();