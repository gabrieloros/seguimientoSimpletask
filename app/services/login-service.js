(function() {
    'use strict';

    angular
        .module('app')
        .factory('serviceLogin', function($resource) {
            var route = "http://localhost:8089/SimpleTask_Rest/adr/service/"
            var resource = $resource(route, {}, {
                'getLoginST': { url: route + "loginST/:userName/:passwordKey", method: 'GET', userName: '@userName', passwordKey: '@passwordKey' }
            });
            return resource;
        });
})();