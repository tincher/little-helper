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
// const testscript = exec('sh ~/little-helper/scripts/testscript.sh');
const mountscript = exec('sh ~/little-helper/scripts/mount.sh');
// const unmountscript = exec('sh ~/little-helper/scripts/unmount.sh');

// // log stdout of testscript
// testscript.stdout.on('data', data => {
//     console.log(data);
// });
// testscript.stderr.on('data', data => {
//     console.log(data);
// });

// log stdout of mountscript
mountscript.stdout.on('data', data => {
    console.log(data);
});
mountscript.stderr.on('data', data => {
    console.log(data);
});

// // log stdout of unmountscript
// unmountscript.stdout.on('data', data => {
// console.log(data);
// });
// unmountscript.stderr.on('data', data => {
// console.log(data);
// });

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
    // var srcpath = '/users/jojoe/desktop/';
    var srcpath = '/home/pi/android/Interner Gemeinsamer Speicher/DCIM/Camera';
    var destpath = '/home/pi/photos'


    var dbfiles = [];
    var filenames = [];
    var fileobjects = [];

    fs.readdir(srcpath, (err, files) => {
        if (err) {
            console.log(err);
        }
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
                console.log(body.rows);
            }
            if (files.length != 0) {
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

            //copy given file (path)
            filenames.forEach(docname => {
                progress = 0;
                var srcfile = srcpath + "/" + docname;
                var destfile = destpath + "/" + docname;
                progress = progress + filenames.length / 100;
                console.log("src: " + srcfile);
                console.log("dest: " + destfile);
                fs.copyFile(srcfile, destfile, (err) => {
                    if (err) throw err;
                    console.log("copied file successfully");
                });
            })
        });
    });
}