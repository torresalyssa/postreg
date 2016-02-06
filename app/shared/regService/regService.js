app.factory('regService', ["$rootScope", "$http", "$filter", "$timeout",
    function ($rootScope, $http, $filter, $timeout) {

        var service = {};

        var user = undefined;

        service.getUser = function() {
            return user;
        };

        service.clearUser = function() {
            user = undefined;
        };

        service.register = function(code) {
            return $timeout(function() {
                user = {
                    firstName: "Bob",
                    lastName: "Bob",
                    email: "bob@bob.com"
                };
                return user;
            }, 1500);
        };

        return service;

    }]);
