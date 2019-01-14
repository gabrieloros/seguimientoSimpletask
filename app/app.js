(function() {
    'use strict';

    angular.module('app', [
            'ui.bootstrap',
            'ui.router',
            'ngResource',
            'angular-loading-bar',
            'mapa',
            'claims',
            'assignment',
            'claimsList'


        ])
        .constant('CONSTANTS', {
            SERVER_URL: 'http://localhost:8089/SimpleTask_Rest/adr/service/'
        })
        //.constant('SERVER_URL','http://localhost:8080/adr/service/')
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

                        },
                        'route': {
                            templateUrl: 'app/template/menuRoute.html',
                            controller: 'appController as appCntrl'
                        }
                    }

                })
                .state('app.login', {
                    url: '/login',
                    views: {
                        'content@': {
                            templateUrl: 'app/login/template/viewWelcome.html',
                            controller: 'appController as appCntrl'
                        },
                        'route@': {
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
                        },

                        'route@': {
                            templateUrl: 'app/template/menuRoute.html',
                            controller: 'appController as appCntrl'
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
                        },
                        'route@': {
                            templateUrl: 'app/template/menuRoute.html',
                            controller: 'appController as appCntrl'
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

                        },
                        'route@': {
                            templateUrl: 'app/template/menuRoute.html',
                            controller: 'appController as appCntrl'
                        }
                    }
                })
                .state('app.listClaims', {
                    url: '/claimsList',
                    views: {
                        'content@': {
                            templateUrl: 'app/claimsList/template/menu-claimsList.html',
                            controller: 'claimsListController as claimsListCntrl'
                        },
                        'sideBar@': {
                            templateUrl: 'app/claimsList/template/mapaClaimList.html',
                            controller: 'claimsListController as claimsListCntrl'

                        },
                        'route@': {
                            templateUrl: 'app/template/menuRoute.html',
                            controller: 'appController as appCntrl'
                        }
                    }
                })



        })

})();