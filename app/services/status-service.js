(function() {
    'use strict';

    angular
        .module('app')
        .factory('statusService', function($resource){
          var route = "http://godoycruz.simpletask.com.ar:8080/Simpletask_Prueba/adr/service/"
          var resource = $resource(route, {},
            {
              'getResumenUsers': { url: route + "userList/:proyectId", method: 'GET', proyectId: '@proyectId' },
              'getClaimsFromUsers': { url: route + "claimsList/:proyectId", method: 'GET', proyectId: '@proyectId'},
              'getProyects': { url: route + "proyectList", method: 'GET'}
            });
          return resource;
        });
})();