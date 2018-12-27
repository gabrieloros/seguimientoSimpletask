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
                'deleteClaim': { url: route + "deleteClaim/:claimId", claimId: '@claimId', method: 'GET' },
                'getListClaimsAssignmentByUser': { url: route + "listClaimsAssignmentByUser/:userId/:groupId", userId: '@userId', groupId: '@groupId', method: 'GET' },
                'getListClaimsNotAssignment': { url: route + "listClaimsNotAssignment/:groupId", groupId: '@groupId', method: 'GET' }
            });
            return resource;
        });
})();