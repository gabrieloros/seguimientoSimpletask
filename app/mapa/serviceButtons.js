

(function() {
    'use strict';

    angular
        .module('mapa')
        .factory('serviceButtons', serviceButtons);

    serviceButtons.$inject = ['$resource'];

    function serviceButtons($resource) {

        var resourceUrl =  'http://192.168.1.117:8089/SimpleTask_Rest/adr/service/getClaimsFinish/:id';

        return $resource(resourceUrl,{},

            {'getClaimsFinish' :
                    {method :"GET",
                        headers:"application/json",
                        isArray:false}
            } );

    }
})();
