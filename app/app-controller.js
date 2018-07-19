
(function() {
    'use strict';

    angular
        .module('app')
        .controller('appController', appController);

        appController.$inject = ['$rootScope','$scope','$http', '$filter', '$interval', 'statusServiceTest'];

    function appController($rootScope, $scope, $http, $filter, $interval, statusServiceTest) {

        $rootScope.markers = [];
        $scope.selectedUsers = [];
        $scope.freeUsers = [];
        $scope.allUsers = [];
        $scope.claims = [];
        $scope.completedClaims = 0;
        $scope.pendingClaims = 0;
        $scope.proyectPendingClaims = 0;
        $scope.proyectCompletedClaims = 0;

        var proyectTest = {
            id: 1,
            name: "Proyecto",
            pending_claims: 1234,
            completed_claims: 2222
        }

        var mapOptions = {
            zoom: 13,
            center: new google.maps.LatLng(-32.885, -68.8422),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        $rootScope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        var updateResumenData = function(arrayNew){
            //Actualizar los usuarios seleccionados e ir sacando del nuevo lo que coincide
            //Actualizar los libres e ir sacando del nuevo lo que coincide
            //Finalmente si hay algun usuario nuevo se deberá agregar en el listado de usuarios libres
            var newDataCount = arrayNew.length;
            var arrayFreeUser = angular.copy(arrayNew);
            angular.forEach(arrayNew, function(value, key) {
                var selectedUser = $filter('filter')($scope.selectedUsers, {id:  value.id })[0];
                if(selectedUser){            
                    var index = $scope.selectedUsers.indexOf(selectedUser);
                    $scope.selectedUsers[index] = value;
                    var indexToFreeUser = arrayFreeUser.indexOf(value);
                    arrayFreeUser.splice(indexToFreeUser, 1);
                }else{
                    var freeUser = $filter('filter')($scope.freeUsers, {id:  value.id })[0];
                    if(freeUser){
                        var index = $scope.freeUsers.indexOf(freeUser);
                        $scope.freeUsers[index] = value;
                        var indexToFreeUser = arrayFreeUser.indexOf(value);
                        arrayFreeUser.splice(indexToFreeUser, 1);
                    }
                }
                if(newDataCount == 1){
                    angular.forEach(arrayFreeUser, function(value, key) {
                        $scope.freeUsers.push(value);
                    });
                    drawPositionMarkers();
                    updateSeletedData();
                }else{
                    newDataCount = newDataCount - 1;
                }
            });   
        }

        var createPositionMarkerFromUser = function (user) {
            var infoWindow = new google.maps.InfoWindow();
            var image = {
                url: 'app/mapa/imagen/positionUser.png',
                size: new google.maps.Size(40, 52),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(12, 40)
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
            infoWindow.open($rootScope.map, markerUser);

            google.maps.event.addListener(markerUser, 'click', function () {
                infoWindow.open($rootScope.map, markerUser);
            });
            $rootScope.markers.push(markerUser);
        }

        var createClaimMarker = function (claim) {           
            var infoWindow = new google.maps.InfoWindow();
            var claimIcon = {
                url: 'app/mapa/imagen/'+ (claim.status == 'pending' ? 'claimPending-new' : 'claimClose-new') +'.png',
                size: new google.maps.Size(40, 52),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(12, 40)
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

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent('<h4 style="color: #0f0f0f">' + marker.title + '</h4>' +
                    marker.content);
                infoWindow.open($rootScope.map, marker);
            });
            $rootScope.markers.push(marker);
        }

        var drawPositionMarkers = function(){
            var markersToDelete = $filter('filter')($rootScope.markers, {type: 'position' });
            angular.forEach(markersToDelete, function(marker, key) {
                marker.setMap(null);
            });
            $rootScope.markers = $filter('filter')($rootScope.markers, {type: '!position' });
            angular.forEach($scope.selectedUsers, function(value, key) {
                createPositionMarkerFromUser(value);
            });

        }

        var deletePositionMarkerFromUser = function(user){
            var indexToDelete = -1;
            var markerToDelete = $filter('filter')($rootScope.markers, function(value, index){
                indexToDelete = index;
                return value.user_id == user.id && value.type == 'position';
            })[0];
            if (markerToDelete){
                $rootScope.markers.splice(indexToDelete, 1);
                markerToDelete.setMap(null);
            }
        }

        var drawClaimMarkers = function(){
            var markersToDelete = $filter('filter')($rootScope.markers, function(marker){
                return marker.type === 'claim';
            });
            angular.forEach(markersToDelete, function(marker, key) {
                var indexToDelete = $rootScope.markers.indexOf(marker);
                $rootScope.markers.splice(indexToDelete, 1);
                marker.setMap(null);
            });
            $rootScope.markers = $filter('filter')($rootScope.markers, {type: '!claim' });
            angular.forEach($scope.claims, function(claim, key) {
                createClaimMarker(claim);
            });
        }

        var deleteInfoUser = function(user){
            var markersCount = $rootScope.markers.length;
            angular.forEach($rootScope.markers, function(marker, key) {
                if((marker.user_id == user.id && marker.type == "claim") || (marker.user_id == user.id && marker.type == "position" )){
                    marker.setMap(null);
                }
                if(markersCount == 1){
                    $rootScope.markers = $filter('filter')($rootScope.markers, {map: '!null' })
                }else{
                    markersCount = markersCount - 1; 
                }
            });
        }

        var updatePendingClaims = function(){
            $scope.pendingClaims = $scope.selectedUsers.sum('pending_claims');
        }

        var updateCompletedClaims = function(){
            $scope.completedClaims = $scope.selectedUsers.sum('completed_claims');
        }

        var updateProyectPendingClaims = function(){
            $scope.proyectPendingClaims = $scope.allUsers.sum('pending_claims');
        }

        var updateProyectCompletedClaims = function(){
            $scope.proyectCompletedClaims = $scope.allUsers.sum('completed_claims');
        }

        var updateSeletedData = function(){
            updatePendingClaims();
            updateCompletedClaims();
            updateProyectPendingClaims();
            updateProyectCompletedClaims();
        }

        $scope.selectUser = function(user){
            $scope.selectedUsers.push(user);
            $scope.freeUsers = $filter('filter')($scope.freeUsers, {id: '!' + user.id })
            createPositionMarkerFromUser(user);
            $scope.getClaims();
            updateSeletedData();
        }
        
        $scope.removeUser = function(user){
            $scope.selectedUsers = $filter('filter')($scope.selectedUsers, {id: '!' + user.id })
            $scope.freeUsers.push(user);
            deleteInfoUser(user);
            updateSeletedData();        
        }
        
        $scope.getClaims = function(){
            statusServiceTest.getClaimsFromUsers($scope.selectedUsers).then(function (response) {
                $scope.claims = response.data;
                drawClaimMarkers();
            },function(error){
                console.log(error);
            });  
        }

        $scope.getResumen = function(){
            statusServiceTest.getResumenUsers().then(function (response) {
                $scope.allUsers = response.data;
                updateResumenData(response.data);
            },function(error){
                console.log(error);
            });
        }
        $scope.getResumen();
        $interval( function(){ $scope.getResumen(); }, 5000);
        $interval( function(){ $scope.getClaims(); }, 15000);
        


    }

})();
