var mongoClient = require("mongodb").MongoClient;
var cors = require("cors");
var express = require("express");

var conStr = "mongodb://127.0.0.1:27017";

var app = express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.get("/get-admin", (req, res)=>{
    mongoClient.connect(conStr).then(clientObj=>{
         var database = clientObj.db("video-project-db");
         database.collection("tbladmin").find({}).toArray().then(documents=>{
             res.send(documents);
             res.end();
         });
    });
});

app.listen(7070);
console.log(`Server Started : http://127.0.0.1:7070`);

