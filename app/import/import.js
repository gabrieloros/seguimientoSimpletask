(function() {
    'use strict';

    angular.module('import', [])

    .config(function config($stateProvider) {

        $stateProvider
            .state('import', {
                url: '/imports',
                views: {

                    'content@': {
                        templateUrl: 'app/import/template/import.html',
                        controller: 'appController as appCntrl'

                        // controller: 'importController as importCntrl'
                    }
                }

            })


    })

})();