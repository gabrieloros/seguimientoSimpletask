(function() {
    'use strict';

    angular
        .module('app')
        .controller('appController', appController);

    appController.$inject = ['$rootScope', '$scope', '$http', '$filter', '$interval', 'statusService', '$window', '$compile', 'CONSTANTS'];

    function appController($rootScope, $scope, $http, $filter, $interval, statusService, $window, $compile, $CONSTANTS) {
        var appCntrl = this;
        appController.menuClaims = menuClaims;
        $rootScope.buttonMultipleMarker;
        $rootScope.markers = [];
        $scope.selectedUsers = [];
        $scope.freeUsers = [];
        $scope.allUsers = [];
        $scope.claims = [];
        $scope.tableExcelClaims = [];
        $scope.newClaims = [];
        $scope.dateIn = null;
        $scope.dateOut = null;
        $scope.completedClaims = 0;
        $scope.pendingClaims = 0;
        $scope.currentProjectId = 0;
        $scope.currentProjectName = "";
        $scope.projectPendingClaims = 0;
        $scope.projectCompletedClaims = 0;
        $scope.totalPendingClaims = 0;
        $scope.instalation = null;
        $scope.projects = null;
        $scope.index = 0;
        $scope.timeCode = 0;
        $window.sessionStorage.removeItem('listNewMarket');
        $scope.isNavCollapsed = true;
        $scope.isCollapsed = false;
        $scope.isCollapsedHorizontal = true;
        //$scope.geocoder = new google.maps.Geocoder();

        var mapOptions = {
            zoom: 13,
            center: new google.maps.LatLng(-32.885, -68.8422),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

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

        $rootScope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        var card = document.getElementById('pac-card');
        var input = document.getElementById('pac-input');
        var types = "changetype-all";

        $rootScope.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', $rootScope.map);
        autocomplete.setFields(
            ['address_components', 'geometry', 'icon', 'name']);

        var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        var marker = new google.maps.Marker({
            map: $rootScope.map,
            anchorPoint: new google.maps.Point(0, -29)
        });
        // excel


        autocomplete.addListener('place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {

                var markersSearch = $filter('filter')($rootScope.markers, { type: 'claim' });
                var markerlocation = false;
                angular.forEach(markersSearch, function(marker) {

                    if (marker.title == place.name) {
                        $rootScope.map.setCenter(marker.position);
                        $rootScope.map.setZoom(17);
                        markerlocation = true;
                    }

                })
                if (!markerlocation) {

                    window.alert("No se encontro la direccion solicitada: '" + place.name + "'");
                }
                return;
            }


            if (place.geometry.viewport) {
                $rootScope.map.fitBounds(place.geometry.viewport);
            } else {
                $rootScope.map.setCenter(place.geometry.location);
                $rootScope.map.setZoom(17); // Why 17? Because it looks good.
            }
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            //infowindow.open($rootScope.map, marker);
        });


        var drawingManager = new google.maps.drawing.DrawingManager({
            // drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['marker', 'polygon', 'rectangle']
            },

        });
        drawingManager.setMap($rootScope.map);
        google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {

            if (event.type == 'marker') {
                event.overlay.visible = false;

                $scope.index++;
                var location = event.overlay.position;
                var infoWindow = new google.maps.InfoWindow();
                var markerNew = new google.maps.Marker({
                    position: location,
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                    icon: 'app/mapa/imagen/createClaim.png',
                    map: $rootScope.map

                });
                markerNew.set("zIndex", $scope.index);


                var htmlElement = '<button class="btn btn-primary" ng-click="removeMarker(' + markerNew.zIndex + ')"> Eliminar </button>';

                var compiled = $compile(htmlElement)($scope)
                google.maps.event.addListener(markerNew, 'click', function() {
                    infoWindow.setContent(compiled[0]);
                    infoWindow.open($rootScope.map, markerNew);
                });
                $scope.newClaims.push(markerNew);
                guardarNewListMarkers();

                google.maps.event.addListener(markerNew, 'dragend', function() {

                    $window.sessionStorage.removeItem('listNewMarket');
                    guardarNewListMarkers();
                });
            }
        });


        var updateResumenData = function(arrayNew) {
            //Actualizar los usuarios seleccionados e ir sacando del nuevo lo que coincide
            //Actualizar los libres e ir sacando del nuevo lo que coincide
            //Finalmente si hay algun usuario nuevo se deberá agregar en el listado de usuarios libres
            var newDataCount = arrayNew.length;
            var arrayFreeUser = angular.copy(arrayNew);
            angular.forEach(arrayNew, function(value, key) {
                var selectedUser = $filter('filter')($scope.selectedUsers, { id: value.id })[0];
                if (selectedUser) {
                    var index = $scope.selectedUsers.indexOf(selectedUser);
                    $scope.selectedUsers[index] = value;
                    var indexToFreeUser = arrayFreeUser.indexOf(value);
                    arrayFreeUser.splice(indexToFreeUser, 1);
                } else {
                    var freeUser = $filter('filter')($scope.freeUsers, { id: value.id })[0];
                    if (freeUser) {
                        var index = $scope.freeUsers.indexOf(freeUser);
                        $scope.freeUsers[index] = value;
                        var indexToFreeUser = arrayFreeUser.indexOf(value);
                        arrayFreeUser.splice(indexToFreeUser, 1);
                    }
                }
                if (newDataCount == 1) {
                    angular.forEach(arrayFreeUser, function(value, key) {
                        $scope.freeUsers.push(value);
                    });
                    drawPositionMarkers();
                    updateSeletedData();
                } else {
                    newDataCount = newDataCount - 1;
                }
            });
        }
        var src = 'app/mapa/malvinasarg.kml';
        var kmlLayer = new google.maps.KmlLayer(src, {
            suppressInfoWindows: true,
            preserveViewport: false,
            map: $rootScope.map
        });
        var createPositionMarkerFromUser = function(user) {
            var infoWindow = new google.maps.InfoWindow();
            var image = {
                url: 'app/mapa/imagen/positionUser.png',
                // size: new google.maps.Size(40, 52),
                // origin: new google.maps.Point(0, 0),
                // anchor: new google.maps.Point(12, 40)
            };

            var date = new Date(user.last_position_date);
            var date = $filter('date')(user.last_position_date, 'dd-MM-yyyy HH:mm:ss');
            var markerUser = new google.maps.Marker({
                labelClass: "label",
                icon: image,
                map: $rootScope.map,
                position: new google.maps.LatLng(user.last_position_latitude, user.last_position_longitude),
                title: user.full_name,
                user_id: user.id,
                type: "position"
            });
            markerUser.content = '<div class="infoWindowContent" style="color: #0f0f0f">' + date + ' hs</div>';
            infoWindow.setContent('<b style="color: #0f0f0f">' + markerUser.title + '</b>');
            infoWindow.setOptions({ disableAutoPan: true });
            infoWindow.open($rootScope.map, markerUser);
            google.maps.event.addListener(markerUser, 'click', function() {
                infoWindow.open($rootScope.map, markerUser);
            });
            $rootScope.markers.push(markerUser);
        }

        var createClaimMarker = function(claim, type) {
            var infoWindow = new google.maps.InfoWindow();
            if (type == 0) {
                var urlRoute = 'app/mapa/imagen/blue.png'
            } else {
                var urlRoute = 'app/mapa/imagen/' + (claim.status == 'pending' ? 'red' : 'green') + '.png'
            }
            var claimIcon = {
                url: urlRoute,
                // size: new google.maps.Size(40, 52),
                // origin: new google.maps.Point(0, 0),
                // anchor: new google.maps.Point(12, 40)
            };
            var date = new Date(claim.date);
            if (claim.address != null && claim.address != '') {

                var addressClaim = claim.address;
            } else {
                var addressClaim = "Sin direccion";
            }

            var marker = new google.maps.Marker({
                icon: claimIcon,
                map: $rootScope.map,
                position: new google.maps.LatLng(claim.latitude, claim.longitude),
                title: claim.code,
                content: claim.code,
                id: claim.id,
                type: "claim",
                draggable: true,
                user_id: claim.user_id,
                detail: claim.detail,
                address: addressClaim

            });

            if (claim.status == 'pending') {

                var htmlElement = '<div> <h4 style="color: #0f0f0f">' + marker.title + '</h4><h5 style="color: #0f0f0f"> <input id="address" style="font-size: 30px" type="text" value="' + addressClaim + '"></h5><h5 style="color: #0f0f0f">' + marker.detail + '</h5><br><button type="button" class="btn btn-default" aria-label="Left Align" ng-click="deleteCLaim(' + marker.id + ')">  <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> </button><button type="button" class="btn btn-default" aria-label="Left Align" ng-click="newGeobyAddress(' + marker.id + ')"><span class="glyphicon glyphicon-globe" aria-hidden="true"></span></button><button type="button" class="btn btn-default" aria-label="Left Align" ng-click="editAddressClaim(' + marker.id + ')" disabled><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button></div>';
            } else {
                var htmlElement = '<div> <h4 style="color: #0f0f0f">' + marker.title + '</h4><h5 style="color: #0f0f0f">' + addressClaim + '</h5><h5 style="color: #0f0f0f">' + marker.detail + '</h5>';

            }


            var compiled = $compile(htmlElement)($scope);

            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.setContent(compiled[0]);
                //infoWindow.setContent('<h4 style="color: #0f0f0f">' + marker.title + '</h4><br>' + compiled[0]);
                infoWindow.open($rootScope.map, marker);
            });
            google.maps.event.addListener(marker, 'dragend', function() {
                var latitude = marker.position.lat();
                var longitude = marker.position.lng();

                $http({
                    method: 'POST',
                    url: $CONSTANTS.SERVER_URL + 'updateAddress',
                    params: { claimId: marker.id, latitude: latitude, longitude: longitude, address: marker.address }
                }).then(function(response) {
                    if (response.data.result == true) {
                        alert("Se guardo correctamen la posicion");
                    } else {
                        alert(response.data.data);
                    }
                });

            });
            $rootScope.markers.push(marker);
        }

        function guardarNewListMarkers() {

            var positions = [];
            if ($scope.newClaims != null) {
                angular.forEach($scope.newClaims, function(marker) {
                    positions.push(marker.getPosition().lat() + '|' + marker.getPosition().lng());
                })
                $window.sessionStorage["listNewMarket"] = positions;
            }
        }

        var drawPositionMarkers = function() {
            var markersToDelete = $filter('filter')($rootScope.markers, { type: 'position' });
            angular.forEach(markersToDelete, function(marker, key) {
                marker.setMap(null);
            });
            $rootScope.markers = $filter('filter')($rootScope.markers, { type: '!position' });
            angular.forEach($scope.selectedUsers, function(value, key) {
                createPositionMarkerFromUser(value);
            });

        }

        var deletePositionMarkerFromUser = function(user) {
            var indexToDelete = -1;
            var markerToDelete = $filter('filter')($rootScope.markers, function(value, index) {
                indexToDelete = index;
                return value.user_id == user.id && value.type == 'position';
            })[0];
            if (markerToDelete) {
                $rootScope.markers.splice(indexToDelete, 1);
                markerToDelete.setMap(null);
            }
        }

        var drawClaimMarkers = function(type) {
            if (type == null) {
                var markersToDelete = $filter('filter')($rootScope.markers, function(marker) {
                    return marker.type === 'claim';
                });
                angular.forEach(markersToDelete, function(marker, key) {
                    var indexToDelete = $rootScope.markers.indexOf(marker);
                    $rootScope.markers.splice(indexToDelete, 1);
                    marker.setMap(null);
                });
                $rootScope.markers = $filter('filter')($rootScope.markers, { type: '!claim' });
                angular.forEach($scope.claims, function(claim, key) {
                    createClaimMarker(claim);
                });
            } else {
                angular.forEach($rootScope.markers, function(marker, key) {
                    marker.setMap(null);
                });
                angular.forEach($scope.claims, function(claim, key) {
                    createClaimMarker(claim, type);
                });
            }

        }

        var deleteInfoUser = function(user) {
            var markersCount = $rootScope.markers.length;
            angular.forEach($rootScope.markers, function(marker, key) {
                if ((marker.user_id == user.id && marker.type == "claim") || (marker.user_id == user.id && marker.type == "position")) {
                    marker.setMap(null);
                }
                if (markersCount == 1) {
                    $rootScope.markers = $filter('filter')($rootScope.markers, { map: '!null' })
                } else {
                    markersCount = markersCount - 1;
                }
            });
        }


        var updatePendingClaims = function() {
            $scope.pendingClaims = $scope.selectedUsers.sum('pending_claims');
        }

        var updateCompletedClaims = function() {
            $scope.completedClaims = $scope.selectedUsers.sum('completed_claims');
        }

        var updateProjectPendingClaims = function() {
            angular.forEach($scope.projects, function(project) {
                if (project.id == $scope.currentProjectId) {
                    $scope.projectPendingClaims = project.pending_claims;
                }
            })
        }

        var updateProjectCompletedClaims = function() {
            angular.forEach($scope.projects, function(project) {
                if (project.id == $scope.currentProjectId) {
                    $scope.projectCompletedClaims = project.completed_claims;
                }
            })
        }


        var updateSeletedData = function() {
            updatePendingClaims();
            updateCompletedClaims();
            updateProjectPendingClaims();
            updateProjectCompletedClaims();
        }

        var refreshDataForChangeInPanel = function() {
            $scope.getResumen();
            $scope.getClaims();
        }

        $scope.changeTimeCode = function() {
            refreshDataForChangeInPanel();
        }

        $scope.changeCurrentProject = function() {
            refreshDataForChangeInPanel();
        }

        $scope.selectUser = function(user) {
            $scope.selectedUsers.push(user);
            $scope.freeUsers = $filter('filter')($scope.freeUsers, { id: '!' + user.id })
            createPositionMarkerFromUser(user);
            $scope.getClaims();
            updateSeletedData();
        }

        $scope.removeUser = function(user) {
            $scope.selectedUsers = $filter('filter')($scope.selectedUsers, { id: '!' + user.id })
            $scope.freeUsers.push(user);
            deleteInfoUser(user);
            updateSeletedData();
        }

        $scope.getClaims = function() {
            var userSelectedIds = $scope.selectedUsers.map(function(user) {
                return user.id;
            });

            statusService.getClaimsFromUsers({ projectId: $scope.currentProjectId, timeCode: $scope.timeCode, 'dateIn': $scope.dateIn, 'dateOut': $scope.dateOut, 'ids[]': userSelectedIds }, function(response) {
                $scope.claims = response.data;
                drawClaimMarkers();
            }, function(error) {
                console.log(error);
            });
        }

        $scope.getResumen = function() {
            statusService.getResumenUsers({ projectId: $scope.currentProjectId, timeCode: $scope.timeCode, 'dateIn': $scope.dateIn, 'dateOut': $scope.dateOut }, function(response) {
                $scope.allUsers = response.data;
                updateResumenData(response.data);
            }, function(error) {
                console.log(error);
            });
        }


        $scope.getCount = function(type) {
            statusService.getCountTotal({ projectId: $scope.currentProjectId, timeCode: $scope.timeCode, typeCode: type }, function(response) {
                $scope.claims = response.data;
                drawClaimMarkers(type);
            }, function(error) {
                console.log(error);
            });
        }



        $scope.getClaimAmounts = function(type) {
            statusService.getClaimAmountsData({ typeCode: type }, function(response) {
                $scope.claims = response.data;
                drawClaimMarkers(type);
            }, function(error) {
                console.log(error);
            });
        }

        $scope.getProjects = function() {
            statusService.getProjects({}, function(response) {
                $scope.instalation = response.data[0];
                $scope.projects = response.data[1]
                    //Add group by default
                    //  $scope.projects.push({ id: 0, name: "Sin grupo" });
                $scope.currentProjectId = $scope.projects[0].id;
                $scope.projectPendingClaims = $scope.projects[0].pending_claims;
                $scope.projectCompletedClaims = $scope.projects[0].completed_claims;
                $scope.currentProjectName = $scope.projects[0].name;
                $scope.getResumen();
            }, function(error) {
                console.log(error);
            });
        }

        $scope.removeMarker = function(index) {

            angular.forEach($scope.newClaims, function(marker) {
                var mIndex = marker.getZIndex();
                if (mIndex == index) {
                    var i = $scope.newClaims.indexOf(marker);
                    $scope.newClaims.splice(i, 1);
                    marker.setMap(null);
                }
            })
            $window.sessionStorage.removeItem('listNewMarket');
            if ($scope.newClaims.length != 0) {
                guardarNewListMarkers();
            }
        }
        $scope.deleteCLaim = function(claimId) {


            statusService.deleteClaim({ claimId: claimId }, function(response) {
                $scope.a = response.data;
                angular.forEach($rootScope.markers, function(marker) {
                    if (marker.id == claimId) {
                        alert("El reclamo " + marker.title + " ,fue eliminado.");
                        marker.setMap(null);
                    }

                })
            }, function(error) {
                console.log(error);
            });
        }
        $scope.newGeobyAddress = function(claimId) {
            var geocoder = new google.maps.Geocoder();
            var address = document.getElementById('address').value;
            geocoder.geocode({ 'address': address }, function(results, status) {
                if (status == 'OK') {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
                    var newGeo = results[0].geometry.location;
                    $scope.resultGeo = false;
                    angular.forEach($rootScope.markers, function(marker) {

                        if (marker.id == claimId) {
                            //  marker.setPosition(newGeo);

                            $http({
                                method: 'POST',
                                url: $CONSTANTS.SERVER_URL + 'updateAddress',
                                params: { claimId: marker.id, latitude: latitude, longitude: longitude, address: address }
                            }).then(function(response) {
                                if (response.data.result == true) {
                                    $scope.resultGeo = true;
                                } else {
                                    alert(response.data.data);
                                }
                            });
                        }
                    })

                    alert("Se actualizo la ubicacion correctamente");
                    let updateMarker = $filter('filter')($rootScope.markers, { id: claimId });
                    updateMarker[0].setPosition(newGeo);


                    $rootScope.map.setCenter(results[0].geometry.location);

                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });

        }

        $scope.exportTableToExcel = function() {

            statusService.getClaimsDataExcel({ projectId: $scope.currentProjectId, timeCode: $scope.timeCode, 'dateIn': $scope.dateIn, 'dateOut': $scope.dateOut }, function(response) {
                $scope.tableExcelClaims = response.data;
                setTimeout(function() {
                    exportExceldata()
                }, 5000);

            }, function(error) {
                console.log(error);
            });
        }


        var exportExceldata = function() {
            var downloadLink;
            var dataType = 'application/vnd.ms-excel';
            var tableSelect = document.getElementById('tblData');
            var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
            let filename = ''
                // Specify file name
            filename = filename ? filename + '.xls' : 'excel_data.xls';

            // Create download link element
            downloadLink = document.createElement("a");

            document.body.appendChild(downloadLink);

            if (navigator.msSaveOrOpenBlob) {
                var blob = new Blob(['ufeff', tableHTML], {
                    type: dataType
                });
                navigator.msSaveOrOpenBlob(blob, filename);
            } else {
                // Create a link to the file
                downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

                // Setting the file name
                downloadLink.download = filename;

                //triggering the function
                downloadLink.click();
            }
        }


        $scope.editAddressClaim = function(claimId) {

            if (claimId != null) {
                $("#id_input").prop("disabled", true);
            } else {
                $("#id_input").prop("disabled", false);
            }
        }

        //Init data
        $scope.getProjects();
        $interval(function() { $scope.getResumen(); }, 45000);
        if ($scope.selectedUsers != '' || $scope.selectedUsers != null) {

            $interval(function() { $scope.getClaims(); }, 420000);
        }


        //route
        function menuClaims(data) {
            $rootScope.buttonMultipleMarker = data;
        }
    }

})();