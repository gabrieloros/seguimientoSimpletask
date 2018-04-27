/**
 * Created by Equipo 1 on 24/10/2017.
 */
angular
    .module('mapa',
        [
           
        ]
    )
    .config(function config($stateProvider){

        $stateProvider
            .state('mapa',{
                url:'/mapa',
                views: {
                    'content@':{
                        templateUrl:'app/mapa/template/home.html',
                        controller: 'controladorMapa ',
                        controllerAs: 'contMap'
                    }
                }
            })


    });