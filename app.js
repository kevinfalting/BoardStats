const electron = require('electron');
const Store = require('electron-store');
const gkm = require('gkm');

const store = new Store();
const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;
let tray = null;
let template = [];

app.on('ready', function() {
  tray = new Tray(electron.nativeImage.createEmpty());
  tray.setTitle('BS');
  setMenu();
  app.dock.hide();
});

gkm.events.on('key.*', function(key) {
  if (this.event === 'key.released') {
    const count = store.get(key[0], 0) + 1;
    store.set(key[0], count);
    setMenu();
  }
});

function setMenu() {
  let arr = [];
  for (let item in store.store) {
    arr.push(item);
  }
  arr.sort();
  template = arr.map((key, i) => {
    return {
      id: i,
      label: `${key}: ${store.store[key]}`
    };
  });

  template.unshift({
    id: 0,
    label: 'Quit',
    click: () => {
      app.quit();
    }
  });
  menu = Menu.buildFromTemplate(template);
  tray.setContextMenu(menu);
}
