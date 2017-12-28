// init express
const express = require('express')
const app = express()

// import fs for file-stats and copy function
const fs = require('fs');
const path = require('path');

// init Mongodb
const MongoClient = require('mongodb').MongoClient;
const dburl = 'mongodb://localhost:27017/little-helper';
const dbName = 'little-helper';

// init scipts
const exec = require('child_process').exec;
const testscript = exec('sh ~/little-helper/scripts/testscript.sh');
const mountscript = exec('sh ~/little-helper/scripts/mount.sh');
const unmountscript = exec('sh ~/little-helper/scripts/unmount.sh');

// log stdout of testscript
testscript.stdout.on('data', data => {console.log(data);});
testscript.stderr.on('data', data => {console.log(data);});

// log stdout of mountscript
mountscript.stdout.on('data', data => {console.log(data);});
mountscript.stderr.on('data', data => {console.log(data);});

// log stdout of unmountscript
unmountscript.stdout.on('data', data => {console.log(data);});
unmountscript.stderr.on('data', data => {console.log(data);});

// init progress for progressbar
var progress = 100;


// let app listen at port 3000
app.listen(3000, () => console.log('Example app listening on port 3000!'))

var bodyParser = require('body-parser')
    app.use(bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
}));

// mapping post for copyNewest
app.post('/copyNewest', (req, res) => {
    copyFile();
    res.send('Got a POST request')
    //res.download
})

// mapping get for progress
app.get('/progress', (req, res) => {
    console.log(progress);
    res.send(progress.toString());
})

// expose dimension (front end)
app.use(express.static('dimension'))


// unused log function
function log_string(string){
    console.log(string)
}

// whole copy file thingy TODO needs refactoring
function copyFile() {
    var fileslist = [];
    var path = '/users/jojoe/desktop';
    // var path = '/home/pi/photos'
    // var path = '/root/little-helper/from/test.jpg';

    // connect to Mongodb
    MongoClient.connect(dburl, function(err, client) {
        console.log("Connected successfully to server");

        // connect to database and collection
        const lhdatabase = client.db("little-helper");
        var collection = lhdatabase.collection("little-helper");

        // get content of the source directory
        fs.readdir(path, (err, files) => {
            var nextindex = 0;

            // get collection content as array
            collection.find().toArray((err, docs) => {

                // array of the filenames as strings
                var docnames = [];

                // get next index manually TODO automated method
                if (docs.length != 0) {
                    docs.forEach(doc => {
                        if(nextindex < doc._id){
                            nextindex = doc._id + 1;
                        }
                        docnames.push(doc.filename);
                    });
                }

                // create database-ready objects and push them into an
                // array that will be inserted into the DB
                files.forEach(file => {
                    var obj = {}
                    obj.filename = file;
                    obj._id = nextindex;
                    nextindex += 1;
                    if (!docnames.includes(file)) {
                        fileslist.push(obj);
                    }

                });

                //insert the objects into the DB
                if(fileslist.length != 0){
                    collection.insertMany(fileslist, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("successfully");
                        }
                    });
                }
            });
        });
    });

    // // get the mtime of the given file(path)
    // fs.stat(path, function(err, stats) {
    //     console.log(stats.mtime);
    // })

    // //copy given file (path)
    // fs.copyFile(path, '/root/destination.jpg', (err) => {
    //     if (err) throw err;
    //     console.log('source.jpg was copied to destination.jpg');
    // });
}
