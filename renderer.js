//const { readdir } = require('fs');



   document.querySelector('#submit').addEventListener('click', function(e) {
    e.preventDefault();
    let uname = document.querySelector("#username");
    let pass = document.querySelector("#password");

    let userdata = {
         username:uname.value,
         password:pass.value
    }
// In renderer process (web page).
const ipcRenderer = require('electron').ipcRenderer;
console.log(ipcRenderer.sendSync('synchronous-message', userdata)); // prints "pong"   

});



