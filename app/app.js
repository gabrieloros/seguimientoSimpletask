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
            SERVER_URL: 'http://localhost:8089/SimpleTask_Rest/adr/service/'
        })
        //.constant('SERVER_URL','http://localhost:8080/adr/service/')
        .config(function config($stateProvider) {

            $stateProvider
                .state('login', {
                    url: '',
                    views: {

                        // 'content': {
                        //     templateUrl: 'app/template/menu.html',
                        //     controller: 'appController as appCntrl'
                        // },
                        'sideBar': {
                            templateUrl: 'app/template/home.html',
                            controller: 'appController as appCntrl'

                        },
                        'route': {
                            templateUrl: 'app/template/menuRoute.html',
                            controller: 'appController as appCntrl'
                        }
                    }

                })
                .state('app', {
                    url: '/seguimiento',
                    views: {

                        'content': {
                            templateUrl: 'app/template/menu.html',
                            controller: 'appController as appCntrl'
                        },
                        'sideBar': {
                            templateUrl: 'app/template/home.html',
                            controller: 'appController as appCntrl'

                        },
                        'route': {
                            templateUrl: 'app/template/menuRoute.html',
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
                .state('app.groupAssignmentClaim', {
                    url: '/groupAssignmentClaim',
                    views: {

                        'content@': {
                            templateUrl: 'app/groupAssignment/template/menuGroupAssignment.html',
                            controller: 'groupAssignmentController as groupAssignmentCntrl'
                        },
                        'sideBar@': {
                            templateUrl: 'app/groupAssignment/template/mapaGroupAssignment.html',
                            controller: 'groupAssignmentController as groupAssignmentCntrl'

                        }
                    }
                })


        })

})();