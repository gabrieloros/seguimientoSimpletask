(function() {
    'use strict';

    angular.module('calendar', [])

    .config(function config($stateProvider) {

        $stateProvider
            .state('calendar', {
                url: '/calendar',
                views: {

                    'content@': {
                        templateUrl: 'app/template/calendar.html',
                        controller: 'calendarController as calendarCntrl'
                    }
                }

            })


    })

})();