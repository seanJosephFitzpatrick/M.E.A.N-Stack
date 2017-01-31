(function(window, google){
 
 
 //module. to contain functions. 
 
 //' var libModule' stores the result of the self invoking anonymous function. which is the constructor function 'function library'. so it stores a function, NOT an object. 
 
 var mapLibry = (function(){
    
    //constructor function
    function mapLibry(element, options){
        this.gMap = new google.maps.Map(element, options);
    }
    
    //any fuctions we want to tack onto all instances of all the objects, are put onto this prototype 
    mapLibry.prototype = {
        
    };
    
    
    
    return mapLibry;
 }());


    //factory function. Returns an instance of an object. So when this is called, a new objedt is created.
    mapLibry.create = function(element, options){
        return new mapLibry(element, options);
    };


    //attatches library to the window
    window.mapLibry = mapLibry;
 
 
 }(window, google))