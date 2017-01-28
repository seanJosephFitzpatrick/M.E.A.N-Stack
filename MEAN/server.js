var express = require('express');

var app = express(); //we will be using the express.js
var mongojs = require('mongojs');//require the mongodb module 
var db = mongojs('globtrotter',['globtrotter']); //which mongodb database we will be using 

//now we have to require body parser 
var bodyParser = require('body-parser');

//so that our app can use express.js
app.use(express.static(__dirname +"/public"));
//so that our app can use bodyparser
app.use(bodyParser.json());

app.get('/accountUsers' , function(req, res){
    console.log("I received a GET request");
    
    //getting the data from mongodb
    db.accountUsers.find(function(err , docs){
        console.log(docs);
        res.json(docs);
    }); 
});


app.post('/accountUsers' , function(req , res){
    // To parse the data and server doent know how to parse , we  need to install another module called " body parser" .so lets intall it from command promt by typing npm install body parser 
    console.log(req.body);
    db.accountUsers.insert(req.body ,function(err , doc){
        res.json(doc);
    })
});

app.delete('/accountUsers/:id',function(req , res){
    var id = req.params.id;
    console.log(id);
    //pass the id to the mongodb to delete the exact record we want to delete and get the data back 
    db.accountUsers.remove({_id:mongojs.ObjectId(id)},function(err , doc){
        res.json(doc);
    })
    
});


//after update the contact we need to get it back as well
app.get('/accountUsers/:id' ,function(req ,res){
    var id = req.params.id;
    console.log(id);
    db.accountUsers.findOne({_id:mongojs.ObjectId(id)},function(err,doc){
       res.json(doc); 
    });
    
});


//use http put request to change the current contact
app.put('/accountUsers/:id',function(req ,res){
   var id = req.params.id;
    console.log(req.body.name);
    db.accountUsers.findAndModify({query: {_id: mongojs.ObjectId(id)},
             update: {$set: {firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, number: req.body.number}},
             new: true},function(err ,doc){
                    res.json(doc);
        });    
});


app.listen(3000);
console.log("server runnig on port 3000");