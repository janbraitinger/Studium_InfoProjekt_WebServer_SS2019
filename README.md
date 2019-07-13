## How to 'install' the webserver

### pull repository
Pull this repository https://github.com/janbraitinger/Studium_InfoProjekt_WebServer_SS2019 or download and unzip it.
### download mongodb
Download the databasehandler 'mongodb' at https://www.mongodb.com/download-center/community and install it.<br/>
Use the <b>complete</b> installer and don't change the settings
### download ffmpeg and set new path 
Download ffmpeg here: https://ffmpeg.org/download.html <br/>
After this, change the path to the new <b>ffmpeg.exe</b> on 'ffmpegHandler.js' (line 9).
```javascript
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe");    // <-- change path 
```
### run it
```console
node app.js 
```
or just
```console
nodemon
```
