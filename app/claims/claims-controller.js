(function() {
    'use strict';

    angular
        .module('claims')
        .controller('claimsController', claimsController);

    claimsController.$inject = ['$rootScope', '$scope', '$http', '$filter', '$interval', 'statusService'];

    function claimsController($rootScope, $scope, $http, $filter, $interval, statusService) {

    }

})();