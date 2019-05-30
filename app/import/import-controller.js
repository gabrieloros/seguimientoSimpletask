(function() {
    'use strict';

    angular
        .module('app')
        .controller('importController', importController);

    importController.$inject = ['$rootScope', '$scope', '$http', '$filter', '$interval', 'statusService', '$state', '$window', 'CONSTANTS'];

    function importController($rootScope, $scope, $http, $filter, $interval, statusService, $state, $window, $CONSTANTS) {

        var importController = this;
        //function geolocalizacion
        var mapBing, searchManager;

        function GetMap(address, datos) {
            mapBing = new Microsoft.Maps.Map('#myMap', {
                credentials: 'AjA3ss3hE6KKJh4nzOddYAblgTXQlOkBy7Pra1xx-qjYQCvcC-VzVrFAVPwv-wT5'
            });
            geocodeQuery(address, datos);
        }

        function geocodeQuery(address, datos) {
            if (!searchManager) {
                Microsoft.Maps.loadModule('Microsoft.Maps.Search', function() {
                    searchManager = new Microsoft.Maps.Search.SearchManager(mapBing);
                    geocodeQuery(address, datos);
                });
            } else {
                var searchRequest = {
                    where: address,
                    callback: function(r) {
                        //Add the first result to the map and zoom into it.
                        if (r && r.results && r.results.length > 0) {
                            var pin = new Microsoft.Maps.Pushpin(r.results[0].location);

                            $scope.latGeo = r.results[0].location.latitude;
                            $scope.lngGeo = r.results[0].location.longitude;
                            var idClaim = datos.ID;
                            var detail = datos.DETALLE;
                            if (detail == null || detail == "") {
                                detail = "--";
                            }

                            if ($scope.latGeo != null && $scope.lngGeo != null) {

                                var data = {
                                    "id": idClaim,
                                    "address": address,
                                    "detail": detail,
                                    "lon": $scope.lngGeo,
                                    "lat": $scope.latGeo
                                }
                            } else {

                                var data = {
                                    "id": idClaim,
                                    "address": address,
                                    "detail": detail,
                                    "lon": null,
                                    "lat": null
                                }
                            }
                            $scope.dataClaims.claims.push(data);
                            if ($scope.countRowExcel == $scope.dataClaims.claims.length) {

                                createClaimsImport($scope.dataClaims);
                            }

                        }
                    },
                    errorCallback: function(e) {
                        alert("No results found.");
                    }
                };

                searchManager.geocode(searchRequest);
            }
        }

        //fin de geo
        $scope.READ = function() {
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
            var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
            if ($("#ngexcelfile").val().toLowerCase().indexOf(".xlsx") > 0) {
                xlsxflag = true;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = e.target.result;
                if (xlsxflag) {
                    var workbook = XLSX.read(data, { type: 'binary' });
                } else {
                    var workbook = XLS.read(data, { type: 'binary' });
                }

                var sheet_name_list = workbook.SheetNames;
                var cnt = 0;
                sheet_name_list.forEach(function(y) { /*Iterate through all sheets*/

                    if (xlsxflag) {
                        var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                    } else {
                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                    }
                    if (exceljson.length > 0) {

                        $scope.dataClaims = { claims: [] };
                        $scope.countRowExcel = exceljson.length;

                        for (var i = 0; i < exceljson.length; i++) {
                            if (exceljson[i].LATITUD != null && exceljson[i].LONGITUD != null) {
                                var address = exceljson[i].CALLE;
                                var detail = exceljson[i].DETALLE;
                                var id = exceljson[i].ID;
                                if (exceljson[i].LATITUD != null) {

                                    var latitude = exceljson[i].LATITUD;
                                }
                                if (exceljson[i].LONGITUD != null) {

                                    var longitude = exceljson[i].LONGITUD;
                                }
                                if (address == null || address == "") {
                                    address = "--";
                                }
                                if (detail == null || detail == "") {
                                    detail = "--";
                                }
                                var data = {
                                    "id": id,
                                    "address": address,
                                    "detail": detail,
                                    "lon": longitude,
                                    "lat": latitude
                                }
                                $scope.dataClaims.claims.push(data);
                                if ($scope.countRowExcel == $scope.dataClaims.claims.length) {

                                    createClaimsImport($scope.dataClaims);
                                }
                            } else {
                                var address = exceljson[i].CALLE + ", Godoy Cruz, Mendoza";
                                GetMap(address, exceljson[i]);
                                //geocodeQuery(address);

                            }
                            // var address = exceljson[i].Dirección + " " + exceljson[i].Altura + ", Lanus, Buenos Aires";
                            //GetMap(address, exceljson[i]);
                            // geocodeQuery(address);
                        }
                    }
                });
            }
            if (xlsxflag) {
                reader.readAsArrayBuffer($("#ngexcelfile")[0].files[0]);
            } else {
                reader.readAsBinaryString($("#ngexcelfile")[0].files[0]);
            }
        };


        var createClaimsImport = function(data) {
            data = JSON.stringify(data);

            $.ajax({
                type: 'POST',
                url: $CONSTANTS.SERVER_URL + 'importClaims',
                json: data,
                data: data,
                datatype: "application/json",
                contentType: "text/plain",

                success: function(result, response, json) {

                    alert("Los reclamos fueron importados");
                    $state.go('app');
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                    alert("Los reclamos fueron importados");
                    $state.go('app');

                }


            });

        }


    }

})();