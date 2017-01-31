//self-invoking anonymous function. A way to control scope, and can be used to import other libraries. 
(function(window, google, mapLibry){
    
  mapLibry.MAP_OPTIONS = {
    
       //defines center of where map is loaded
        center: {
            lat: 53.2714495477047,
            lng: -9.056854245546901
        }, 
        zoom: 7 //initial zoom level of map
        ,disableDefaultUI: false //dis(en)ables zoom
        ,mapTypeId: google.maps.MapTypeId.ROADMAP //set type of map.
        //,maxZoom: 11
        //,minZoom: 5
        /*,zoomControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_LEFT,
            style: google.maps.ZoomControlStyle.DEFAULT
        }*/
        
        /*
        ,panControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
        }
        */
   
    };
      
  }(window, google, window.MapLibry || (window.MapLibry = {}))) //if map library returns nul (doesnt exist), set it to an empty object literal. Guarentees your working with an object



 