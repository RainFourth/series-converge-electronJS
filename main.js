// подключение модулей
// path - для доступа к файлам внутри проекта
const path = require("path");
// для отслеживания различных адресов
const url = require("url");

const {app, BrowserWindow} = require("electron");



let win; // window object


function createWindow() {
    win = new BrowserWindow({
        minWidth: 700,
        minHeight: 500,
        width: 800,
        height: 600,
        //icon: __dirname + "/img/icon-car.jpg", // __dirname => полный путь к нашему проекту
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
    }));

    // отображение консоли разработчика как в браузере
    //win.webContents.openDevTools();

    win.on("closed", () => win=null);

}

app.on("ready", createWindow);
app.on("window-all-closed", app.quit);