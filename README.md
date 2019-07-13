#### pull repository
Pull this repository https://github.com/janbraitinger/Studium_InfoProjekt_WebServer_SS2019 or download and unzip it.
#### download mongodb
Download the databasehandler 'mongodb' at https://www.mongodb.com/download-center/community and install it.<br/>
Use the <b>complete</b> installer and don't change the settings
#### download ffmpeg and set the path in sourcecode of ffmpeghandler.js
Download ffmpeg here: https://ffmpeg.org/download.html <br/>
After this, change the path to the new <b>ffmpeg.exe</b> on 'ffmpegHandler.js'.
```javascript
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe");    // <-- change path 
```
#### run it
run the command node app.js or just nodemon on the termianl. <br/>
But for this, you have to be in the right folder.



