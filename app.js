const express = require('express')
const app = express()
const fs = require('fs');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dburl = 'mongodb://localhost:27017/little-helper';
const dbName = 'little-helper';

var bodyParser = require('body-parser')
    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
}));

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/copyNewest', (req, res) => {
    copyFile();
    res.send('Got a POST request')
    //res.download
})
app.post('/copyTimeroom', (req, res) => {
    console.log('copyTimeroom');
    console.log(req);
})
app.use(express.static('public'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

// MongoClient.connect(dburl, function(err, client) {
//     assert.equal(null, err);
//     console.log("Connected successfully to server");
//
//     const db = client.db(dbName);
//     db.createCollection("little-helper", function(err, res) {
//         if (err) throw err;
//         console.log("Collection created!");
//         // db.close();
//     });
//
//     client.close();
// });


function log_string(string){
    console.log(string)
}

function copyFile() {
    var fileslist = [];
    var path = '/users/jojoe/desktop';
    // var path = '/root/little-helper/from/test.jpg';
    var path = '/home/pi/photos'

    MongoClient.connect(dburl, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const lhdatabase = client.db("little-helper");
        var collection = lhdatabase.collection("little-helper");

        fs.readdir(path, (err, files) => {
            var nextindex = 0;
            collection.find({}).toArray((err, docs) => {
                docs.forEach(doc => {
                    if(nextindex < doc._id){
                        nextindex = doc._id + 1;
                    }
                    files.forEach(file => {
                        console.log(nextindex);
                        var obj = {}
                        obj.filename = file;
                        obj._id = nextindex;
                        fileslist.push(obj)
                        nextindex += 1;
                    });
                });
                console.log(fileslist);
                collection.insertMany(fileslist, (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log(err);
                    }
                    console.log("successfully");
                });
            });
        });
    });

    //
    // fs.stat(path, function(err, stats) {
    //     console.log(stats.mtime);
    // })

    // fs.copyFile(path, '/root/destination.jpg', (err) => {
    //     if (err) throw err;
    //     console.log('source.jpg was copied to destination.jpg');
    // });
}
