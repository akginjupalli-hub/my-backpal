// LoadPack Web Bluetooth demo
// Update these UUIDs to match your ESP32 BLE sketch if needed.
const SERVICE_UUID = "6d7f2f30-7b7c-4b4a-9b31-6d3b3e0d8c10";
const NOTIFY_CHAR_UUID = "f3b4a6d2-2c15-4f44-9b8d-2b3d11b3a701";

const statusEl = document.getElementById("status");
const leftEl = document.getElementById("left");
const rightEl = document.getElementById("right");
const totalEl = document.getElementById("total");
const rawEl = document.getElementById("raw");

const btnConnect = document.getElementById("btnConnect");
const btnDisconnect = document.getElementById("btnDisconnect");

let device = null;
let characteristic = null;

document.getElementById("year").textContent = new Date().getFullYear();

function setStatus(s) {
  statusEl.textContent = s;
}

function parseMsg(text) {
  // Expected: "L=5.23,R=4.98,T=10.21" (order doesn't matter)
  const parts = text.split(",");
  let L = null, R = null, T = null;
  for (const p of parts) {
    const [k, v] = p.split("=").map(x => x?.trim());
    if (!k || v === undefined) continue;
    const num = Number(v);
    if (Number.isNaN(num)) continue;
    if (k === "L") L = num;
    if (k === "R") R = num;
    if (k === "T") T = num;
  }
  if (L === null || R === null || T === null) return null;
  return { L, R, T };
}

async function connect() {
  if (!navigator.bluetooth) {
    alert("Web Bluetooth is not supported in this browser. Use Chrome/Edge on desktop.");
    return;
  }

  setStatus("Opening device picker…");

  device = await navigator.bluetooth.requestDevice({
    // Best: filter by your service UUID
    filters: [{ services: [SERVICE_UUID] }],
    // If you can't filter yet, comment filters and use acceptAllDevices + optionalServices instead:
    // acceptAllDevices: true,
    // optionalServices: [SERVICE_UUID],
  });

  device.addEventListener("gattserverdisconnected", () => {
    setStatus("Disconnected");
    btnDisconnect.disabled = true;
    btnConnect.disabled = false;
  });

  setStatus("Connecting…");
  const server = await device.gatt.connect();

  setStatus("Getting service…");
  const service = await server.getPrimaryService(SERVICE_UUID);

  setStatus("Getting characteristic…");
  characteristic = await service.getCharacteristic(NOTIFY_CHAR_UUID);

  await characteristic.startNotifications();
  characteristic.addEventListener("characteristicvaluechanged", (event) => {
    const value = event.target.value;
    const bytes = new Uint8Array(value.buffer);
    const text = new TextDecoder().decode(bytes).trim();

    rawEl.textContent = `Raw: ${text}`;

    const parsed = parseMsg(text);
    if (!parsed) return;

    leftEl.textContent = parsed.L.toFixed(2);
    rightEl.textContent = parsed.R.toFixed(2);
    totalEl.textContent = parsed.T.toFixed(2);
  });

  setStatus("Connected ✅ Receiving data…");
  btnDisconnect.disabled = false;
  btnConnect.disabled = true;
}

async function disconnect() {
  try {
    if (device?.gatt?.connected) device.gatt.disconnect();
  } catch (e) {
    // ignore
  } finally {
    setStatus("Disconnected");
    btnDisconnect.disabled = true;
    btnConnect.disabled = false;
  }
}

btnConnect.addEventListener("click", () => connect().catch(err => {
  console.error(err);
  setStatus(`Error: ${err?.message || err}`);
}));

btnDisconnect.addEventListener("click", () => disconnect());
