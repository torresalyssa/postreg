app.factory('media', ["$rootScope", "$http", "$filter", "$log", "a8API",
    function ($rootScope, $http, $filter, $log, a8API) {

        var service = {};

        var picked = undefined;   // media item that is picked
        var allMedia = [];        // array of all media objects


        service.getAll = function () {
            return allMedia;
        };


        service.load = function () {
            return a8API.getResource('media').then(
                function (data) {
                    allMedia = $filter("orderBy")(data, "-createdAt");

                    if ($rootScope.settings.nukeAfterShare) {
                        _.remove(allMedia, {flags: {shared: true}});
                    }

                    $rootScope.$broadcast('refreshPics');

                },
                function (err) {
                    $log.error("Error retrieving photos: " + err);
                });

        };


        service.setPicked = function (p) {
            picked = p;
        };


        service.getPicked = function () {
            return picked;
        };


        return service;

    }]);
