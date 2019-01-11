(function() {
    'use strict';

    angular
        .module('app')
        .controller('appController', appController);

    appController.$inject = ['$rootScope', '$scope', '$http', '$filter', '$interval', 'statusService', '$window', '$compile', '$uibModal'];

    function appController($rootScope, $scope, $http, $filter, $interval, statusService, $window, $compile, $uibModal) {
        var appCntrl = this;
        appController.menuClaims = menuClaims;
        $rootScope.buttonMultipleMarker;
        $rootScope.markers = [];
        $scope.selectedUsers = [];
        $scope.freeUsers = [];
        $scope.allUsers = [];
        $scope.claims = [];
        $scope.newClaims = [];
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
        if ('identikeyST23581321' in sessionStorage) {
            $scope.viewMenu = true;
        } else {
            $scope.viewMenu = false;
        }
        if ($window.sessionStorage.getItem('identikeyST23581321') !== null) {
            $rootScope.sessionUser = $window.sessionStorage.getItem('identikeyST23581321');
        }
        $window.sessionStorage.removeItem('listNewMarket');

        $scope.closeSesion = function() {
            $window.sessionStorage.removeItem('identikeyST23581321');
        }

        var mapOptions = {
            zoom: 13,
            center: new google.maps.LatLng(-32.885, -68.8422),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        $rootScope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        var card = document.getElementById('pac-card');
        var input = document.getElementById('pac-input');
        var types = "changetype-all";
        if ($rootScope.sessionUser !== undefined) {
            $rootScope.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
        }
        var autocomplete = new google.maps.places.Autocomplete(input);

        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        autocomplete.bindTo('bounds', $rootScope.map);

        // Set the data fields to return when the user selects a place.
        autocomplete.setFields(
            ['address_components', 'geometry', 'icon', 'name']);

        var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        var marker = new google.maps.Marker({
            map: $rootScope.map,
            anchorPoint: new google.maps.Point(0, -29)
        });

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
        if ($rootScope.sessionUser !== undefined) {
            drawingManager.setMap($rootScope.map);
        }
        google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {

            if (event.type == 'marker') {
                event.overlay.visible = false;

                $scope.index++;
                //createMarker(event);
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
                url: 'app/mapa/imagen/positionUser.png'
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
                url: urlRoute
            };
            var date = new Date(claim.date);
            var marker = new google.maps.Marker({
                icon: claimIcon,
                map: $rootScope.map,
                position: new google.maps.LatLng(claim.latitude, claim.longitude),
                title: claim.code,
                content: claim.code,
                id: claim.id,
                type: "claim",
                user_id: claim.user_id
            });

            var htmlElement = '<div><h4 style="color: #0f0f0f">' + marker.title + '</h4><br><button class="btn btn-primary" ng-click="deleteCLaim(' + marker.id + ')"> Eliminar </button></div>';

            var compiled = $compile(htmlElement)($scope);

            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.setContent(compiled[0]);
                //infoWindow.setContent('<h4 style="color: #0f0f0f">' + marker.title + '</h4><br>' + compiled[0]);
                infoWindow.open($rootScope.map, marker);
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
            $scope.projectPendingClaims = $scope.allUsers.sum('pending_claims');
        }

        var updateProjectCompletedClaims = function() {
            $scope.projectCompletedClaims = $scope.allUsers.sum('completed_claims');
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
            statusService.getClaimsFromUsers({ projectId: $scope.currentProjectId, timeCode: $scope.timeCode, 'ids[]': userSelectedIds }, function(response) {
                $scope.claims = response.data;
                drawClaimMarkers();
            }, function(error) {
                console.log(error);
            });
        }
        if ($rootScope.sessionUser !== undefined) {

            $scope.getResumen = function() {
                statusService.getResumenUsers({ projectId: $scope.currentProjectId, timeCode: $scope.timeCode }, function(response) {
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
                    $scope.projects.push({ id: 0, name: "Sin grupo" });
                    $scope.currentProjectId = $scope.projects[0].id;
                    $scope.projectPendingClaims = $scope.projects[0].pending_claims;
                    $scope.projectCompletedClaims = $scope.projects[0].completed_claims;
                    $scope.currentProjectName = $scope.projects[0].name;
                    $scope.getResumen();
                }, function(error) {
                    console.log(error);
                });
            }

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

        if ($rootScope.sessionUser !== undefined) {

            //Init data
            $scope.getProjects();
            $interval(function() { $scope.getResumen(); }, 45000);
            if ($scope.selectedUsers != '' || $scope.selectedUsers != null) {

                $interval(function() { $scope.getClaims(); }, 420000);
            }
        }

        //route
        function menuClaims(data) {
            $rootScope.buttonMultipleMarker = data;
        }

        $scope.openModal = function(size) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/template/login.html',
                controller: 'loginController',
                controllerAs: 'lc',
                size: size,
            });
        }
    }

})();


(function() {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', '$uibModalInstance', '$window', '$location'];

    function loginController($scope, $uibModalInstance, $window, $location) {
        var loginc = this;

        $scope.save = function() {
            if ($scope.user != null) {
                $window.sessionStorage["identikeyST23581321"] = $scope.user;
            }
            $uibModalInstance.close();
            $location.path("");
            // $state.go('app');
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();