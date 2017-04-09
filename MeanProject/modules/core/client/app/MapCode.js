   var map;
      var markerArray = [];
      var addingNewMarker = 0;
      var hasMadeMarkerButtons = false;
      var hasSelectedMarkerLocation = false;
      ///var hasMadeMarker = false;
      //var tempMarkerSaveArray = [];
      var marker;
      var infoWindow;
      var count = 0;
      var count2 = 0;
      var userMarker;
      var userMarkerInfoWindow;

        window.initMap = function(){
            var galway = {lat: 53.2714495477047, lng: -9.056854245546901};
            map = new google.maps.Map(document.getElementById('map'),
            {
              zoom: 16,
              center: galway,
              mapTypeId: 'terrain'
            });
          
          populateMap();
            console.log("In initMap");
          allowGeolocation();
      }
        
    
    function populateMap()
    {
        //Create a <script> tag and set the sample data as the source
        var script = document.createElement('script');
        script.src = './sampleMapData.json';
        document.getElementsByTagName('head')[0].appendChild(script);
          
          console.log("In Populate map");
       //Loop through the results array and place a marker for each set of coordinates.
        window.sampleData = function(results) 
        {
            for (var i = 0; i < results.features.length; i++) 
            {
                var coords = results.features[i].geometry.coordinates;
                var latLng = new google.maps.LatLng(coords[0],coords[1]);
                var marker = new google.maps.Marker
                ({
                    position: latLng,
                    map: map
                });
            
                infowindow = new google.maps.InfoWindow;
                
                //Listener below adapted from here: http://stackoverflow.com/questions/27754101/change-google-maps-marker-icon-when-clicking-on-other
                
                google.maps.event.addListener(marker, 'click', (function(marker, i) 
                {
                    return function()
                    {
                        infowindow.setContent(results.features[i].properties.name);
                        infowindow.open(map, marker);
                    }
            
                })(marker, i));       
            }
        }
    }
      
        
    function allowGeolocation()
    {
        console.log("In Allowgeolocation");
        if (navigator.geolocation) 
        {
             
            findUserLocation(); 
        } 
        else
        {
          //browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
    }
        
        
    function findUserLocation()
    {
       console.log("In find geolocation");
      //find user's location using geolocation
      navigator.geolocation.getCurrentPosition(function(position) 
      { 
        var newPoint = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          
         if (userMarker)
         {
            // Marker already created - move it
            userMarker.setPosition(newPoint);
            userMarkerInfoWindow.setPosition(newPoint); 
            
         }
         else
         {
             
            // Marker does not exist - create it
            var image = './userIcon.png'
            userMarker = new google.maps.Marker
            ({
                position: newPoint,
                map: map,
                icon: image
            });
           
            var userLocationString = "You are here.";
            userMarkerInfoWindow = new google.maps.InfoWindow({content: userLocationString})
            
             userMarker.addListener('click', function() 
             {
                userMarkerInfoWindow.open(map, userMarker);
             });
             
              map.setCenter(newPoint);
        
         }
          
          
        //TEST PRINT +++++++++++++++++++
        count++;
        console.log("\n" + newPoint.toString() + " Count: " + count); //test location
        //+++++++++++++++++++
          
      });
        
      // Call findUserLocation() function every 3 seconds
      setTimeout(findUserLocation, 3000);
        
    }
        
        
    function handleLocationError(browserHasGeolocation, infoWindow, pos) 
    {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
         'Error: The Geolocation service failed.' :
         'Error: Your browser doesn\'t support geolocation.');
    }
    
        
    //dynamically create buttons for saving or cancelling user made marker   
    function createButtons()
    {
       var floatingPanel = document.getElementById("floating-panel");
       var buttonText
        
       for (var i=0; i< 2; i++)
       {
           switch(i)
           {
                case 0: //create save button
                    var saveButton = document.createElement("button");
                    buttonText = document.createTextNode("Save"); 
                    saveButton.appendChild(buttonText);
                    floatingPanel.appendChild(saveButton);
                    saveButton.onclick = function()
                    {
                        console.log("save button clicked"); 
                        if (hasMadeMarker)
                        {
                              //ASK USER TO NOW ENTER DETAILS FOR LOCATION, THEN ADD MARKER AND DATA TO DATABASE.
                            alert("Prompt user to now enter details for location, then add these along with marker coords to database. Prevent this marker from now being removed with cancel button");
                            floatingPanel.removeChild(saveButton);
                            floatingPanel.removeChild(cancelButton); 
                            hasMadeMarkerButtons = false;
                            ///hasMadeMarker = false;
                        }
                        else
                        {
                             alert("Please first tap map to add new location.");   
                        }
                    };
                    break;
                case 1: //create cancel button
                    var cancelButton = document.createElement("button");
                    buttonText = document.createTextNode("Cancel"); 
                    cancelButton.appendChild(buttonText);
                    floatingPanel.appendChild(cancelButton);
                    cancelButton.onclick = function()
                    {
                        console.log("cancel button clicked");  
                        setMapOnMarker(null);  
                        floatingPanel.removeChild(saveButton);
                        floatingPanel.removeChild(cancelButton);
                        hasMadeMarkerButtons = false;
                        
                    };  
                    break;
            }  
       }
         
        
    }
        
        
      // Creates a new marker for the map and adds it to an array.
      function createMarker(location) 
      {
        var marker = new google.maps.Marker(
        {
          position: location,
          map: map
        });
          
        markerArray.push(marker); 
       
      }

    
     //Create event listener allowing user to add marker to map
      function addNewMarker()
      {
          
        
          if (!hasMadeMarkerButtons)
          {
             createButtons();
             hasMadeMarkerButtons = true;
          }
              
              
           // This event listener will call createMarker() when the map is clicked.
          //Adapted from: http://stackoverflow.com/questions/1544151/google-maps-api-v3-how-to-remove-an-event-listener
          var createMarkerlistenerHandle = google.maps.event.addListener(map, 'click', function(event) 
          {
                hasSelectedMarkerLocation = true;
                createMarker(event.latLng);
                hasMadeMarker = true;

                google.maps.event.removeListener(createMarkerlistenerHandle); //removes this specific event listener.
           }); 
        
      }
        
     function setMapOnMarker(map) 
     {
        for (var i = 0; i < markerArray.length; i++) 
        {
          markerArray[i].setMap(map);
        }
     }