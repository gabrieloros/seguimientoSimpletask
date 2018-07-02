/**
 * Created by Equipo 1 on 24/10/2017.
 */
(function() {
    'use strict';

    angular
        .module('mapa')
        .controller('controladorMapa', controladorMapa);

    controladorMapa.inject = ['serviceUser','servicePath','serviceButtons','serviceMapa' ,'$scope','$interval','$rootScope'];

    function controladorMapa(serviceUser,servicePath,serviceButtons,serviceMapa,$scope,$interval,$rootScope) {


        var contMap = this;

        contMap.asignadosClaims = false;
        contMap.userActive = false;


        var mapOptions = {
            zoom: 13,
            center: new google.maps.LatLng(-32.885, -68.8422),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        $rootScope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        
      
        contMap.contenidoMap = function (nameOperario, surnameOperario, idUser, identikey) {
            if($rootScope.markers != null){

                 contMap.closeContentMap();
            }
                        contMap.userActive = true;
                      $rootScope.nameOperario = nameOperario +''+ surnameOperario;
                      $rootScope.idUser = idUser;
                      $rootScope.identikey = identikey;
                    
                      console.log("identikey "+ $rootScope.identikey);
            

            var locationUser = function (idUser) {

                serviceUser.getUserPosition(({id: idUser}), function (response) {

                    $scope.dataPositionUser = response.data;
                    if ($scope.dataPositionUser != null) {
                        positionUser($scope.dataPositionUser);
                    }


                });
                // servicePath.getPathPosition(({id:idUser}),function (response) {
                //     contMap.dataPathPosition = response.data;
                //     if(contMap.dataPathPosition !=null){
                //
                //         angular.forEach(contMap.dataPathPosition,function (dataPath) {
                //
                //             var latLong= {lat:  parseFloat(dataPath.lat), lng: parseFloat(dataPath.lng)};
                //
                //             this.push(latLong);
                //
                //
                //         }  ,flightPlanCoordinates)
                //
                //         pathUser(flightPlanCoordinates);
                //
                //     }
                //
                // });

            };

            $rootScope.claimAssigned = function (identikey) {

                serviceMapa.getMarkers(({id: identikey}), function (response) {
                    contMap.dataMarkers = response.data;
                    if (contMap.dataMarkers != null) {
                        if(contMap.dataMarkers.length != 0){
                            contMap.asignadosClaims = true;
                            var i = 0;

                            for (i; i < contMap.dataMarkers.length; i++) {
                                createMarker(contMap.dataMarkers[i]);

                            }

                        }else {
                            contMap.asignadosClaims = false;
                            alert("No se encontraron Reclamos Asignados para este Usuario... ");
                        }

                    }

                });
            };



            locationUser(idUser);
            $rootScope.claimAssigned(identikey);
            var infoWindow = new google.maps.InfoWindow();

            $rootScope.markers = [];
    
            var flightPlanCoordinates = [];


            var createMarker = function (info) {


                var pick = {

                    url: 'app/mapa/imagen/claimAssing.png',
                    size: new google.maps.Size(40, 52),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(12, 40)
                };

                var marker = new google.maps.Marker({
                    icon: pick,
                    map: $rootScope.map,
                    position: new google.maps.LatLng(info.lat, info.lng),
                    title: info.code

                });
                if (info.address == null) {
                    info.address = '';
                }
                if (info.detail == null) {
                    info.detail = '';
                }
                if (info.cause == null) {
                    info.cause = '';
                }
                marker.content = '<div class="infoWindowContent" style="color: #0f0f0f">' + '<span class="glyphicon glyphicon-home" aria-hidden="true"></span>  ' +
                    info.address + '<br>' + '<span class="glyphicon glyphicon-paperclip" aria-hidden="true"></span>  ' +
                    info.detail + '<br>' + '<span class="glyphicon glyphicon-list" aria-hidden="true"></span>  ' +
                    info.cause + ' </div>';

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.setContent('<h2 style="color: #0f0f0f">' + marker.title + '</h2>' +
                        marker.content);
                    infoWindow.open($rootScope.map, marker);
                });


                $rootScope.markers.push(marker);
            }
            var positionUser = function (data) {


                var image = {

                    url: 'app/mapa/imagen/positionUser.png',
                    size: new google.maps.Size(80, 104),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(24, 80)
                };

                /* var fecha = setTime(data.date);*/
                var fecha = new Date(data.date);
                //fecha = fecha.toISOString().slice(0, 10);
                //fecha = fecha[0] + fecha[1] + fecha[2];

                var markerUser = new google.maps.Marker({

                    labelClass: "label",
                    icon: image,
                    map: $rootScope.map,
                    position: new google.maps.LatLng(data.lat, data.lng),
                    title: nameOperario + surnameOperario
                });
                $rootScope.dataTitle = nameOperario + surnameOperario;
                markerUser.content = '<div class="infoWindowContent" style="color: #0f0f0f">' + fecha + '  </div>';

                google.maps.event.addListener(markerUser, 'click', function () {
                    infoWindow.setContent('<h2 style="color: #0f0f0f">' + markerUser.title + '</h2>' +
                        markerUser.content);
                    infoWindow.open($rootScope.map, markerUser);
                });

                if ($rootScope.markers != null) {
                    for (var i = 0; i < $rootScope.markers.length; i++) {
                        if ($rootScope.markers[i].title == $rootScope.dataTitle) {
                            $rootScope.markers[i].setMap(null);
                        }
                    }
                }

                $rootScope.markers.push(markerUser);
            };


            $scope.openInfoWindow = function (e, selectedMarker) {
                e.preventDefault();
                google.maps.event.trigger(selectedMarker, 'click');
            }


            var pathUser = function (flightPlanCoordinates) {

                if (contMap.flightPath != null) {
                    contMap.flightPath.setMap(null);
                }


                contMap.flightPath = new google.maps.Polyline({
                    path: flightPlanCoordinates,
                    geodesic: true,
                    strokeColor: '#4b91ff',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                contMap.flightPath.setMap($rootScope.map);

            }


            contMap.repeat = $interval(function () {

                locationUser($rootScope.idUser);

            }, 20000);


            contMap.repeat = $interval(function () {
                for (var i = 0; i < $rootScope.markers.length; i++) {
                    if ($rootScope.markers[i].title != $rootScope.dataTitle) {
                        $rootScope.markers[i].setMap(null);
                    }
                }
                $rootScope.claimAssigned($rootScope.identikey);

            }, 180000);
        };


        //function buttons
        contMap.active = false;

        contMap.getClaimsFinishClose = function () {
            contMap.active = true;
           var identikeyUser = $rootScope.identikey;
            serviceButtons.getClaimsFinish(({id:  identikeyUser}), function (response) {
                contMap.dataClaimsFinish = response.data;

                if (contMap.dataClaimsFinish != null) {
                    if(contMap.dataClaimsFinish.length != 0){

                        var i = 0;
                        for (i; i < contMap.dataClaimsFinish.length; i++) {
                            createMarkersClaimsFinish(contMap.dataClaimsFinish[i]);

                        }

                    }else {
                        contMap.active = false;
                        alert("No se encontraron Reclamos Terminados durante el dia por este Usuario... Intentelo más tarde");
                    }


                }
            })
        }

        $rootScope.markersClaimClose = [];
        var createMarkersClaimsFinish = function (info) {

            var infoWindow = new google.maps.InfoWindow();


            var pick = {

                url: 'app/mapa/imagen/claimClose.png',
                size: new google.maps.Size(40, 52),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(12, 40)
            };
            var fecha = new Date(info.closeDate);
            var marker = new google.maps.Marker({
                icon: pick,
                map: $rootScope.map,
                position: new google.maps.LatLng(info.lat, info.lng),
                title: info.code,
                stateid: info.state

            });
            if (info.address == null) {
                info.address = '';
            }
            if (info.detail == null) {
                info.detail = '';
            }
            if (info.cause == null) {
                info.cause = '';
            }
            marker.content = '<div class="infoWindowContent" style="color: #0f0f0f">' + '<span class="glyphicon glyphicon-home" aria-hidden="true"></span>  ' +
                info.address + '<br>' + '<span class="glyphicon glyphicon-paperclip" aria-hidden="true"></span>  ' +
                info.detail + '<br>' + '<span class="glyphicon glyphicon-list" aria-hidden="true"></span>  ' +
                info.cause + ' </div>';

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent('<h2 style="color: #0f0f0f">' + marker.title + '</h2>' +
                    marker.content);
                infoWindow.open($rootScope.map, marker);
            });


            $rootScope.markersClaimClose.push(marker);
        }

        contMap.deleteClaimsFinish=function() {
            contMap.active = false;
            for (var i = 0; i < $rootScope.markersClaimClose.length; i++) {
                if ($rootScope.markersClaimClose[i].stateid == 2) {
                    $rootScope.markersClaimClose[i].setMap(null);
                }
            }


        }
        contMap.deleteClaim=function() {
            contMap.asignadosClaims = false;
            for (var i = 0; i < $rootScope.markers.length; i++) {
                if ($rootScope.markers[i].title != $rootScope.dataTitle) {
                    contMap.clearPoints();
                }
            }
        }

        contMap.viewClaim = function () {

            $rootScope.claimAssigned($rootScope.identikey);
        }

        contMap.closeContentMap = function (){

           
            contMap.clearPoints();

              contMap.userActive = false;
              contMap.asignadosClaims= false;
              
            
        }


        contMap.clearPoints = function (){
            for(var i=0; i< $rootScope.markers.length; i++){ 
                $rootScope.markers[i].setMap(null); 
              } 
        }
        function getPathFindxDay(idUser) {


        }

    }

    })();

   