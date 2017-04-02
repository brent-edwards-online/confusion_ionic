angular.module('conFusion.controllers', [])

/*
.controller('AppCtrl', [ '$scope', '$ionicModal', '$timeout', '$localStorage', 'favoriteFactory', function($scope, $ionicModal, $timeout, $localStorage, favoriteFactory ) {
*/

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker ) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userInfo', '{}');
  $scope.reservation = {};
  $scope.registration = {};
    
  // ***** Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userInfo', $scope.loginData);  
      

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
    
    
  // ***** Reservation Modal
   $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });
    
  $scope.closeReserve = function(){
      $scope.reserveform.hide();
  };
    
  $scope.reserve = function(){
      $scope.reserveform.show();
  };
    
  $scope.doReserve = function(){
      console.log('Doing reservation', $scope.reservation);

    $timeout(function() {
      $scope.closeReserve();
    }, 1000);  
  };
    
  // ***** Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
        console.log('Doing registration', $scope.reservation);

        // Simulate a registration delay. Remove this and replace with your registration
        // code if using a registration system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };  
    
    $ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
        $scope.takePicture = function() {
            
            console.log('Getting picture...');
             
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });

            $scope.registerform.show();

        };
        
        var gallery_options = {
            maximumImagesCount: 1,
            width: 100,
            height: 100,
            quality: 50
        };
        
        $scope.chooseImage = function() {
            $cordovaImagePicker.getPictures(gallery_options)
            .then(function (results) {
                if( results.length > 0) {
                    console.log('Image URI: ' + results[0]);
                    $scope.registration.imgSrc = results[0];
                }
                
                $scope.registerform.show();
            }, function(error) {
                console.log(err);
            });
            
        };
    });
    
})

.controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate' ,'$ionicPlatform','$cordovaToast', function ($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaToast) {
            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";
            $scope.dishes = dishes;
    
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            }
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            }
    
            $scope.addFavorites = function(index) {
                favoriteFactory.addToFavorites(index);
                $ionicListDelegate.closeOptionButtons();
                
                $ionicPlatform.ready(function () {
                    
                    /*
                    $cordovaLocalNotification.schedule({
                        id: 1,
                        title: "Added Favorite",
                        text: $scope.dishes[index].name })
                    .then(function () {
                        console.log('Added Favorite '+$scope.dishes[index].name);
                    },
                    function () {
                        console.log('Failed to add notification');
                    });
                    */
                    
                    $cordovaToast
                        .show('Added Favorite '+$scope.dishes[index].name, 'long', 'center')
                        .then(function (success) {
                            // success
                        }, function (error) {
                            // error
                    });
                });
            }
            
        }])

.controller('ContactController', ['$scope', function($scope) {
            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
        }])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
            
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

.controller('DishDetailController', ['$scope', '$stateParams','dish', 'menuFactory', '$ionicPopover','$ionicModal','$ionicPlatform','$cordovaToast', 'favoriteFactory', 'baseURL', function($scope, $stateParams, dish, menuFactory, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaToast, favoriteFactory, baseURL) {
            
            $scope.baseURL = baseURL;
            $scope.dish = {};
            $scope.showDish = false;
            $scope.message="Loading ...";
    
            $scope.dishcomment = {};
    
            $scope.dish = dish;
            
            $scope.popover = $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', { scope: $scope })
                .then(function(popover) {
                    $scope.popover = popover;
            });


            $scope.openPopover = function($event) {
                $scope.popover.show($event);
            };
            
            $scope.closePopover = function() {
                $scope.popover.hide();
            };
            
            //Cleanup the popover when we're done with it!
            $scope.$on('$destroy', function() {
                $scope.popover.remove();
            });
    
            // Execute action on hide popover
            $scope.$on('popover.hidden', function() {
            // Execute action
            });
    
            // Execute action on remove popover
            $scope.$on('popover.removed', function() {
            // Execute action
            });
    
            $scope.addFavorites = function(index) {
                favoriteFactory.addToFavorites(index);
                $ionicListDelegate.closeOptionButtons();
            };
            
            $scope.addCurrentToFavorite = function(){
                favoriteFactory.addToFavorites($scope.dish.id);
                $scope.closePopover();
                
                 $ionicPlatform.ready(function () {
                        
                /*                     
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.dishes[index].name })
                .then(function () {
                    console.log('Added Favorite '+$scope.dish.name);
                },
                function () {
                    console.log('Failed to add notification');
                });
                */
                     
                $cordovaToast
                  .show('Added Favorite '+$scope.dish.name, 'long', 'bottom')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });
                });
            };
    
    
        // ***** Dish Comment Modal
   $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.dishcommentform = modal;
  });
    
  $scope.closeDishComment = function(){
      $scope.dishcommentform.hide();
  };
    
  $scope.openDishComment = function(){
      $scope.closePopover();
      $scope.dishcommentform.show();
  };
    
  $scope.addDishComment = function(){
      
    console.log('Doing dish comment', $scope.dishcomment);
    var mycomment = {rating:parseInt($scope.dishcomment.rating), comment:$scope.dishcomment.comment, author:$scope.dishcomment.yourname, date: new Date().toISOString()};
      
   $scope.dish.comments.push(mycomment);
   $scope.closeDishComment();
   menuFactory.update({id:$scope.dish.id},$scope.dish);
      
  };
}])

.controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            $scope.submitComment = function () {
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                $scope.dish.comments.push($scope.mycomment);
                menuFactory.update({id:$scope.dish.id},$scope.dish);
                $scope.commentForm.$setPristine();
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
}])

.controller('IndexController', ['$scope', 'dish', 'promotion', 'leader', 'baseURL', function($scope, dish, promotion, leader, baseURL) {
                        $scope.baseURL = baseURL;
                        $scope.showDish = false;
                        $scope.message = "Loading ...";
                        $scope.dish = dish;
                        $scope.promotion = promotion;
                        $scope.leader = leader;
}])


.controller('AboutController', ['$scope', 'leaders', 'baseURL', function($scope, leaders, baseURL) {
                    $scope.baseURL = baseURL;     
                    $scope.leaders = leaders;            
}])

.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate','$ionicPopup', '$ionicLoading', '$timeout','$cordovaVibration', '$ionicPlatform', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout,$cordovaVibration, $ionicPlatform ) {

                    $scope.baseURL = baseURL;
                    $scope.shouldShowDelete = false;
                    $scope.favorites = favorites;
                    $scope.dishes = dishes;
    
                    $scope.toggleDelete = function () {
                        $scope.shouldShowDelete = !$scope.shouldShowDelete;
                        console.log($scope.shouldShowDelete);
                    }

                    $scope.deleteFavorite = function (index) {
                        
                        var confirmPopup = $ionicPopup.confirm({
                            title: "Confirm Delete",
                            template: "Are you sure you want to delete this item?"
                        });
                        
                        
                        confirmPopup.then(function(res){
                            if(res){
                                favoriteFactory.deleteFromFavorites(index);  
                                $ionicPlatform.ready(function () {
                                    $cordovaVibration.vibrate(100);
                                });
                            }
                        });
                        
                        $scope.shouldShowDelete = false;
                    }                    
                }])

.filter('favoriteFilter', function () {
    return function (dishes, favorites) {
        var out = [];
        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < dishes.length; j++) {
                if (dishes[j].id === favorites[i].id)
                    out.push(dishes[j]);
            }
        }
        return out;

    }})
;
