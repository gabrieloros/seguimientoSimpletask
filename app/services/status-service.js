(function() {
    'use strict';

    angular
        .module('app')
        .factory('statusService', function($resource){
          var route = "http://godoycruz.simpletask.com.ar:8080/Simpletask_Prueba/adr/service/"
          var resource = $resource(route, {},
            {
              'getResumenUsers': { url: route + "userList/:projectId/:timeCode", method: 'GET', projectId: '@projectId', timeCode: '@projectId' },
              'getClaimsFromUsers': { url: route + "claimsList/:projectId/:timeCode", method: 'GET', projectId: '@projectId', timeCode: '@projectId'},
              'getProjects': { url: route + "proyectList", method: 'GET'}
            });
          return resource;
        });
})();