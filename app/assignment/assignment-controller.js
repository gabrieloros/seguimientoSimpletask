(function() {
    'use strict';

    angular
        .module('app')
        .controller('assignmentController', assignmentController);

    assignmentController.$inject = ['$rootScope', '$scope', '$http', '$filter', '$interval', 'statusService', '$state', '$window', '$compile', 'CONSTANTS', '$timeout'];

    function assignmentController($rootScope, $scope, $http, $filter, $interval, statusService, $state, $window, $compile, $CONSTANTS, $timeout) {
        var assignmentCntrl = this;

        assignmentCntrl.search = search;
        assignmentCntrl.form = newAssignment;
        assignmentCntrl.formUnassign = unassing;
        assignmentCntrl.deletePolygon = deletePolygon;
        assignmentCntrl.data = {};
        $scope.listGroups = [];
        $scope.listUsers = [];
        $scope.claimListAssignmentByUser = [];
        $scope.claimListNotAssignment = [];
        $scope.userPosition = [];
        $rootScope.markers = [];
        $scope.markerAssignmentId = [];
        $scope.elementPolygon = null;

        statusService.getListTheInfoForm({}, function(response) {
            $scope.listGroups = response.data[1];
            $scope.listUsers = response.data[2];
            $scope.listGroups.push({ id: 0, name: "Sin grupo" });
        }, function(error) {
            console.log(error);
        });

        var mapOptions = {
            zoom: 13,
            center: new google.maps.LatLng(-32.885, -68.8422),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        $rootScope.mapAssignment = new google.maps.Map(document.getElementById('mapAssignment'), mapOptions);


        var drawingManager = new google.maps.drawing.DrawingManager({
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['polygon']
            },
        });
        drawingManager.setMap($rootScope.mapAssignment);
        google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
            $scope.elementPolygon = event.overlay;


            if (event.type == 'polygon') {
                var polygon = event.overlay;

                angular.forEach($rootScope.markers, function(marker) {

                    if (google.maps.geometry.poly.containsLocation(marker.position, polygon) == true) {
                        $scope.markerAssignmentId.push(marker.id);
                    }
                })
            }
        });

        function deletePolygon() {
            $scope.elementPolygon.setMap(null);
        }

        function newAssignment() {
            $http({
                method: 'POST',
                url: $CONSTANTS.SERVER_URL + 'assignment',
                params: { idUser: assignmentCntrl.data.operario, claims: $scope.markerAssignmentId }
                //params: { identikey: $scope.identikey, data: claimsCntrl.data, positions: $scope.newClaims }
            }).then(function(response) {
                if (response.data.result == true) {
                    alert("Los reclamos fueron asignados correctamente");
                    assignmentCntrl.search();
                } else {
                    alert(response.data.data);
                }
            });
        }

        function unassing() {
            $http({
                method: 'POST',
                url: $CONSTANTS.SERVER_URL + 'unassing',
                params: { claims: $scope.markerAssignmentId }
            }).then(function(response) {
                if (response.data.result == true) {
                    alert("Los reclamos fueron desasignados correctamente");
                    assignmentCntrl.search();
                } else {
                    alert(response.data.data);
                }
            });
        }

        function search() {

            angular.forEach($rootScope.markers, function(marker, key) {
                marker.setMap(null);
            });
            statusService.getListClaimsAssignmentByUser({ userId: assignmentCntrl.data.operario, groupId: assignmentCntrl.data.group }, function(response) {
                $scope.claimListAssignmentByUser = response.data[1];
                $scope.userPosition = response.data[0];
                drawClaimMarkers($scope.claimListAssignmentByUser);
                createPositionMarkerFromUser($scope.userPosition);

            }, function(error) {
                console.log(error);
            });
            statusService.getListClaimsNotAssignment({ groupId: assignmentCntrl.data.group }, function(response) {
                $scope.claimListNotAssignment = response.data;
                drawClaimMarkers($scope.claimListNotAssignment);

            }, function(error) {
                console.log(error);
            });

        }


        var drawClaimMarkers = function(data) {
            angular.forEach(data, function(claim, key) {
                createClaimMarker(claim);
            });
        }

        var createClaimMarker = function(claim) {
            var infoWindow = new google.maps.InfoWindow();
            if (claim.user_id == 0) {
                var urlRoute = 'app/mapa/imagen/blue.png'
            } else {
                var urlRoute = 'app/mapa/imagen/createClaim.png'
            }
            var claimIcon = {
                url: urlRoute,
            };
            var date = new Date(claim.date);
            var marker = new google.maps.Marker({
                icon: claimIcon,
                map: $rootScope.mapAssignment,
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
                //infoWindow.setContent(compiled[0]);
                //infoWindow.setContent('<h4 style="color: #0f0f0f">' + marker.title + '</h4><br>' + compiled[0]);
                infoWindow.open($rootScope.map, marker);
            });
            $rootScope.markers.push(marker);
        }

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
                map: $rootScope.mapAssignment,
                position: new google.maps.LatLng(user.lat, user.lng),
                user_id: user.id,
                type: "position"
            });

            $rootScope.markers.push(markerUser);
        }

    }

})();