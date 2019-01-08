(function() {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$auth', '$location'];

    function loginController($auth, $location) {
        var vm = this;
        this.login = function() {
            $auth.login({
                    user: vm.user,
                    password: vm.password
                })
                .then(function() {
                    // Si se ha logueado correctamente, lo tratamos aquí.
                    // Podemos también redirigirle a una ruta
                    $location.path("/private")
                })
                .catch(function(response) {
                    // Si ha habido errores llegamos a esta parte
                });
        }
    }
});