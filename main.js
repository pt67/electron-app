// Modules to control application life and create native browser window
const {app, Notification, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const db = require('mysql');
const { exit } = require('process');
const { endianness } = require('os');

var con = db.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "merohisab"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});



// In the Main process.
ipcMain.on('synchronous-message', function(event, arg) {
  //console.log(arg);  // prints "ping"
  var username = arg.username; var password = arg.password;

  var sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  con.query(sql, [username, password], function (err, result) {
    if (err) throw err;
    //console.log(result);
    if(result.length > 0) {
    console.log("You are logged in");
    //event.redirect("http://google.com");

    createDashboard();  
  }else{
    console.log("Wrong credintials.")
  }

  });
});


//Listen item creation

ipcMain.on('create-items', function(event, arg) {
  console.log(arg);
  var itemname = arg.itemname; 
  var pricerate = arg.pricerate;
  var itemprice = arg.itemprice;
  
  var sql = 'INSERT INTO newItems(name, rate, price) VALUES (?, ?, ?)';
  con.query(sql, [itemname, pricerate, itemprice], function (err, result) {
    if (err) throw err;
    console.log("inserted");
  });
  

});

//Create sold items table 
ipcMain.on('sell-items', function(event, arg) {
  console.log(arg);
  var pname = arg.personname; 
  var pemail = arg.personemail;
  var pphone = arg.personphone;
  var pnote = arg.personnote
  var pselecteditem = arg.selectedItem;
  
  var sql = 'INSERT INTO soldProduct(person_name, person_email, person_phone, note) VALUES (?, ?, ?, ?)';
  con.query(sql, [pname, pemail, pphone, pnote, pselecteditem], function (err, result) {
    if (err) throw err;
    console.log("inserted");
  });
  

});





function createWindow () {

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 400,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.setResizable(false)
 
  // Open the DevTools.
  //mainWindow.webContents.openDevTools(false)
}




app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})



//Creating dashboard

function createDashboard() {


  // Create the browser window.
  const mainDash = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the index.html of the app.
  mainDash.loadFile('dashboard.html');

  //mainWindow.setResizable(false)
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  //Rendering data from mysql table and send to newitem.html
  mainDash.webContents.on('did-finish-load', () => {
    var sql1 = "SELECT * FROM newItems ORDER BY id DESC";
    con.query(sql1, function (err, result){
    if(err) throw err;
    mainDash.webContents.send('newItems', result)
    
    });


  });


  mainDash.webContents.on('did-finish-load', () => {
    var sql1 = "SELECT COUNT(id) as ct FROM newItems";
    con.query(sql1, function (err, result){
    if(err) throw err;
    mainDash.webContents.send('newItemsCount', result)
    
    });


  });

}



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

/*
const hello = async ()=>{
  await console.log("hello world");
}

module.exports = {
  hello
};
*/




















/*


CREATE TABLE newItems(
id INT(11) AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(150) NOT NULL,
rate VARCHAR(50) NOT NULL,
price VARCHAR(50) NOT NULL
);









*/