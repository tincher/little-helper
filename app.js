// init express
const express = require('express')
const app = express()

// import fs for file-stats and copy function
const fs = require('fs');
const path = require('path');

// // init Mongodb
// const MongoClient = require('mongodb').MongoClient;
// const dburl = 'mongodb://localhost:27017/little-helper';
// const dbName = 'little-helper';

// init couchdb
var nano = require('nano')('http://localhost:5984');
nano.db.create('photos');
var photos = nano.db.use('photos');

// init scipts
const exec = require('child_process').exec;
const testscript = exec('sh ~/little-helper/scripts/testscript.sh');
const mountscript = exec('sh ~/little-helper/scripts/mount.sh');
const unmountscript = exec('sh ~/little-helper/scripts/unmount.sh');

// log stdout of testscript
testscript.stdout.on('data', data => {
    console.log(data);
});
testscript.stderr.on('data', data => {
    console.log(data);
});

// log stdout of mountscript
mountscript.stdout.on('data', data => {
    console.log(data);
});
mountscript.stderr.on('data', data => {
    console.log(data);
});

// log stdout of unmountscript
unmountscript.stdout.on('data', data => {
    console.log(data);
});
unmountscript.stderr.on('data', data => {
    console.log(data);
});

// init progress for progressbar
var progress = 100;


// let app listen at port 3000
app.listen(3000, () => console.log('Example app listening on port 3000!'))

var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

// mapping post for copyNewest
app.post('/copyNewest', (req, res) => {
    // copyFile();
    copyNewestFiles();
    res.send('Got a POST request')
    //res.download
})

// mapping get for progress
app.get('/progress', (req, res) => {
    // console.log(progress);
    res.send(progress.toString());
})

// expose dimension (front end)
app.use(express.static('dimension'))


// unused log function
function log_string(string) {
    console.log(string);
}

// copyfile with couchdb
function copyNewestFiles() {
    var srcpath = '/users/jojoe/desktop/';
    var dbfiles = [];
    var filenames = [];
    var fileobjects = [];

    fs.readdir(srcpath, (err, files) => {
        photos.list({
            include_docs: true
        }, function(err, body) {
            if (err) {
                console.log(err)
            } else {
                if (body.rows.length != 0) {
                    body.rows.forEach(doc => {
                        dbfiles.push(doc.doc.name);
                    });
                }
                // console.log(body.rows);
            }
            if (dbfiles.length != 0) {
                files.forEach(file => {
                    if (!dbfiles.includes(file)) {
                        filenames.push(file);
                        obj = {
                            name: file
                        };
                        console.log(obj);
                        photos.insert(obj, (err, body, header) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("successfully");
                            }
                        });
                    }
                });
            }



            // //copy given file (path)
            // docnames.forEach(docname => {
            //     progress = 0;
            //     var srcfile = srcpath + "/" + docname;
            //     var destfile = destpath + "/" + docname;
            //     progress = progress + docnames.length / 100;
            //     console.log("src: " + srcfile);
            //     console.log("dest: " + destfile);
            //     fs.copyFile(srcfile, destfile, (err) => {
            //         if (err) throw err;
            //         console.log("copied file successfully");
            //     });
            // })
        });
    });
}

// // whole copy file thingy TODO needs refactoring
// // mongodb
// function copyFile() {
//     // array of objects for DB
//     var fileslist = [];
//     // array of the filenames as strings
//     var docnames = [];
//
//     // config for pi
//     var destpath = '/home/pi/photos'
//
//     // // config for windows
//     // var srcpath = '/users/jojoe/Desktop'
//     // var destpath = '/users/jojoe/Desktop/nfolder';
//
//     // connect to Mongodb
//     MongoClient.connect(dburl, function(err, client) {
//         if (err) {
//             console.log(err);
//         }
//         console.log("Connected successfully to server");
//
//         // connect to database and collection
//         const lhdatabase = client.db("little-helper");
//         var collection = lhdatabase.collection("little-helper");
//
//         // get content of the source directory
//         fs.readdir(srcpath, (err, files) => {
//             var nextindex = 0;
//
//             // get collection content as array
//             collection.find().toArray((err, docs) => {
//
//                 // var docnames = [];
//
//                 // get next index manually TODO automated method
//                 if (docs.length != 0) {
//                     docs.forEach(doc => {
//                         if (nextindex < doc._id) {
//                             nextindex = doc._id + 1;
//                         }
//                         docnames.push(doc.filename);
//                     });
//                 }
//
//                 // create database-ready objects and push them into an
//                 // array that will be inserted into the DB
//                 files.forEach(file => {
//                     var obj = {}
//                     obj.filename = file;
//                     obj._id = nextindex;
//                     nextindex += 1;
//                     if (!docnames.includes(file)) {
//                         fileslist.push(obj);
//                     }
//
//                 });
//
//                 //insert the objects into the DB
//                 if (fileslist.length != 0) {
//                     collection.insertMany(fileslist, (err, result) => {
//                         if (err) {
//                             console.log(err);
//                         } else {
//                             console.log("successfully");
//                         }
//                     });
//                 }
//
//
//             });
//         });
//     });