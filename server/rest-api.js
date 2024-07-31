var mongoClient = require("mongodb").MongoClient;
var cors = require("cors");
var express = require("express");

var conStr = "mongodb://127.0.0.1:27017";
var app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

var dbClient;
mongoClient.connect(conStr, { useUnifiedTopology: true })
    .then(client => {
        dbClient = client;
        console.log("Database connected");
    })
    .catch(err => {
        console.error("Database connection error", err);
        process.exit(1);
    });

app.get("/get-admin", (req, res) => {
    var database = dbClient.db("video-project-db");
    database.collection("tbladmin").find({}).toArray()
        .then(documents => res.send(documents))
        .catch(err => {
            console.error("Error fetching admins", err);
            res.status(500).send("Internal Server Error");
        });
});

app.get("/get-categories", (req, res) => {
    var database = dbClient.db("video-project-db");
    database.collection("tblcategories").find({}).toArray()
        .then(documents => res.send(documents))
        .catch(err => {
            console.error("Error fetching categories", err);
            res.status(500).send("Internal Server Error");
        });
});

app.post("/add-video", async (req, res) => {
    try {
        var video = {
            VideoId: parseInt(req.body.VideoId),
            Title: req.body.Title,
            Url: req.body.Url,
            Description: req.body.Description,
            Likes: parseInt(req.body.Likes),
            Dislikes: parseInt(req.body.Dislikes),
            CategoryId:parseInt(req.body.CategoryId)
        };
        var database = dbClient.db("video-project-db");
        await database.collection("tbvideos").insertOne(video);
        // res.redirect("/get-videos")
        res.status(201).send("Video added");

    } catch (err) {
        console.error("Error adding video", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/get-videos", (req, res) => {
    var database = dbClient.db("video-project-db");
    database.collection("tbvideos").find({}).toArray()
        .then(documents => res.send(documents))
        .catch(err => {
            console.error("Error fetching videos", err);
            res.status(500).send("Internal Server Error");
        });
});

app.get("/get-video/:id", (req, res) => {
    var id = parseInt(req.params.id);
    var database = dbClient.db("video-project-db");
    database.collection("tbvideos").find({ VideoId: id }).toArray()
        .then(documents => res.send(documents))
        .catch(err => {
            console.error("Error fetching video", err);
            res.status(500).send("Internal Server Error");
        });
});

app.put("/edit-video/:id", (req, res) => {
    var id = parseInt(req.params.id);
    var video = {
        Title: req.body.Title,
        Url: req.body.Url,
        Description: req.body.Description,
        Likes: parseInt(req.body.Likes),
        Dislikes: parseInt(req.body.Dislikes),
        CategoryId: parseInt(req.body.CategoryId)
    };
    var database = dbClient.db("video-project-db");
    database.collection("tbvideos").updateOne({ VideoId: id }, { $set: video })
        .then(() => res.send("Video updated"))
        .catch(err => {
            console.error("Error updating video", err);
            res.status(500).send("Internal Server Error");
        });
});

app.delete("/delete-video/:id", (req, res) => {
    var id = parseInt(req.params.id);
    var database = dbClient.db("video-project-db");
    database.collection("tbvideos").deleteOne({ VideoId: id })
        .then(() => res.send("Video deleted"))
        .catch(err => {
            console.error("Error deleting video", err);
            res.status(500).send("Internal Server Error");
        });
});

app.post("/add-comment", (req, res) => {
    var comment = {
        CommentId: parseInt(req.body.CommentId),
        Description: req.body.Description,
        VideoId: parseInt(req.body.VideoId)
    };
    var database = dbClient.db("video-project-db");
    database.collection("tblcomments").insertOne(comment)
        .then(() => res.send("Comment added"))
        .catch(err => {
            console.error("Error adding comment", err);
            res.status(500).send("Internal Server Error");
        });
});

app.get("/get-comment/:id", (req, res) => {
    var id = parseInt(req.params.id);
    var database = dbClient.db("video-project-db");
    database.collection("tblcomments").find({ CommentId: id }).toArray()
        .then(documents => res.send(documents))
        .catch(err => {
            console.error("Error fetching comment", err);
            res.status(500).send("Internal Server Error");
        });
});

app.listen(7070, () => {
    console.log(`Server started: http://127.0.0.1:7070`);
});
