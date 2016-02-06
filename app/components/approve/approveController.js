/**
 * Created by mkahn on 12/4/14.
 */

/**
 *
 * Picker Screen Controller
 *
 */

app.controller("approveController",[ "$scope", "media", "$location", "a8API", function($scope, media, $location, a8API) {

    console.log("approveController be loaded.");

    $scope.a8Origin = a8API.getSiteOrigin();

    $scope.p = media.getPicked();

    $scope.back = function(){
        $location.path("/picker");
    };

    $scope.reg = function(){
        $location.path("/register");
    };

}]);