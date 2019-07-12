/**
 *  Dieses Modul ist fuer die Datenanbindung zustaendig
 *  MongoDB
 */

print("mongoDB Handler initiallisiert");

var dbo;
const MongoClient = require('mongodb').MongoClient,
    url = "mongodb://localhost:27017/mydb",
    schedule = require('node-schedule').scheduleJob('47 * * * *', () => dataBaseTrigger()); // triggered the dataBaseTrigger function at midnight

var dateFormat = require('dateformat');

// Connect to database -> database is installed of server
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) {
        throw err;
    } else {
        print("database is connected");
    }
    dbo = db.db("mydb");

});


function handleDBConnection() {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        dbo = db.db("mydb");
        createCollection();
    });
}

function createCollection() {
    dbo.createCollection(collectionName, function(err, res) {
        if (err) throw err;
    });
}


function insertDataBase(obj) {
    dbo.collection(collectionName).insertOne(obj, function(err, res) {
        if (err) throw err;
        dbo.close;
    });
}

// check the database data and if date of data > deadline -> remove 
function dataBaseTrigger() {
    handleDBConnection();
    let i;
    print("trigger aktiv!");
    dbo.collection(collectionName).countDocuments({}, function(err, max) {
        dbo.collection(collectionName).find({}).toArray(function(err, result) {
            for (i = 0; i < max; i++) {
                let tmpObj = result[i],
                    tmpObj_date = new Date(tmpObj["time"]),
                    tmpObj_path = tmpObj["path"],
                    tmpObj_name = tmpObj["filename"],
                    datesBetween = calcDays(tmpObj_date, new Date());
                print("file is " + datesBetween + " day(s) old");
                if (datesBetween >= daysToDeleteFile) {
                    deleteFile(tmpObj_path, tmpObj_name);
                }
            }
        });

    });
}

// how many days is the data old
function calcDays(date1, date2) {
    let ONE_DAY = 1000 * 60 * 60 * 24,
        date1_ms = date1.getTime(),
        date2_ms = date2.getTime(),
        difference_ms = Math.abs(date1_ms - date2_ms);
    return Math.round(difference_ms / ONE_DAY);
}

// delete files and remove database entrys
function deleteFile(path, file) {
    path = "./public/" + path;
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
            return
        }
        print('file deleted successfully');
        var myquery = { filename: file };
        dbo.collection(collectionName).deleteOne(myquery, function(err, obj) {
            if (err) {
                print(err);
            } else {
                print("database: " + obj + " document was deleted")
            }
        });
    });
    deleteCompressedData(file);
}

// delete the compressed files
function deleteCompressedData(file) {
    file = "public/upload/compressed/" + file;
    fs.unlink(file, (err) => {
        if (err) {
            console.error(err)
            return
        }
    });
}

// helper for getting data from obj
function objToString(obj, index, key) {
    let tmpObj = obj[index - 1];
    return JSON.stringify(tmpObj[key]);
}




// get size of a obj
Object.size = function(obj) {
    let size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size - 1; // wieso ?!
};