//angular.module("services");

angular.module("services",[]).service("sharedService", ["$injector", function ($injector) {

   var newID = function (newID) {
      id = newID;
   }
   var getID = function () {
      return id;
   }

   return {
      newID: newID,
      getID: getID,
      getSize: function (size) {
         if (size === "S")
            return "Small";
         else if (size === "M")
            return "Medium";
         else if (size === "L")
            return "Large";
         else if (size === "XL")
            return "Extra Large";
      },
      isUndefined: function (data) {
         if (data !== undefined)
            return data + " & ";
      },
      hasImage: function (img) {
         if (img === undefined)
            return "img/noimage.jpg";
         else
            return img;
      },
      getSex: function (sex) {
         if (sex === "M")
            return "Male";
         else
            return "Female";
      },
      titleCase: function (type) {
         if (type !== undefined) {
            type = type.charAt(0).toUpperCase() + type.substring(1).toLowerCase();
            return type + "'s" + " near " + $scope.zip;
         };
      },
      getOptions: function (data) {
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
   };
}]);