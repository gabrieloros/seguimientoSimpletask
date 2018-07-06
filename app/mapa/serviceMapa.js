/**
 * Created by Equipo 1 on 25/10/2017.
 */

(function() {
    'use strict';

    angular
        .module('mapa')
        .factory('serviceMapa', serviceMapa);

    serviceMapa.$inject = ['$resource'];

    function serviceMapa($resource) {

        var resourceUrl =  'http://192.168.1.109:8089/SimpleTask_Rest/adr/service/getMarkers/:id';

        return $resource(resourceUrl,{},

            {'getMarkers' :
            {method :"GET",
                headers:"application/json",
                isArray:false}
            } );
        
    }
})();
                            