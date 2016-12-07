//MODULE
var petApp = angular.module("petApp", ["ui.bootstrap", "ngRoute", "ngResource", "ngAnimate", "ngCookies", "ngSanitize"]);


//SERVICES

petApp.service("sharedService", function () {


   var type = "";
   var id = "";

   var newID = function (newID) {
      id = newID;
   }
   var getID = function () {
      return id;
   }

   var getType = function () {
      return type;
   };

   var getGender = function () {
      return gender;
   };

   var getAge = function () {
      return age;
   };

   var getBreed = function () {
      return breed;
   };

   return {
      newID: newID,
      getID: getID

   };

});

//ROUTES
petApp.config(function ($routeProvider) {

   $routeProvider

      .when("/", {
      templateUrl: "pages/home.html",
      controller: "homeController"
   })

   .when("/pets", {
         templateUrl: "pages/pets.html",
         controller: "petController"
      })
      //      .when("/petDetail", {
      //         templateUrl: "pages/petDetail.html",
      //         controller: "petDetailController"
      //      })
});





//CONTROLLERS
petApp.controller("homeController", ["$scope", "$location", "$routeParams", "sharedService", "$window", "$resource", "$cookies", function ($scope, $location, $routeParams, sharedService, $window, $resource, $cookies) {

   $cookies.remove("options");

   $scope.age = "Any";
   $scope.ages = ["Any", "Baby", "Young", "Adult", "Senior"];
   $scope.breed = undefined;
   $scope.setAge = function (age) {
      $scope.age = age;
      if (age = "Any") {
         sharedService.age = undefined;
         return;
      }
      sharedService.age = age;
   }

   $scope.gender = "Any";
   $scope.genders = ["Any", "Male", "Female"];
   $scope.setGender = function (gender) {
      $scope.gender = gender;
      if (gender === "Male")
         sharedService.gender = "M";
      else if (gender === "Female")
         sharedService.gender = "F";
      else
         sharedService.gender = undefined;
   }

   $scope.type = "Any";
   $scope.types = ["Any", "Dog", "Cat", "Bird", "Horse", "Pig", "Reptile", "Barnyard", "Smallfurry"];
   $scope.setType = function (type) {
      $scope.type = type.toLowerCase();
      if (type == "Any") {
         sharedService.type = undefined;
         return;
      }
      sharedService.type = $scope.type;
      getBreedList($scope.type);
   }

   $scope.$watch("zip", function () {
      sharedService.zip = $scope.zip;
   });
   $scope.$watch("breed", function () {
      sharedService.breed = $scope.breed;
   });

   $scope.submit = function () {
      $location.path("/pets");
   }

   var getBreedList = function (type) {
      $scope.breedAPI = $resource("http://api.petfinder.com/breed.list?key=fa55926ac35934c7a9cba7c6d287c446&format=json", {
         callback: "JSON_CALLBACK"
      }, {
         get: {
            method: "JSONP"
         }
      });
      $scope.breedResult = $scope.breedAPI.get({
         animal: type,
      });
      $scope.breedList = [];
      $scope.breedResult.$promise.then(function (data) {
         angular.forEach(data.petfinder.breeds.breed, function (obj) {
            $scope.breedList.push(obj.$t);
         });
         //      var now = new $window.Date(),
         //         // this will set the expiration to 1 month
         //         exp = new $window.Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
         //      $cookies.put('options', JSON.stringify($scope.options), {
         //         expires: exp
         //      });
      });
   }
}]);



//CONTROLLERS
petApp.controller("petController", ["$scope", "$resource", "sharedService", "$window", "$cookies", "$uibModal", function ($scope, $resource, sharedService, $window, $cookies, $uibModal) {

   $scope.options = {
      zip: sharedService.zip,
      type: sharedService.type,
      gender: sharedService.gender,
      age: sharedService.age,
      breed: sharedService.breed,
   }

   if ($cookies.get("options") != undefined) {
      var options = JSON.parse($cookies.get("options"));
      $scope.options.zip = options.zip;
      $scope.options.type = options.animal;
      $scope.options.gender = options.gender;
      $scope.options.age = options.age;
      $scope.options.breed = options.breed;
   }

   $scope.setID = function (id) {
      sharedService.newID(id);
   };

   $scope.petAPI = $resource("http://api.petfinder.com/pet.find?key=fa55926ac35934c7a9cba7c6d287c446&format=json", {
      callback: "JSON_CALLBACK"
   }, {
      get: {
         method: "JSONP"
      }
   });

   $scope.petResult = $scope.petAPI.get({
      location: $scope.options.zip,
      count: "500",
      animal: $scope.options.type,
      sex: $scope.options.gender,
      age: $scope.options.age,
      breed: $scope.options.breed
   });

   $scope.petResult.$promise.then(function (data) {
      $scope.petList = data.petfinder.pets.pet;
      //$cookies.petList = $scope.petList;
      console.log($scope.petList);

      $scope.totalItems = $scope.petList.length;
      $scope.currentPage = 1;
      $scope.itemsPerPage = 24;

      $scope.$watch('currentPage', function () {
         setPagingData($scope.currentPage);
      });

      function setPagingData(page) {
         var pagedData = $scope.petList.slice((page - 1) * $scope.itemsPerPage, page * $scope.itemsPerPage);
         $scope.list = pagedData;
      }

      var now = new $window.Date(),
         // this will set the expiration to 1 months
         exp = new $window.Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

      $cookies.put('options', JSON.stringify($scope.options), {
         expires: exp
      });
   });

   $scope.openModal = function (id) {
      $scope.id = id;
         var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '../pages/petDetail.html',
            controller: 'petDetailController',
            resolve: {
               id: function () {
                  return $scope.id;
               }
            }
         });
   };

   $scope.titleCase = function (type) {
      if (type !== undefined) {
         type = type.charAt(0).toUpperCase() + type.substring(1).toLowerCase();
         return type + "'s" + " near " + $scope.zip;
      }
   };


   $scope.isUndefined = function (data) {
      if (data !== undefined)
         return data + " & ";
   };

   $scope.hasImage = function (img) {
      if (img === undefined)
         return "img/noimage.jpg";
      else
         return img;
   };

   $scope.sex = function (sex) {
      if (sex === "M")
         return "Male";
      else
         return "Female";
   };

   $scope.size = function (size) {
      if (size === "S")
         return "Small";
      else if (size === "M")
         return "Medium";
      else if (size === "L")
         return "Large";
      else if (size === "XL")
         return "Extra Large";
   };

}]);

petApp.controller("petDetailController", ["$scope", "$resource", "sharedService", "id", "$uibModalInstance", "$window", function ($scope, $resource, sharedService, id, $uibModalInstance, $window) {

   $scope.myInterval = 4000;
   $scope.noWrapSlides = false;
   $scope.active = 0;
   //$scope.id = sharedService.getID();
   $scope.id = id;
   console.log(id);

   $scope.detailAPI = $resource("http://api.petfinder.com/pet.get?key=fa55926ac35934c7a9cba7c6d287c446&format=json", {
      callback: "JSON_CALLBACK"
   }, {
      get: {
         method: "JSONP"
      }
   });

   var pet = this;
   $scope.petDetail = $scope.detailAPI.get({
      id: $scope.id,
   }, function (data) {

   });
   console.log($scope.perDetail);

   $scope.getOptions = function (data) {
      var options = "";
      if (data !== undefined) {
         for (var i = 0; i < data.length; i++) {
            if (data[i + 1] !== undefined) {
               options += data[i].$t + " - ";
            } else {
               options += data[i].$t;
            }
         }
         return options;
      }
   }

}]);
