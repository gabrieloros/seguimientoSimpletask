(function() {
    'use strict';

    angular
        .module('app')
        .controller('claimsListController', claimsListController);

    claimsListController.$inject = ['$rootScope', '$scope', '$http', '$filter', '$interval', 'statusService', '$state', '$window', 'CONSTANTS'];

    function claimsListController($rootScope, $scope, $http, $filter, $interval, statusService, $state, $window, $CONSTANTS) {

        var claimsListCntrl = this;

        claimsListCntrl.form = newClaims;
        claimsListCntrl.data = {};
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


        if ('identikeyST23581321' in sessionStorage) {
            $scope.viewMenu = true;
        } else {
            $scope.viewMenu = false;
        }
        var mapOptions = {
            zoom: 13,
            center: new google.maps.LatLng(-32.885, -68.8422),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        $rootScope.mapAssignment = new google.maps.Map(document.getElementById('mapClaimList'), mapOptions);


        function newClaims() {
            claimsListCntrl.data;
            $scope.newClaims = $window.sessionStorage.getItem('listNewMarket');
            $scope.identikey = null;

            $scope.listUsers.forEach(user => {
                if (user.id == claimsListCntrl.data.operario) {
                    $scope.identikey = user.identikey;
                }
            });


            var hs = new Date().getHours();
            var min = new Date().getMinutes();
            var seg = new Date().getSeconds();

            claimsListCntrl.data.code = 'ST-M-' + hs + '-' + min + '-' + seg;
            $http({
                method: 'POST',
                url: $CONSTANTS.SERVER_URL + 'createclaimbyst',
                params: { identikey: $scope.identikey, data: claimsListCntrl.data, positions: $scope.newClaims }
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