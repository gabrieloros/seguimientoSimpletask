(function() {
    'use strict';

    angular
        .module('app')
        .controller('groupAssignmentController', groupAssignmentController);

    groupAssignmentController.$inject = ['$rootScope', '$scope', '$http', '$filter', '$interval', 'statusService', '$state', '$window', '$compile', 'CONSTANTS', '$timeout'];

    function groupAssignmentController($rootScope, $scope, $http, $filter, $interval, statusService, $state, $window, $compile, $CONSTANTS, $timeout) {
        var groupAssignmentCntrl = this;

        groupAssignmentCntrl.search = search;
        groupAssignmentCntrl.form = newAssignment;
        groupAssignmentCntrl.formUnassign = unassing;
        groupAssignmentCntrl.deletePolygon = deletePolygon;
        groupAssignmentCntrl.data = {};
        $scope.listGroups = [];
        $scope.claimListAssignmentByGroup = [];
        $scope.claimListNotAssignmentByGroup = [];
        $rootScope.markers = [];
        $scope.markerAssignmentId = [];
        $scope.elementPolygon = null;

        statusService.geGroupInfoForm({}, function(response) {
            $scope.listGroups = response.data;
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
                url: $CONSTANTS.SERVER_URL + 'assignmentGroup',
                params: { idGroup: assignmentCntrl.data.group, claims: $scope.markerAssignmentId }
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
            statusService.getListClaimsAssignmentByGroup({ groupId: assignmentCntrl.data.group }, function(response) {
                $scope.claimListAssignmentByGroup = response.data;
                drawClaimMarkers($scope.claimListAssignmentByGroup);
            }, function(error) {
                console.log(error);
            });
            statusService.getListClaimsNotAssignmentByGroup({ groupId: assignmentCntrl.data.group }, function(response) {
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

            var urlRoute = 'app/mapa/imagen/createClaim.png'

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

    }

})();