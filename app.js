const os                   = require("os")
const path                 = require("path")
const url                  = require("url")
const electron             = require("electron")
const {app, BrowserWindow} = require("electron")

let   mainWindow           = null

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width:  960,
    height: 600,
    show:   false
  })
  mainWindow.loadURL(url.format({
    protocol: "file:",
    slashes:  true,
    pathname: path.join(__dirname, "pokedex", "index.html")
  }))
  mainWindow.once("close", event => {
    mainWindow = null
  })
  mainWindow.once("ready-to-show", () => {
    mainWindow.show()
  })
}

app.on("ready", createMainWindow)

app.on("activate", (event, hasVisibleWindows) => {
  if(!hasVisibleWindows && os.platform == "darwin") {
    createMainWindow()
  }
})

app.on("window-all-closed", () => {
  if(os.platform != "darwin") {
    app.quit()
  }
})
