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
   var newType = function (newType) {
      type = newType;

   }

   var getType = function () {
      return type;
   };

   return {
      newID: newID
      , getID: getID
      , newType: newType
      , getType: getType
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
   console.log($scope.petDetail);

   $scope.getOptions = function (data) {
      var options = "";
      var dot = '\&#9658'
      if (data !== undefined) {
         for (var i = 0; i < data.length; i++) {
            if (data[i+1] !== undefined) {
               options += data[i].$t + " - ";
            }
            else{
               options += data[i].$t;
            }
         }
         return options;
      }
   }


}]);



petApp.controller("homeController", ["$scope", "$location", "$routeParams", "sharedService", function ($scope, $location, $routeParams, sharedService) {

   $scope.zip = sharedService.zip;
   $scope.$watch("zip", function () {
      sharedService.zip = $scope.zip;
   });

   $scope.submit = function () {
      $location.path("/pets");
   }

   $scope.setType = function (type) {
      sharedService.newType(type);
   }
}]);


//CONTROLLERS
petApp.controller("petController", ["$scope", "$resource", "sharedService", function ($scope, $resource, sharedService) {

   $scope.setID = function (id) {
      sharedService.newID(id);
   };


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