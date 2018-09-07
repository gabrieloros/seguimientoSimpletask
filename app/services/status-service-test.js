(function() {
    'use strict';

    angular
        .module('app')
        .factory('statusServiceTest', statusServiceTest);

    statusServiceTest.$inject = ['$http', '$q', '$timeout','$resource', '$filter'];

    function statusServiceTest($http, $q, $timeout, $resource, $filter) {

      var getResumenUsers = function(){
        console.log("Begin getResumenUsers");
        var deferred = $q.defer();
        var resumen = [];
        var userTest1 = {
          id: 1,
          name: "Nombre",
          surname: "Apellido",
          full_name: "NOMBRE APELLIDO",
          pending_claims:1234,
          completed_claims: 5678,
          last_position_date: 1476718834000,
          last_position_latitude: -32.91294544,
          last_position_longitude: -68.84815175,
        };
        var userTest2 = {
          id: 2,
          name: "Nombre 2",
          surname: "Apellido 2",
          full_name: "NOMBRE APELLIDO 2",
          pending_claims: 22,
          completed_claims: 13,
          last_position_date: 1476918834000,
          last_position_latitude: -32.90294544,
          last_position_longitude: -68.85815175,
        };
        var userTest3 = {
          id: 3,
          name: "Nombre 3",
          surname: "Apellido 3",
          full_name: "NOMBRE APELLIDO 3",
          pending_claims: 223,
          completed_claims: 132,
          last_position_date: 1479918834000,
          last_position_latitude: -32.92294544,
          last_position_longitude: -68.83815175,
        };
        resumen.push(userTest1);
        resumen.push(userTest2);
        resumen.push(userTest3);
        deferred.resolve({ success: true, data: resumen });
        console.log("End getResumenUsers");
        return deferred.promise;        
      };

      var getClaimsFromUsers = function(users){
        console.log("Begin getClaimsFromUsers");
        var deferred = $q.defer();
        var claims = [];
        var userClaimsTest = {
          id: 1,
          code: "code",
          latitude: -32.91295544,
          longitude: -68.84855175,
          date: 1476718834000,
          user_id: 1,
          status: 'completed'//pending|completed
        };
        var userClaimsTest2 = {
          id: 2,
          code: "code2",
          latitude: -32.92295544,
          longitude: -68.84855175,
          date: 1476218834000,
          user_id: 2,
          status: 'pending'//pending|completed
        };
        var userClaimsTest3 = {
          id: 3,
          code: "code3",
          latitude: -32.91295544,
          longitude: -68.81855175,
          date: 1476728834000,
          user_id: 3,
          status: 'completed'//pending|completed
        };
        var userClaimsTest4 = {
          id: 4,
          code: "code4",
          latitude: -32.91295544,
          longitude: -68.84955175,
          date: 1476718834000,
          user_id: 1,
          status: 'pending'//pending|completed
        };
        var userClaimsTest5 = {
          id: 5,
          code: "code5",
          latitude: -32.91395544,
          longitude: -68.84855175,
          date: 1476713834000,
          user_id: 2,
          status: 'completed'//pending|completed
        };
        var userClaimsTest6 = {
          id: 6,
          code: "code6",
          latitude: -32.91195544,
          longitude: -68.89855175,
          date: 1476718834000,
          user_id: 3,
          status: 'pending'//pending|completed
        };
        claims.push(userClaimsTest);
        claims.push(userClaimsTest2);
        claims.push(userClaimsTest3);
        claims.push(userClaimsTest4);
        claims.push(userClaimsTest5);
        claims.push(userClaimsTest6);
        var userIds = users.map(function (user) {
          return user.id;
        });
        claims = $filter('filter')(claims, function(value){
          if(userIds.indexOf(value.user_id) !== -1) {
            return true;
          }
          return false;
        });
        deferred.resolve({ success: true, data: claims });
        console.log("End getClaimsFromUsers");
        return deferred.promise;        
      };

      return {
        getResumenUsers: getResumenUsers,
        getClaimsFromUsers: getClaimsFromUsers
      };
    }
})();