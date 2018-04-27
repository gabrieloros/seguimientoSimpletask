/**
 * Created by Equipo 1 on 24/10/2017.
 */

(function() {
    'use strict';

    angular
        .module('app')
        .factory('listUsers', listUsers);

    listUsers.$inject = ['$http', '$q', '$timeout','$resource'];

    function listUsers($http, $q,  $timeout,$resource) {

        var resourceUrl =  'http://192.168.1.104:8089/SimpleTask_Rest/adr/service/listUsers';

        return $resource(resourceUrl,{},

            {'get' :
            {method :"GET",
                //contentType: "application/x-www-form-urlencoded",
                headers:"application/json",
                contentType: "text/pain",
                isArray:false}
        } );

    }
})();
                            