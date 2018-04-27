/**
 * Created by Equipo 1 on 25/10/2017.
 */
(function() {
    'use strict';

    angular
        .module('mapa')
        .factory('serviceUser', serviceUser);

    serviceUser.$inject = ['$resource'];

    function serviceUser($resource) {


        var resourceUrl =  'http://192.168.1.104:8089/SimpleTask_Rest/adr/service/positionUser/:id';

        return $resource(resourceUrl,{},

            {'getUserPosition' :
            {method :"GET",
                headers:"application/json",
                isArray:false}
            } );


       
    }
})();
                            