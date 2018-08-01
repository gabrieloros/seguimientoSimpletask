/**
 * Created by Equipo 1 on 24/10/2017.
 */

(function() {
    'use strict';

    angular
        .module('app')
        .factory('listUsers', listUsers);

    listUsers.$inject = ['$http', '$q', '$timeout','$resource'];

    function listUsers($http, $q, $timeout, $resource) {

        var resourceUrl =  'http://godoycruz.simpletask.com.ar:8080/Simpletask_Rest_GC/adr/service/listUsers';

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
                            