//This is the JS file for Google Maps

// var placesTotalLat = null;
// var placesTotalLong = null;

// function setMapCenter(){
    
//     for(i = 0; i < placesData.length; i++){
//         placesTotalLat += placesData[i].geometry.location.lat();
//         placesTotalLong += placesData[i].geometry.location.lng();
//     }
//     placesTotalLat = placesTotalLat/placesData.length;
//     placesTotalLong = placesTotalLong/placesData.length;
// }

// setMapCenter();

function createNewMarker(results){
    
    var marker = new google.maps.Marker({
    position: {
        lat: results.geometry.location.lat(),
        lng: results.geometry.location.lng()
    },
    map: map,
    icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=1|FF0000|000000',
    scaledSize: new google.maps.Size(90, 90)
    });
}



function createInitialMapCenter(){
    
    var geocoder = new google.maps.Geocoder();
        var address = $('#jLocal').val();

        geocoder.geocode({ 'address': address }, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                var initLatitude = results[0].geometry.location.lat();
                var initLongitude = results[0].geometry.location.lng();

                console.log('inside function: ' , initLatitude, initLongitude);
                center = new google.maps.LatLng(initLatitude, initLongitude);
                initialize();
            }
        });
}


  var map;
  //change center to geolocation of city
  
  var initLatitude = null;
  var initLongitude = null;

  var center = null;
  var indexesToBeSpliced = [];
  function initialize() {

      map = new google.maps.Map(document.getElementById('map'), {
          center: center,
          zoom: 12
      });
  }

//   google.maps.event.addDomListener(window, 'load', initialize);

  function searchCompany(companyName, i) {
      // return new Promise(function(resolve, reject) {
          var service;
          var request = {
              location: center,
              radius: '50000',
              name: companyName
          };

          service = new google.maps.places.PlacesService(map);
          service.nearbySearch(request, addToPlacesData);

          function addToPlacesData(results, status) {
              if(status !== undefined && status !== 'ZERO_RESULTS') {
                  if (status == google.maps.places.PlacesServiceStatus.OK) {
                      placesData[i] = results[0];
                  }
                  else {
                      console.log('search did not have data on results at i', i);
                      console.log('sample results ', results, status)
                  }
              }
              else{
                  console.log('zero results for', i);
                  indexesToBeSpliced.push(i);
              }
          }
  }


function mapPlacesToJobData(){
    for(var i = 0; i < placesData.length; i++){
        // if(placesData[i] !== undefined){
            findJobs.jobData.results[i].geometry = placesData[i].geometry;
            findJobs.jobData.results[i].address = placesData[i].vicinity;
            if(placesData[i].photos !== undefined){
                findJobs.jobData.results[i].photo = placesData[i].photos[0];

            }
        // }
    }
}

function renderAllMarkers(){
      var results = findJobs.jobData.results;
      var markerCounter = 1;
      for(let i = 0; i < placesData.length; i++){
          var marker = new google.maps.Marker({
              position: {
                  lat: results[i].geometry.location.lat(),
                  lng: results[i].geometry.location.lng()
              },
              map: map,
              icon: `http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=${markerCounter}|FF0000|000000`
            });
            markerCounter++;
          //EVAN ADD CUSTOM MARKER NEAR HERE WITH VALUE OF I
          google.maps.event.addListener(marker, 'click', function() {
                expandJobDescription(i);
                if ($('#map').hasClass('mapWithoutInfo') === true){
                    jobStatsMenuToggle();
                }    
                console.log('marker click, ', i);
          });
    }
}

function populateMarkers(){
      for(var i = 0; i < 9; i++) {
          searchCompany(findJobs.jobData.results[i].company.display_name, i);
      }
}
function spliceOutNoResults(){
      for(var i = 0; i < indexesToBeSpliced.length; i++){
          findJobs.jobData.results.splice(indexesToBeSpliced[i], 1);
          placesData.splice(indexesToBeSpliced[i], 1);
      }
}