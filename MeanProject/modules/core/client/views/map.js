var map;


  function initMap() {
    
        var galway = {lat: 53.2714495477047, lng: -9.056854245546901}; 
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: galway
        });
        var infoWindow = new google.maps.InfoWindow({map: map});
        //Find user's location using geolocation. Center map around location
        if (navigator.geolocation) 
        {
              navigator.geolocation.getCurrentPosition(function(position) 
              {
                var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                infoWindow.setPosition(pos);
                infoWindow.setContent('Your location');
                map.setCenter(pos);
              }, 
              function() 
              {
                handleLocationError(true, infoWindow, map.getCenter());
              });
        } 
        else
        {
          //browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }


      // create a <script> tag and set the USGS URL as the source.
      var script = document.createElement('script');
      script.src = 'C:/Users/Jason/Desktop/FinalYearProject-JAY_BRANCH/GoogleMapsTesting/MapForMonday/MarkerData.json';

       document.getElementsByTagName('head')[0].appendChild(script);

  }
  function handleLocationError(browserHasGeolocation, infoWindow, pos) 
  {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
         'Error: The Geolocation service failed.' :
         'Error: Your browser doesn\'t support geolocation.');
  }


// Loop through the results array and place a marker for each
// set of coordinates.
window.markerData = function(results) 
{
for (var i = 0; i < results.features.length; i++) 
{
  var coords = results.features[i].geometry.coordinates;
  var latLng = new google.maps.LatLng(coords[0],coords[1]);
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  var infowindow = new google.maps.InfoWindow({
      content: results.features[i].properties.name
  })
  marker.addListener('click', function() {
  infowindow.open(map, marker);
  });
}

}