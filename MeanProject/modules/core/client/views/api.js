function show_alert(){

  var oArgs = {

            app_key:"DjPHQVFWsH5q7D85",

            id: "20218701",

           // page_size: 25 ,

  };

  EVDB.API.call("/events/get", oArgs, function(oData) {
  

      // Note: this relies on the custom toString() methods below
	  
	  	var myJSON = JSON.stringify(oData);
		
		//console.log(myJSON);
		
		var obj = angular.fromJson(myJSON);
		
		console.log("Postal code = ", obj.postal_code);
		console.log("Latitude = ", obj.latitude);

	});	
}

function show_alert2() {
   var oArgs = {

      app_key: "DjPHQVFWsH5q7D85",

      q: "music",

      where: "Galway, Ireland", 

      "date": "2017013100-2017022000",

      page_size: 5,

      sort_order: "popularity",

   };

   EVDB.API.call("/events/search", oArgs, function(oData) {
		
      // Note: this relies on the custom toString() methods below
		
		var myJSON = JSON.stringify(oData);
		
		console.log(myJSON);

	});
}