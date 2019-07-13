/**
 *  Dieses Modul ist fuer die eigentliche Komprimierung zustaendig
 *  FFmpeg
 */

print("FFmpeg Handler initiallisiert");

var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe"); // <-- change path 


const compressedPath = "/upload/compressed/",
    _standardFPS = '25',
    _codec = {
        H264: 'libx264',
        H265: 'libx265',
        AV1: 'libaom-av1'
    },
    { H264, H265, AV1 } = _codec,
    _audio = {
        ON: '1.0',
        OFF: '0.0'
    };


// the main function for handling all ffmpeg stuff
function handleFFmpeg(obj, i, res, deadline, compressParameter) {
    let filename = objToString(obj, i, "filename"),
        path = objToString(obj, i, "path");

    filename = normalize(filename);
    path = "public/" + normalize(path);

    isDataAvailable(path, res); //check if file exists
    compressVideo(path, res, filename, deadline, compressParameter);
}


// compress the video and write it to new folder
function compressVideo(path, res, filename, deadline, compressParameter) {

    let codec = compressParameter["codec"],
        videoRes = compressParameter["resolution"],
        audio = compressParameter["audio"],
        framePerSecond = compressParameter["framePerSecond"];


    print(`${codec} - ${audio} - ${videoRes}`);
    switch (codec) {
        case 'h264':
            codec = H264;
            break;
        case 'h265':
            codec = H265
            break;
        case 'av1':
            codec = AV1
            break;
        default:
            codec = H264;
    }

    framePerSecond = (framePerSecond === undefined) ? _standardFPS : framePerSecond;
    audio = (audio == 'audio_on') ? _audio.ON : _audio.OFF; // turn audio on/off
    print(`${codec} - ${audio} - ${videoRes}`); //debug

    new ffmpeg(path)
        .videoCodec(codec)
        .fps(framePerSecond)
        .audioFilters({
            filter: 'volume',
            options: [audio]
        })
        .on('error', function(err) {
            print('An error occurred: ' + err.message);
            res.render('index.ejs', {
                msg: err.message,
                myVar: ""
            });
        })
        .on('start', function() {
            print('Processing started !');
        })
        .on('progress', function(progress) {
            print('Processing: ' + progress.percent + '% done');
        })
        .save(`public/${compressedPath}${filename}`)
        .on('end', function(err, data) {
            print('Processing finished !');
            ffmpeg.ffprobe('public/' + compressedPath + filename, function(err, metadata) {
                res.render('show.ejs', {
                    // send videoparameters to client
                    link: downloadLinkHelper(compressedPath + filename),
                    videoname: filename,
                    codec: codec,
                    date: dateFormat(deadline, "dd.mm.yyyy"),
                    size: formatBytes(metadata.format.size),
                    length: JSON.stringify(metadata.format.duration) + " Sekunden",
                    url: `http://${hostname}:${port}${compressedPath}${filename}`
                });
            });

        });
}
// deprecated
function downloadLinkHelper(link) {
    let re = link.replace(/_/g, '/');
    let xe = re.replace(/ /g, '+');
    console.log(xe);
    return xe;
}

// return the storage space requirements as string
function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " Bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MB";
    else return (bytes / 1073741824).toFixed(3) + " GB";
};

// remove the ""
function normalize(input) {
    input = input.substring(1);
    input = input.substring(0, input.length - 1);
    return input;
}

// check is file available
function isDataAvailable(_path, res) {
    print("check is file <<" + _path + ">> is available");
    fs.access(_path, fs.F_OK, (err) => {
        if (err) {
            console.error(err)
            res.sned("error");
        } else {
            print("data exist");
        }
    });
}