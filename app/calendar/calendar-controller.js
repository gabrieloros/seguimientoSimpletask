(function() {
    'use strict';

    angular
        .module('app')
        .controller('calendarController', calendarController);

    calendarController.$inject = ['$rootScope', '$scope', '$http', '$filter', '$interval', 'statusService', '$state', '$window', 'CONSTANTS'];

    function calendarController($rootScope, $scope, $http, $filter, $interval, statusService, $state, $window, $CONSTANTS) {

        var calendarCntrl = this;

        calendarCntrl.form = newBlockedDate;
        calendarCntrl.delete = deleteBlokedDate;
        calendarCntrl.data = {};
        $scope.listBlockedDate = [];

        // $scope.listGroups = [];
        // $scope.listUsers = [];

        $scope.dateBlocked = function() {

            statusService.getListBlockedDate({}, function(response) {
                $scope.listBlockedDate = response.data;
            }, function(error) {
                console.log(error);
            });

        }

        $scope.dateBlocked();

        function newBlockedDate() {
            let fecha = calendarCntrl.data.date;

            $http({
                method: 'POST',
                url: $CONSTANTS.SERVER_URL + 'createBlokedDate',
                params: { date: fecha }
            }).then(function(response) {
                $scope.listBlockedDate = [];
                $scope.dateBlocked();
                if (response.data.result == true) {
                    alert("La fecha fue agregada correctamente");
                } else {
                    alert(response.data.data);
                }
            });
        }


        function deleteBlokedDate() {
            let fecha = calendarCntrl.data.date;
            var ms = Date.parse(fecha);
            var fechas = new Date(ms);
            var year = new Date(ms).getFullYear();
            var month = new Date(ms).getMonth();
            var day = new Date(ms).getDay();

            let datebloked = year + '-' + month + '-' + day;

            $http({
                method: 'POST',
                url: $CONSTANTS.SERVER_URL + 'deleteBlokedDate',
                params: { date: fecha }
            }).then(function(response) {
                $scope.listBlockedDate = [];
                $scope.dateBlocked();
                if (response.data.result == true) {
                    alert("La fecha fue borrada correctamente");
                } else {
                    alert(response.data.data);
                }
            });
        }



    }

})();