var map;
var infowindow;
var service;
var thePosition;
var geocoder;
var gmarkers = [];
var parkingLabel = "P";
var iconBase = 'img/parking.png';
var myObservableArray = ko.observableArray(); // Initially an empty array
var myObservableArrayTotal = ko.observableArray();
var resultsArray = ko.observableArray();
var modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
var images = document.getElementById('myImg');
var img = images;
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
/*Code to initialize the map*/
function initMap()
{
    thePosition =
    {
      lat: 40.7413549,
      lng: -73.9980244
    };
 getMap(thePosition);
 getInfoWindow(thePosition, 'parking');

}

/*The function creates a map object and assigns it the given position as "center"*/
function getMap(thePosition)
{
   map = new google.maps.Map(document.getElementById('map'), {
    center: thePosition,
    zoom: 13
  });
}

/*The function takes in the supplied position and the type of place you want to search for, example, parking,
restaurant etc*/
function getInfoWindow(thePosition, typeOfPlace)
{
   infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: thePosition,
    radius: 500,
    type: [typeOfPlace]
  },callback);


}

/*The following piece of code is used to find out your current location. We do it by finding out the location
from which the browser is accessing the application.*/
var curr_location_feasibility = document.getElementById("curr_location");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(updatePosition);
  } else {
    curr_location_feasibility.innerHTML = "Geolocation is not supported by this browser.";
  }
}

/*When the user's current location is found, the map will be updated.*/

function updatePosition(position)
{
    thePosition =
    {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

  getMap(thePosition);

  removeMarkers();
  /*Current location of the user will be marked with a green marker*/
    var marker = new google.maps.Marker
    ({
          position: thePosition,
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          title: 'Your current location'
    });


    gmarkers.push(marker);
    infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('Your current location');
    infowindow.open(map, this);
  });

    /*A call to nearbySearch function returns the result with the type requested*/
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
    location: thePosition,
    radius: 500,
    type: ['parking']
  }, callback);

} //End of update function

function callback(results, status) {

  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var latitude = results[i].geometry.location.lat();
      var longitude = results[i].geometry.location.lng();
      var thePositionParking = {
        lat: latitude,
        lng: longitude
      };
      createMarkerForParking(thePositionParking, results[i]);
    }
  }
}
/*Function to create markers for parking around the location selected by the user*/
function createMarkerForParking(place, result) {
  //console.log(result);
  /*infowindow = new google.maps.InfoWindow();*/
  var marker = new google.maps.Marker({
    position: place,
    //icon: 'img/parking.png',
    label: parkingLabel,
    animation: google.maps.Animation.DROP,
    title: result.name,
    map: map
  });

  gmarkers.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(result.name);
    infowindow.open(map, this);
  });
}

/*I will uncomment this code later if I feel like adding custom images to my markers.*/
/*var icons = {
  parking: {
    icon: iconBase + 'parking_lot_maps.png'
  }
};*/


