//MODULE
var petApp = angular.module("petApp", ["ui.bootstrap", "ngRoute", "ngResource", "ngAnimate"]);


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

   return {
      newID: newID
      , getID: getID

   };

});

//ROUTES
petApp.config(function ($routeProvider) {

   $routeProvider

      .when("/", {
      templateUrl: "pages/home.html"
      , controller: "homeController"
   })

   .when("/pets", {
         templateUrl: "pages/pets.html"
         , controller: "petController"
      })
      .when("/petDetail", {
         templateUrl: "pages/petDetail.html"
         , controller: "petDetailController"
      })


});





//CONTROLLERS

petApp.controller("petDetailController", ["$scope", "$resource", "sharedService", function ($scope, $resource, sharedService) {

   $scope.myInterval = 4000;
   $scope.noWrapSlides = false;
   $scope.active = 0;
   $scope.id = sharedService.getID();

   $scope.detailAPI = $resource("http://api.petfinder.com/pet.get?key=fa55926ac35934c7a9cba7c6d287c446&format=json", {
      callback: "JSON_CALLBACK"
   }, {
      get: {
         method: "JSONP"
      }

   });

   var pet = this;
   $scope.petDetail = $scope.detailAPI.get({
      id: $scope.id
   , }, function (data) {

   });

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



petApp.controller("homeController", ["$scope", "$location", "$routeParams", "sharedService", function ($scope, $location, $routeParams, sharedService) {

   $scope.age = "Age";
   $scope.ages = ["Baby", "Young", "Adult", "Senior"];
   $scope.setAge = function (age) {
      $scope.age = age;
      sharedService.age = age;
   }

   $scope.gender = "Gender";
   $scope.genders = ["Male", "Female"];
   $scope.setGender = function (gender) {
      $scope.gender = gender;
      if (gender === "Male")
         sharedService.gender = "M";
      else if (gender === "Female")
         sharedService.gender = "F";
   }

   $scope.type = "Type";
   $scope.types = ["Dog", "Cat", "Bird", "Horse", "Pig", "Reptile", "Barnyard", "Smallfurry"];
   $scope.setType = function (type) {
      $scope.type = type;
      sharedService.type = type.toLowerCase();
   }

   $scope.$watch("zip", function () {
      sharedService.zip = $scope.zip;
   });

   $scope.submit = function () {
      $location.path("/pets");
   }

}]);


//CONTROLLERS
petApp.controller("petController", ["$scope", "$resource", "sharedService", function ($scope, $resource, sharedService) {

   $scope.zip = sharedService.zip;
   $scope.type = sharedService.type;
   $scope.gender = sharedService.gender;
   $scope.age = sharedService.age;


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
      location: $scope.zip
      , count: "24"
      , animal: $scope.type
      , sex: $scope.gender
      , age: $scope.age
   });

   $scope.titleCase = function (type) {
      if (type !== undefined) {
         type = type.charAt(0).toUpperCase() + type.substring(1).toLowerCase();
         return type + "'s" + " near " + $scope.zip;
      }
   }


   $scope.isUndefined = function (data) {
      if (data !== undefined)
         return data + " & ";
   }

   $scope.hasImage = function (img) {
      if (img === undefined)
         return "img/noimage.jpg";
      else
         return img;
   }

   $scope.sex = function (sex) {
      if (sex === "M")
         return "Male";
      else
         return "Female";
   }

   $scope.size = function (size) {
      if (size === "S")
         return "Small";
      else if (size === "M")
         return "Medium";
      else if (size === "L")
         return "Large";
      else if (size === "XL")
         return "Extra Large";
   }

}]);