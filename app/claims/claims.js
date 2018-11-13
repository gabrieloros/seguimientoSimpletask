(function() {
    'use strict';

    angular.module('claims', [])

    .config(function config($stateProvider) {

        $stateProvider
            .state('claims', {
                url: '/claimss',
                views: {

                    'content@': {
                        templateUrl: 'app/template/menuClaims.html',
                        controller: 'claimsController as claimsCntrl'
                    }
                }

            })


    })

})();