$(document).ready(function()
{
  vm.listDivVisible(false);
  /*Onclick events defining what should happen when image of point of interest is clicked*/
  $("#restaurant").click(function()
  {
   // $("#the_list_group").empty();
    vm.listDivVisible(true);
    $('ul').empty();
    /*To DO getInfoWindow(thePosition, 'restaurant');*/
    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: thePosition,
      radius: 500,
      type: ['restaurant']
    }, placeCallback);
  });

   $("#cafe").click(function()
   {

    vm.listDivVisible(true);
    $('ul').empty();
    /*To DO getInfoWindow(thePosition, 'restaurant');*/
    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: thePosition,
      radius: 500,
      type: ['cafe']
    }, placeCallback);
  });

  $("#bar").click(function()
  {
    vm.listDivVisible(true);
    $('ul').empty();
    /*To DO getInfoWindow(thePosition, 'restaurant');*/
    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: thePosition,
      radius: 500,
      type: ['bar']
    }, placeCallback);
  });


  $("#movie_theater").click(function()
  {
    vm.listDivVisible(true);
    $('ul').empty();
    /*To DO getInfoWindow(thePosition, 'restaurant');*/
    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: thePosition,
      radius: 500,
      type: ['movie_theater']
    }, placeCallback);
  });
  /*Whenever any category, viz. restaurants/bars/cafe/movie theater is clicked, a call will be made to
  placeCallback function*/
  function placeCallback(results, status)
  {
    if (status === google.maps.places.PlacesServiceStatus.OK)
    {
      //Setting resultsArray to blank so that whenever a new category is clicked, the list items will be cleared.
      resultsArray([]);

      for (var i = 0; i < 10; i++)
      {
       console.log("Inside For");
        var latitude = results[i].geometry.location.lat();
        var longitude = results[i].geometry.location.lng();
        var thePositionParking =
            {
              lat: latitude,
              lng: longitude
            };
          resultsArray.push({
          name: results[i].name,
          location: {
            "lat": results[i].geometry.location.lat(),
            "lng": results[i].geometry.location.lng()
          }
        });
        vm.restaurantArray.push({
          'title': resultsArray()[i].name,
          'lat': latitude,
          'lng': longitude
        });
        //$('.list-group-item').append("<li>"+ resultsArray()[i].name + "</li>" + "<hr>");

      }

    }
    else
    {
      alert('No such place found around. Please select a different point of interest.');
    }
  }

  /*Function that gets the name of the restaurant/bar/cafe/theater clicked by the user from the list item and matches
  it against the resultsArray*/
  function filterRestaurantName(restaurantName) {
    var returnedRestaurant = ko.observableArray();

    for (var i = 0; i < resultsArray().length; i++) {
      if (resultsArray()[i].name === restaurantName) {
        returnedRestaurant.push(resultsArray()[i]);
      }
    }
    return returnedRestaurant;
  }
  /*Code to identify which item from Li is selected*/

 /* function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
  }
*/
}); /*document.ready() ends here*/

function removeMarkers() {
  for (i = 0; i < gmarkers.length; i++) {
    gmarkers[i].setMap(null);
    //console.log('inside removeMarkers')
  }
}

function findParking(resultsMap, restaurant) {
  removeMarkers();
  $("#myModal").hide();
  var thePosition = new google.maps.LatLng(restaurant.lat,restaurant.lng);
  resultsMap.setCenter(thePosition);
  infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: resultsMap,
    title: restaurant.title,
    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    position: thePosition
  });
  gmarkers.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(restaurant.title);
    infowindow.open(map, this);
  });

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: thePosition,
    radius: 5000,
    type: ['parking']
  }, callback);

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var latitude = results[i].geometry.location.lat();
        var longitude = results[i].geometry.location.lng();
        var thePositionParking = {
          lat: latitude,
          lng: longitude
        };
        createMarkerForParking(thePositionParking, results[i]);
      }
    }
  }
} // function findParking ends here

function myPlace(title) {
    this.title = ko.observable(title);
}

function viewModel()
{
    var self = this;
    self.restaurantArray = ko.observableArray();
    self.restaurantArray1 = ko.observableArray();
    self.query = ko.observable("");
    self.parkingArray = ko.observableArray();

    self.listItemClick = function(restaurant)
    {
        findParking(map, restaurant);
    };

    self.listDivVisible = ko.observable(false);

    /*Logic to filter the search results.*/
    self.restaurantArray1 = ko.computed(function ()
    {
        var filter = self.query().toLowerCase();

        if (!filter)
        {
            return self.restaurantArray();
        }
        else
        {
            return ko.utils.arrayFilter(self.restaurantArray(), function (item)
            {
                return item.title.toLowerCase().indexOf(filter) !== -1;
            });
        }
    });
}//end of viewModel

var vm = new viewModel();
ko.applyBindings(vm);

/*Entire Modal Logic*/

img.onclick = function()
{
      modal.style.display = "block";
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function()
{
    modal.style.display = "none";
}


function setVisibilty()
{
    $('#the_list_group').show();
}