(function() {
    'use strict';

    angular
        .module('app')
        .controller('claimsController', claimsController);

    claimsController.$inject = ['$rootScope', '$scope', '$http', '$filter', '$interval', 'statusService', '$window'];

    function claimsController($rootScope, $scope, $http, $filter, $interval, statusService, $window) {

        var claimsCntrl = this;

        claimsCntrl.form = newClaims;
        claimsCntrl.data = {};
        $scope.listCauses = [];
        $scope.listGroups = [];
        $scope.listUsers = [];

        statusService.getListTheInfoForm({}, function(response) {
            $scope.listCauses = response.data[0];
            $scope.listGroups = response.data[1];
            $scope.listUsers = response.data[2];
            $scope.listGroups.push({ id: 0, name: "Sin grupo" });
            //listCauses();
        }, function(error) {
            console.log(error);
        });




        function newClaims() {
            claimsCntrl.data;
            $scope.newClaims = $window.sessionStorage.getItem('listNewMarket');

            statusService.setNewClaims({ identikey: 'dsada', data: claimsCntrl.data, positions: $scope.newClaims }, function(response) {
                $scope.result = response;
            }, function(error) {
                console.log(error);
            });

        }

    }

})();