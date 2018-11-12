/**
 * Created by Equipo 1 on 24/10/2017.
 */
angular.module('mapa', [])
    .config(function config($stateProvider) {

        $stateProvider
            .state('app.mapa', {
                url: '/mapa',
                views: {
                    'sideBar@': {
                        templateUrl: 'app/mapa/template/mapa.html',
                        controller: '',
                        controllerAs: ''
                    }
                }
            })


    });