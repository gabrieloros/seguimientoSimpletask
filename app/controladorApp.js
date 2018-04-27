
(function() {
    'use strict';

    angular
        .module('app')
        .controller('controladorUsers', controladorUsers);

    controladorUsers.$inject = ['listUsers','$scope','$http'];

    function controladorUsers(listUsers,$scope,$http) {

        
        var contUsers = this;

        contUsers.get = listUsers.get(function (response) {

            $scope.datosResource = response.data;
        });

        //$scope.datosResource = listUsers.get();



    }




})();
