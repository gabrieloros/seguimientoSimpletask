(function() {
    'use strict';

    angular
        .module('app')
        .factory('statusService', function($resource) {
            var route = "http://localhost:8089/SimpleTask_Rest/adr/service/"
            var resource = $resource(route, {}, {
                'getResumenUsers': { url: route + "userList/:projectId/:timeCode", method: 'GET', projectId: '@projectId', timeCode: '@projectId' },
                'getClaimsFromUsers': { url: route + "claimsList/:projectId/:timeCode", method: 'GET', projectId: '@projectId', timeCode: '@projectId' },
                'getProjects': { url: route + "proyectList", method: 'GET' },
                'getCountTotal': { url: route + "claimsAmounts/:projectId/:timeCode/:typeCode", method: 'GET', projectId: '@projectId', timeCode: '@projectId', typeCode: '@projectId' },
                'getClaimAmountsData': { url: route + "claimsAmountsData/:typeCode", method: 'GET', typeCode: '@projectId' },
                'getListTheInfoForm': { url: route + "dataInfoForm", method: 'GET' },
                'setNewClaims': { url: route + "createclaimbyst/:identikey/:data/:positions", method: 'POST', identikey: '@identikey', data: '@data', positions: '@positions' }

            });
            return resource;
        });
})();