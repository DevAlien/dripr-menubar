//var electron = require('electron');
var path = require('path')
var app = require('app');
var fs = require('fs');
var notifier = require('node-notifier');
var globalShortcut = require('global-shortcut');
const BrowserWindow = require('browser-window');
const Configstore = require('configstore');
const pkg = require('./package.json');
var clipboard = require('clipboard');

// Init a Configstore instance with an unique ID e.g.
// package name and optionally some default values
const conf = new Configstore(pkg.name, {user: false});
global.conf = conf;
//console.log(electron)
function test(test) {
  console.log('adede')
}
//console.log(global)
app.on('ready', function() {
  // var win = new BrowserWindow({ width: 800, height: 600, frame: false });
  // win.loadUrl('file://' + path.join(app.getAppPath(), 'index.html'))
  // win.webContents.openDevTools();
  // console.log('file://' + path.join(app.getAppPath(), 'index.html'))

  // Register a 'ctrl+x' shortcut listener.
  var ret = globalShortcut.register('ctrl+x', function() {
    console.log('ctrl+x is pressed');
    var child_process = require('child_process');

    // exec: spawns a shell.
    child_process.exec('screencapture -s ./testa.png', function(error, stdout, stderr){
        upload('testa.png');
    });
  });

  if (!ret) {
    console.log('registration failed');
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered('ctrl+x'));
});

app.on('will-quit', function() {
  // Unregister a shortcut.
  globalShortcut.unregister('ctrl+x');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

var menubar = require('menubar')

var mb = menubar({width:250, height:200, preloadWindow: true, icon: 'icon.png'})

mb.on('ready', function ready () {
  console.log('app is ready')
  console.log(mb.window)
  //console.log(mb)
})
mb.on('show', function show() {
  mb.window.reload();
})


function upload(name) {
    var request = require('request');
    var formData = {
      file: fs.createReadStream('./' + name),
    };
    var user = conf.get('user');
    var headers = {};
    if(user && user.accessToken) {
      console.log('assss')
      headers = {'Authorization': 'Bearer ' + user.accessToken}
    }
    console.log('judeuhde')
    request.post({url:'http://localhost:8101/files', formData: formData, headers: headers}, function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error('upload failed:', err);
      }
      body = JSON.parse(body)

      clipboard.writeText(body.url);
      var options = {
  icon: "http://yourimage.jpg",
  body: body.url
 };
 notifier.notify({
  title: 'Screenshot Uploaded',
  message: body.url,
  // icon: path.join(__dirname, 'coulson.jpg'), // absolute path (not balloons)
  sound: true, // Only Notification Center or Windows Toasters
  wait: false // wait with callback until user action is taken on notification
}, function (err, response) {
  // response is response from notification
});
 fs.unlink('./' + name, function (err) {
     if (err) throw err;
   });
   });
 }
