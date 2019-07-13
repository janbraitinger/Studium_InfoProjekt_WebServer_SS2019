# WebServer to compress videodata
This web server is programmed in JavaScript. 
### installation
#### pull repository
Pull this repository https://github.com/janbraitinger/Studium_InfoProjekt_WebServer_SS2019 or download and unzip it
#### download mongodb
Download the databasehandler mongodb at https://www.mongodb.com/download-center/community and install it
Use the complete installer and don't change the settings
#### download ffmpeg and set the path in sourcecode of ffmpeghandler.js
Download ffmpeg here: https://ffmpeg.org/download.html 
After this, change the path on the file 'ffmpegHandler.js' on line 9
```javascript
ffmpeg.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe");
```
#### run it
run the command node app.js or just nodemon on the termianl. 
But for this, you have to be in the right folder.



