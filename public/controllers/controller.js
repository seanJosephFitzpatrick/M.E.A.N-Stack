var myApp = angular.module('myApp',[]);

myApp.controller('mainController' , function($scope ,$http){
    
    console.log("Hello From controller");
    
var refresh = function(){
     $http.get('/contactlist').success(function(response){
        console.log("I got the data i requested");
        $scope.contactlist = response;
         //empty the boxes 
         $scope.contact= "";
    });

};
    
refresh();
    
    $scope.addContact = function(){
      console.log($scope.contact);  
        //name of the database and what we have to send 
        //and you get back response as well 
        //which is on console you can see by pressing ctrl+shift+j
        $http.post('/contactlist' , $scope.contact).success(function(response){
            console.log(response);
            //straight away call refresh function to load data after pressing the add contact button
            refresh();
        });
    };
    
   //remove the contact
 $scope.remove= function(id){
     console.log(id);
     //call the refresh function after delete the record so its reload the new data from mongo db.
     $http.delete('/contactlist/'+id).success(function(response){
         refresh();
     });
 };  
    
    
    
//takes the object id and put that contact in input boxes
$scope.edit = function(id){
    console.log(id);
    $http.get('/contactlist/'+ id).success(function(response){
        //this line will put the response what we got from mongodb to the input boxes .
       $scope.contact = response; 
    });
};

    
    
//update fuction to update the contact
    
$scope.update = function(){
    console.log($scope.contact._id);
    //send to the server whatever we have edited
    $http.put('/contactlist/' + $scope.contact._id,$scope.contact).success(function(response){
        refresh();
    })
};
    
    
//clear the problem when update to deselect that 
$scope.deselect = function(){
    $scope.contact = "";
};
    
    
    
    
    
    
});