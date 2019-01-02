(function() {
    'use strict';

    angular.module('assignment', [])

    .config(function config($stateProvider) {

        $stateProvider
            .state('assignment', {
                url: '/assignment',
                views: {

                    'content@': {
                        templateUrl: 'app/template/menuAssignment.html',
                        controller: 'assignmentController as assignmentCntrl'
                    }
                }

            })
    })

})();