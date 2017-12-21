const express = require('express')
const app = express()
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser')
    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
}));

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/copyNewest', function (req, res) {
    console.log('copyNewest')
    copyFile();
    res.send('Got a POST request')
    //res.download
})
app.post('/copyTimeroom', function (req, res) {
    console.log('copyTimeroom');
    console.log(req);
})
app.use(express.static('public'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

function log_string(string){
    console.log(string)
}

function copyFile() {
    var fs = require('fs');

    // destination.txt will be created or overwritten by default.
    fs.copyFile('/root/little-helper/from/test.jpg', '/root/destination.jpg', (err) => {
        if (err) throw err;
        console.log('source.jpg was copied to destination.jpg');
    });
    //
    // let src = path.join(__dirname, 'from/test.txt');
    // let destDir = path.join(__dirname, 'to');
    // let readStream = fs.createReadStream(src);
    // let filename = 'test.txt';
    // let dest = path.join(destDir, filename)
    // fs.access(destDir, (err) => {
    //     if(err)
    //         fs.mkdirSync(destDir);
    //
    //         copyFile(src, path.join(destDir, filename));
    // });
    //
    //
    // readStream.once('error', (err) => {
    //     console.log(err);
    // });
    //
    // readStream.once('end', () => {
    //     console.log('done copying');
    // });
    //
    // readStream.pipe(fs.createWriteStream(dest));
}
