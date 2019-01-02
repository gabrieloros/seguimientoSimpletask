(function() {
    'use strict';

    angular
        .module('app')
        .controller('claimsController', claimsController);

    claimsController.$inject = ['$rootScope', '$scope', '$http', '$filter', '$interval', 'statusService', '$state', '$window', 'CONSTANTS'];

    function claimsController($rootScope, $scope, $http, $filter, $interval, statusService, $state, $window, $CONSTANTS) {

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
            $scope.identikey = null;

            $scope.listUsers.forEach(user => {
                if (user.id == claimsCntrl.data.operario) {
                    $scope.identikey = user.identikey;
                }
            });


            var hs = new Date().getHours();
            var min = new Date().getMinutes();
            var seg = new Date().getSeconds();

            claimsCntrl.data.code = 'ST-M-' + hs + '-' + min + '-' + seg;
            $http({
                method: 'POST',
                url: $CONSTANTS.SERVER_URL + 'createclaimbyst',
                params: { identikey: $scope.identikey, data: claimsCntrl.data, positions: $scope.newClaims }
            }).then(function(response) {
                $window.sessionStorage.removeItem('listNewMarket');
                if (response.data.result == true) {
                    alert("Los reclamos fueron guardados correctamente");
                    $state.go('app');
                } else {
                    alert(response.data.data);
                }
            });
        }

    }

})();