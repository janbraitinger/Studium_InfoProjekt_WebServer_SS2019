var dropZone,
    loadingCSS,
    _validFileExtensions = ['mov', 'mp4', 'MOV', '3gp', 'avi'],
    errField,
    maxSize = 50;

window.onload = function init() {



    errField = document.getElementById("msg");
    dropZone = document.getElementById("dropZone");

    //dropZone.addEventListener('dragenter', over, false)
    dropZone.addEventListener('dragleave', nover, false);
    dropZone.addEventListener('dragover', over, false);
    dropZone.addEventListener('drop', drop, false)
        // deactivate stylesheet 
    loadingCSS = document.styleSheets[1];
    loadingCSS.disabled = true;
}

function over(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    dropZone.style.backgroundColor = "lightgreen";
    dropZone.style.backgroundImage = "url('img/upload_black.png')";
    // dropZone.innerHTML = "drop your file <b>here</b>";

}

function nover(event) {
    //dropZone.innerHTML = " ";
    dropZone.style.backgroundImage = "url('img/upload_grey.png')";
    dropZone.style.backgroundColor = "white";
}

function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    let dt = e.dataTransfer,
        files = dt.files,
        file = files[0],
        formData = new FormData();
    dropZone.style.backgroundColor = "white";
    dropZone.style.backgroundImage = "url('img/upload_grey.png')";
    //dropZone.innerHTML = file["name"];
    alert("sry, actually we don't support drag'n'drop :-(");
    /* 
        var xhr = new XMLHttpRequest();
        formData.append('file', file);
        xhr.open('POST', '/upload', true);

        xhr.send(formData);
        console.log("weg damit"); */


}

// based on https://gist.github.com/alvarouribe/3831021
function Validate(files) {

    let arrInputs = document.getElementsByTagName("input");
    for (var i = 0; i < arrInputs.length; i++) {
        let oInput = arrInputs[i]; // gibt den <input Tag zurueck>
        if (oInput.type == "file") {
            let sFileName = oInput.value; // gibt den Wert - Also den Dateien-Name 
            if (sFileName.length > 0) {
                let fileEnding = sFileName;
                if (checkForPoints(fileEnding) == 1) // checking for '.' in string
                    fileEnding = fileEnding.split('.').pop(); // checking for ending (after .)
                for (var j = 0; j < _validFileExtensions.length; j++) {
                    fileEnding = fileEnding.toLocaleLowerCase();
                    if (fileEnding == _validFileExtensions[j]) {
                        changeToLoadingScreen();
                        dropZone.style.backgroundColor = "lightgreen";
                        document.formular.submit();
                        return true;
                    }
                }
                sendErrorMsg("Forbidden fileextension!\n Allowed: " + _validFileExtensions);
                return false;




                /*  for (var j = 0; j < _validFileExtensions.length; j++) {
                     var sCurExtension = _validFileExtensions[j];
                     console.log(_validFileExtensions[i] + " - " + arrInputs[i].value);
                     if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {

                         dropZone.style.backgroundColor = "lightgreen";
                         document.formular.submit();
                         changeToLoadingScreen();
                         break;
                     } else {
                         sendErrorMsg("Forbidden fileextension!\n Allowed: " + _validFileExtensions);
                         return false;
                     }
                 } */
            }
        }
    }
    return true;
}

function ValidateSize(file) {
    // if server doesn't send data
    if (maxSize < 55 * 1024 * 1024) {
        maxSize = 55 * 1024 * 1024;
    }

    var FileSize = file.files[0].size;
    if (FileSize > maxSize) {
        sendErrorMsg(`File is to large: Max ${maxSize/1024/1024} MB`);
        return false;
    }
    Validate(file);
    return true;
}

function sendErrorMsg(input) {
    errField.innerHTML = input;
    //window.location = '/';
}

function checkform() {
    if (document.formular.file.value == "") {
        sendErrorMsg("Please select a video");
        console.log("checkform");
        return false;
    } else {
        Validate();
    }
}

function changeToLoadingScreen() {
    loadingCSS.disabled = false;
    document.getElementById("msg").innerHTML = "";
}

// get allowed fileExtensions from server
function handlerServerFileExtensions(input, uploadLimit) {
    maxSize = uploadLimit;
    if (input !== undefined) {
        input = input.toString();
    }

    let tmpArray = [];
    let j = 0;
    for (let i = 0; i < _validFileExtensions.length; i++) {
        if (_validFileExtensions[i] !== undefined) {
            if (input.includes(_validFileExtensions[i])) {
                tmpArray[j] = _validFileExtensions[i].toLocaleLowerCase();
                j++;
            }
        }
    }
    _validFileExtensions = tmpArray;
    console.log(maxSize);
}

function updateTextInput(val) {
    document.getElementById('textInput').value = val;
}

// count '.' in string
function checkForPoints(str) {
    let letter_Count = 0;
    for (let position = 0; position < str.length; position++) {
        if (str.charAt(position) == '.') {
            letter_Count += 1;
        }
    }
    console.log("Anzahl Punkte: " + letter_Count);
    return letter_Count;
}