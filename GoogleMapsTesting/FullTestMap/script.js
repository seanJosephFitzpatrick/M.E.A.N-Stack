//self-invoking anonymous function. A way to control scope, and can be used to import other libraries. 
(function(window, google, mapLibry){
    
   
    //map options 
    var options = mapLibry.MAP_OPTIONS,
        
        
         /*{
        
        //defines center of where map is loaded
        center: {
            lat: 53.2714495477047,
            lng: -9.056854245546901
        }, 
        zoom: 7 //initial zoom level of map
        ,disableDefaultUI: false //dis(en)ables zoom
        //,mapTypeId: google.maps.MapTypeId.ROADMAP //set type of map.
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
      
   
    }, */
 
 
    
    //element that map loads inside of
    element = document.getElementById('map-canvas'),
    
    
    //map itself
    map = mapLibry.create(element, options);
        //new google.maps.Map(element, options);
    
    
}(window, google, window.MapLibry)); 



