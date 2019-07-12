/**
 *  Hauptmodul
 */


const express = require('express'),
    multer = require('multer'),
    //ejs = require('ejs'),
    path = require('path'),
    fs = require('fs'),
    //progress = require('progress-stream'),
    uploadLimit = 55 * 1024 * 1024,
    port = 3000,
    daysToDeleteFile = 0,
    filetypes = /mov|MOV|mp4/;

var dataBaseObject, hostname = null;
const collectionName = "videoCollection";


eval(fs.readFileSync('mongodb.js') + '');
eval(fs.readFileSync('ffmpegHandler.js') + '');

// set storage engine 
const storage = multer.diskStorage({
    destination: './public/upload',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + generateRandomValue() + path.extname(file.originalname)); // generate new name
    }
});

function generateRandomValue() {
    return (Math.floor(Math.random() * 1010));
}

// init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: uploadLimit },
    fileFilter: function(req, file, cb) {
        checkFileExtension(file, cb);
    }
}).single('file');

function checkFileExtension(file, cb) {

    // check for Ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //const extname = filetypes.test(path.extname(file.originalname));
    // check mine type
    //const mimetype = filetypes.test(file.mimetype.toLowerCase());

    if (extname) {
        return cb(null, true)
    } else {
        print("ext " + file.extname);
        cb("Error: Forbidden fileextension");
    }
}

//init app
const app = express();

// EJS
app.set('view engine', 'ejs');
// public folder
app.use(express.static('./public'));



app.get('/', function(req, res) {
    res.render('index', {
        myVar: filetypes,
        uploadLimit: uploadLimit
    });
    // -- fuer datenschutz deaktivieren -- //
    let remoteIp = req.connection.remoteAddress,
        tmp = remoteIp.includes("ffff");
    //console.log(tmp);
    if (tmp) {
        remoteIp = remoteIp.substr(7, remoteIp.length - 7);
        print("-- Zugriff von: " + remoteIp);
    } else {
        print("Unbekannter Zugriff (" + remoteIp + ")");
    }
});

// just for testing the show frontEnd
app.get('/show', function(req, res) {

    res.render('show', {
        videoname: "filetypes",
        date: "r",
        size: "1",
        length: "11",
        link: "google.de",
        url: "google.de",
        codec: ""
    });

});


// adminpanel - here you can check in browser the database-entrys
app.get('/admin', function(req, res) {
    handleDBConnection();
    dbo.collection(collectionName).find({}).toArray(function(err, result) {
        if (err) {
            res.send("Bitte warten sie kurz");
        };
        dbo.collection(collectionName).countDocuments({}, function(err, numOfDocs) {
            if (err) {
                res.send("Bitte warten sie kurz");
            };
            let tmp = "";
            var i;
            for (i = 0; i < numOfDocs; i++) {
                tmp = "[" + i + "] - " + JSON.stringify(result[i]) + "<br/>" + tmp;
            }
            tmp = " <h1>Adminpanel</h1> <i>collection: " + collectionName + "</i><br/>-------------------------------<br/>" + tmp;
            res.send(tmp);
        });
    });
});


// when video is uploaded and compressed -> render new page
// this function handle the upload stuff and insert it into database
app.post('/upload', function(req, res) {
    hostname = req.hostname.toString();
    handleDBConnection();

    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            let compressParameter = validateCheckBoxes(req); // get data from html checkboxes
            if (compressParameter == undefined) {
                res.render('index', {
                    msg: "Error: Pls check the checkboxes!"
                });
            }
            if (req.file == undefined) {
                res.render('index', {
                    msg: "Error: No File selected"
                });
            } else {
                let dowloadUrl = req.path + "/" + req.file.filename,
                    day = (new Date()).toISOString();
                // write data to JSON Obj
                writeToObj(dowloadUrl, req.file.filename, day);
                // insert into Database
                insertDataBase(dataBaseObject);
                dbo.collection(collectionName).find({}).toArray(function(err, result) {
                    dbo.collection(collectionName).countDocuments({}, function(err, numOfDocs) {
                        let deadline = addDays(day);
                        handleFFmpeg(result, numOfDocs, res, deadline, compressParameter); // send data to ffmpeg
                    });
                });

            }
        }
    });

});


// get data from radio checkboxes of client
function validateCheckBoxes(req) {
    let tmpObj = {
        framePerSecond: req.body.framePerSecond,
        codec: req.body.checkBoxDataCodec,
        resolution: req.body.checkBoxDataRes,
        audio: req.body.checkBoxDataAudio
    };
    console.log(tmpObj);
    return tmpObj;
}

/* // set timeout if server don't anwser
app.use(function(req, res, next) {
    res.setTimeout(5, function() {
        print('Request has timed out.');
        res.send("<h1>Error 408</h1><br/>" +
            408);
    });
    next();
}); */

// add days to todays date for the deadline 
function addDays(date) {
    let result = new Date(date);
    return result.setDate(result.getDate() + daysToDeleteFile);
}

// 404 Error Handling
app.use(function(req, res, next) {
    res.status(404).send("<style>*{font-family:Arial; text-align:center;}</style><h1>Error 404</h1>Sry, this file is not available<br/><br/><a href='javascript:history.back()'>back</a>");
});

// debug
app.listen(port, function() {
    print("Server statet unter Port: " + port);
});

// create obj with videodata informations for database
function writeToObj(TMPpath, name, timestamp) {
    TMPpath = TMPpath.substring(1);
    dataBaseObject = {
        filename: name,
        path: TMPpath,
        time: timestamp
    }
}

function print(input) {
    if (input != null || input !== 'undefined') {
        console.log(input)
    }
}