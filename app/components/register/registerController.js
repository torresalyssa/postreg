app.controller("regController", [ "$rootScope", "$scope", "$log", "ngToast", "$q", "a8API", "$timeout", "$location",
    "media", "regService", function($rootScope, $scope, $log, ngToast, $q, a8API, $timeout, $location, media, regService) {

        $log.info("regController be loaded.");

        $scope.ui = {
            ready: false,
            msg: "",
            emailError:false,
            firstNameError:false,
            lastNameError:false
        };
        $scope.user = regService.getUser();

        if (!$scope.user) {
            $scope.ui.msg = "Enter your information:";
            $scope.ui.ready = true;
        }
        else {
            $scope.ui.msg = "Confirm your information:";
            $scope.ui.ready = true;
        }

        var eventId = $rootScope.settings.eventId;


        function createGuest(){

            var localEmail = $scope.guestModel.email;
            if (!localEmail){
                localEmail = "no-email-given@test.com";
            }

            var gender = $scope.genderSelection.label.toLowerCase();
            if (gender == "unspecified"){
                gender = "declined to state";
            }

            return a8API.registerGuest({
                firstName: $scope.guestModel.firstName,
                lastName: $scope.guestModel.lastName,
                email: localEmail,
                demographics: {
                    age: $scope.ageSelection.label,
                    gender: gender
                },
                address: {
                    zip: $scope.guestModel.zipCode
                },
                mobilePhone: $scope.guestModel.phoneNumber

                // TODO: figure out where this goes
                //wantsSpam: $scope.guestModel.spamMe,
            });
        }


        function createExperience(gid){

            // TODO: media don't have a links.experience field, so how do I use existing experiences?
            /*if ($rootScope.settings.useExistingExperience){

             var expId = media.getPicked().links.experience;

             a8API.editExperience({ id: expId, owner: gid, readyForUpload:1}).then(
             function(data){
             d.resolve();
             if ($rootScope.settings.flagAfterShare) {
             updateResource('photos', media.getPicked().id, {flagged: true});
             media.load(); //kick that fucker
             }
             },
             function(err){
             d.reject();
             }
             );*/


            //} else {

            return a8API.addExperience({
                media: [media.getPicked().id],
                guests: [gid],
                event: {
                    id: eventId
                }
                // TODO: experienceName?
                // TODO: does sendEmail = $scope.guestModel.spamMe?
            });

        }


        $scope.reg = function(){
            if (validate()) {
                createGuest().then(
                    function(data) {

                        createExperience(data.data.id).then(
                            function() {
                                var flags = media.getPicked().flags;
                                flags.shared = true;

                                if ($rootScope.settings.flagAfterShare) {
                                    a8API.flagMedia(media.getPicked().id, flags);
                                    media.load(); //kick that fucker
                                }

                                $location.path('/endslate');
                            },
                            function(err) {
                                $log.error("Error creating experience: " + err);
                                $scope.showPopupModal("Email Failed");
                            }
                        );
                    },
                    function(err) {
                        $log.error("Error creating guest: " + err);
                        ngToast.create("Registration failed!");
                    }
                )
            }
        };

        function validate() {
            $scope.ui.emailError = !$scope.regForm.userEmail.$valid;
            $scope.ui.firstNameError = !$scope.regForm.userFirstName.$valid;
            $scope.ui.lastNameError = !$scope.regForm.userLastName.$valid;

            return $scope.regForm.$valid;
        }

        $scope.$watch("user.firstName", function(val) {
            if (val)
                $scope.ui.firstNameError = false;
        });

        $scope.$watch("user.lastName", function(val) {
            if (val)
                $scope.ui.lastNameError = false;
        });

        $scope.$watch("user.email", function(val) {
            if (val)
                $scope.ui.emailError = false;
        });

        $scope.submit = function() {
            if (validate()) {
                $log.info("Submitting user data for " + $scope.user.firstName);
                //TODO: is registering the same as I did above?
                regService.clearUser();
                $location.path('/endslate');
            }
        };


        $scope.back = function(){
            $location.path('/approve');
        };

    }]);
