 function loaddata() {
        //get vars 
        var oArgs = {
		
			app_key: "DjPHQVFWsH5q7D85",

			  q: "music",

			  where: "Galway, Ireland", 

			  sort_order: "popularity",
        };

        var content = '';

        //API CALL
        EVDB.API.call("/events/search", oArgs, function(oData) {
            console.log(oData)
			
			var myJSON = JSON.stringify(oData);
		
			console.log(myJSON);

            //Get the title for each item
            for (var i = 0;i < oData.events.event.length;i++) {
                content += "Title: " + oData.events.event[i].title + " City: " 
				+ oData.events.event[i].city_name +  " Latitude: "
				+ oData.events.event[i].latitude + " Lonitude: "
				+ oData.events.event[i].longitude +
				'<br><br>';
            }

            // Show Data on page
            $("#ListItems").html(content);
        });
    }