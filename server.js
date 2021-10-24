const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config');
const base62 = require('./base62.js');
const Url = require('./models/url');

const app = express()
mongoose.connect(config.db.connectionString);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post("/api/shorten", (req, res) => {
    var longUrl = req.body.url;
    var shortUrl = '';
    // check if url already exists in database
    Url.findOne({long_url: longUrl}, function (err, doc){
        if (doc){
            // base62 encode the unique _id of that document and construct the short URL
            shortUrl = config.webhost + base62.encode(doc._id);
            // since the document exists, we return it without creating a new entry
            res.send({'shortUrl': shortUrl});
        } else {
            // The long URL was not found in the long_url field in our urls
            // collection, so we need to create a new entry:
            var newUrl = Url({
                long_url: longUrl
            });
            // save the new link
            newUrl.save(function(err) {
                if (err){
                    console.log(err);
                }
                // construct the short URL
                shortUrl = config.webhost + base62.encode(newUrl._id);
                res.send({'shortUrl': shortUrl});
            });
        }
    });
});

app.get("/:encoded_id", (req, res) => {
    var base62Id = req.params.encoded_id;
    var id = base62.decode(base62Id);
    
    // check if url already exists in database
    Url.findOne({_id: id}, function (err, doc){
        if (doc) {
        // found an entry in the DB, redirect the user to their destination
        res.redirect(doc.long_url);
        } else {
        // nothing found, take 'em home
        res.redirect(config.webhost);
        }
    });
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
})