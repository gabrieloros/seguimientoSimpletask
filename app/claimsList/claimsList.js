(function() {
    'use strict';

    angular.module('claimsList', [])

    .config(function config($stateProvider) {

        $stateProvider
            .state('claimsList', {
                url: '/list',
                views: {

                    'content@': {
                        templateUrl: 'app/template/menuClaimsList.html',
                        controller: 'claimsListController as claimsListCntrl'
                    }
                }

            })


    })

})();