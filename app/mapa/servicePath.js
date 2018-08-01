/**
 * Created by Equipo 1 on 25/10/2017.
 */
(function() {
    'use strict';

    angular
        .module('mapa')
        .factory('servicePath', servicePath);

    servicePath.$inject = ['$resource'];

    function servicePath($resource) {


        var resourceUrl =  'http://192.168.1.109:8089/SimpleTask_Rest/adr/service/positionsPath/:id';

        return $resource(resourceUrl,{},

            {'getPathPosition' :
                    {method :"GET",
                        headers:"application/json",
                        isArray:false}
            } );



    }
})();
