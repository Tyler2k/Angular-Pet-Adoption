//MODULE
var petApp = angular.module("petApp", ["ngRoute", "ngResource"]);


//SERVICES

petApp.service("sharedService", function () {

   this.zip = "85254";
   var type = ""
   var newType = function (newType) {
      type = newType;

   }

   var getType = function () {
      return type;
   };
   
   return {
    newType: newType,
    getType: getType
  };

});

//ROUTES
petApp.config(function ($routeProvider) {

   $routeProvider

      .when("/", {
      templateUrl: "pages/home.htm"
      , controller: "homeController"
   })

   .when("/pets", {
      templateUrl: "pages/pets.htm"
      , controller: "petController"
   })


});





//CONTROLLERS
petApp.controller("homeController", ["$scope", "$location", "$routeParams", "sharedService", function ($scope, $location, $routeParams, sharedService) {

   $scope.zip = sharedService.zip;
   $scope.$watch("zip", function () {
      sharedService.zip = $scope.zip;
   });

   $scope.submit = function () {
      $location.path("/pets");
   }

   $scope.setType = function (type) {
      type = '"' + type + '"';
   }

   $scope.setType = function (type) {
      sharedService.newType(type);
   }
   $scope.type = sharedService.getType();

}]);


//CONTROLLERS
petApp.controller("petController", ["$scope", "$resource", "sharedService", function ($scope, $resource, sharedService) {

   $scope.zip = sharedService.zip;

   $scope.petAPI = $resource("http://api.petfinder.com/pet.find?key=fa55926ac35934c7a9cba7c6d287c446&format=json", {
      callback: "JSON_CALLBACK"
   }, {
      get: {
         method: "JSONP"
      }
   });


   $scope.shelterAPI = $resource("http://api.petfinder.com/shelter.get?key=fa55926ac35934c7a9cba7c6d287c446&format=json&token=139d1f4e241689651e8c5764f89bd268&id=AZ100", {
      callback: "JSON_CALLBACK"
   }, {
      get: {
         method: "JSONP"
      }
   });

   $scope.type = sharedService.getType();

   $scope.petResult = $scope.petAPI.get({
      location: $scope.zip
      , count: "24"
      , animal: $scope.type
   });

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