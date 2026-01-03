# LoadPack Website (Showcase + Live BLE Demo)

## Files
- index.html  -> project showcase
- demo.html   -> live demo using Web Bluetooth (Chrome/Edge)
- style.css   -> shared styles
- demo.js     -> Web Bluetooth connection + parsing
- main.js     -> small helper

## Live demo requirements
- Host on HTTPS (GitHub Pages works)
- Use Chrome or Edge on desktop (Web Bluetooth)
- ESP32 must advertise SERVICE_UUID + NOTIFY_CHAR_UUID and notify strings like:
  L=5.23,R=4.98,T=10.21

## Deploy (GitHub Pages quick)
1) Create a GitHub repo named `loadpack-site`
2) Upload these files to the repo root
3) Repo Settings -> Pages -> Deploy from branch -> main / root
4) Your link will be: https://YOUR_USERNAME.github.io/loadpack-site/
