(function() {
    'use strict';

    angular.module('app', [
            'ui.router',
            'ngResource',
            'angular-loading-bar',
            'mapa',
            'claims',
            'assignment'


        ])
        .constant('CONSTANTS', {
            SERVER_URL: 'http://localhost:8080/SimpleTask_Rest/adr/service/'
        })
        .config(function config($stateProvider) {

            $stateProvider
                .state('app', {
                    url: '',
                    views: {

                        'content': {
                            templateUrl: 'app/template/menu.html',
                            controller: 'appController as appCntrl'
                        },
                        'sideBar': {
                            templateUrl: 'app/template/home.html',
                            controller: 'appController as appCntrl'

                        }
                    }

                })
                .state('app.claims', {
                    url: '/claims',
                    views: {

                        'content@': {
                            templateUrl: 'app/claims/template/menu-claims.html',
                            controller: 'claimsController as claimsCntrl'
                        }
                    }
                })
                .state('app.calendar', {
                    url: '/calendar',
                    views: {

                        'content@': {
                            templateUrl: 'app/calendar/template/calendar.html',
                            controller: 'calendarController as calendarCntrl'
                        }
                    }
                })
                .state('app.assignmentClaim', {
                    url: '/assignmentClaim',
                    views: {

                        'content@': {
                            templateUrl: 'app/assignment/template/menuAssignment.html',
                            controller: 'assignmentController as assignmentCntrl'
                        },
                        'sideBar@': {
                            templateUrl: 'app/assignment/template/mapaAssignment.html',
                            controller: 'assignmentController as assignmentCntrl'

                        }
                    }
                })

        })

})();