(function() {
    'use strict';

    angular
        .module('app')
        .factory('serviceMenu', serviceMenu);

    serviceMenu.$inject = ['$http', '$q', '$state', '$sessionStorage'];


    function serviceMenu($http, $q, $state, $sessionStorage) {

        var service = {
            usuario: {},
            login: login,
            logout: logout,
            getUsuario: getUsuario
        };

        // logout : cierro la sesion y re-dirijo al login
        function logout() {
            if ($sessionStorage.user) {
                delete $sessionStorage.user;
                $state.go('app');
            }
        }

        // login
        function login(credentials) {

            var usuario = credentials.usuario;
            var pass = credentials.pass;

            var config = {
                method: 'GET',
                url: 'http://localhost:8180/Multas_Rest/rest/login/validateLogin/' + usuario + '/' + pass
            };


            $http(config).then(function(result) {
                service.usuario = result.data.data;
                $sessionStorage.user = result.data.data;
                if (getUsuario()) {
                    $state.go('app.listado');

                } else {
                    $state.go('app');
                }
            })

        }

        return service;
    }
})();